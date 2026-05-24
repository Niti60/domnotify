import dns from 'dns/promises';
import { connectDB } from '@/lib/db';
import Domain from '@/models/Domain';
import Alert from '@/models/Alert';
import { getSSLCertificateInfo } from '@/lib/ssl';
import {
  computeDomainStatus,
  computeSslStatus,
  getDaysLeft,
  isExpiringWithinDays,
  parseRenewalPrice,
  serializeDomain,
} from '@/lib/domainHelpers';
import { getDomainAvailability, getSSLCertificate } from '@/lib/whoisService';

export async function getUserDomains(userId, filter = {}) {
  return Domain.find({ user: userId, ...filter }).sort({ updatedAt: -1 }).lean();
}

export async function getDomainForUser(userId, domainId) {
  return Domain.findOne({ _id: domainId, user: userId });
}

export async function refreshDomainStatus(domain) {
  domain.status = computeDomainStatus(domain.expiryDate);
  domain.lastChecked = new Date();
  await domain.save();
  return domain;
}

export async function checkDomainSSL(domain) {
  try {
    // 1. Local TLS Check
    const localCert = await getSSLCertificateInfo(domain.domainName).catch(() => null);

    // 2. WHOISJSON SSL Check
    const whoisCertData = await getSSLCertificate(domain.domainName).catch(() => null);
    const whoisCert = whoisCertData?.certificate || whoisCertData || null;

    if (localCert) {
      domain.sslIssuer = localCert.issuer;
      domain.sslValidFrom = localCert.validFrom ? new Date(localCert.validFrom) : domain.sslValidFrom;
      domain.sslValidTo = localCert.validTo ? new Date(localCert.validTo) : domain.sslValidTo;
      domain.sslSerialNumber = localCert.serialNumber || domain.sslSerialNumber;
    }

    if (whoisCert) {
      domain.sslIssuer = whoisCert.issuer || domain.sslIssuer;
      domain.sslValidFrom = whoisCert.valid_from ? new Date(whoisCert.valid_from) : domain.sslValidFrom;
      domain.sslValidTo = whoisCert.valid_to ? new Date(whoisCert.valid_to) : domain.sslValidTo;
      domain.sslSerialNumber = whoisCert.serial_number || domain.sslSerialNumber;
      domain.sslEncryption = whoisCert.encryption || whoisCert.encryption_algorithm;
      domain.sslChainStatus = whoisCert.chain_status === true || whoisCert.chain_status === 'valid' ? 'Valid' : 'Incomplete/Unknown';
    }

    domain.sslStatus = computeSslStatus(domain.sslValidTo);
    domain.lastChecked = new Date();
    await domain.save();

    if (domain.sslStatus === 'Renew soon' || domain.sslStatus === 'Expired') {
      await Alert.findOneAndUpdate(
        {
          user: domain.user,
          domain: domain._id,
          type: 'ssl_expiring',
          read: false,
        },
        {
          user: domain.user,
          domain: domain._id,
          type: 'ssl_expiring',
          message: `SSL certificate for ${domain.domainName} is ${domain.sslStatus === 'Expired' ? 'expired' : 'expiring soon'}.`,
          read: false,
        },
        { upsert: true, new: true },
      );
    }

    return domain;
  } catch (err) {
    console.error(`SSL check failed for ${domain.domainName}:`, err.message);
    domain.sslStatus = 'Unknown';
    domain.lastChecked = new Date();
    await domain.save();
    return domain;
  }
}

export async function createDomainExpiryAlerts(userId) {
  const domains = await Domain.find({ user: userId }).lean();
  const alerts = [];

  for (const domain of domains) {
    if (isExpiringWithinDays(domain.expiryDate, 30)) {
      const daysLeft = getDaysLeft(domain.expiryDate);
      const message =
        daysLeft < 0
          ? `Domain ${domain.domainName} has expired.`
          : `Domain ${domain.domainName} expires in ${daysLeft} days.`;

      await Alert.findOneAndUpdate(
        {
          user: userId,
          domain: domain._id,
          type: 'domain_expiring',
          read: false,
        },
        {
          user: userId,
          domain: domain._id,
          type: 'domain_expiring',
          message,
          read: false,
        },
        { upsert: true, new: true },
      );
      alerts.push(message);
    }
  }

  return alerts;
}

export async function getDashboardStats(userId) {
  const domains = await getUserDomains(userId);
  const serialized = domains.map(serializeDomain);

  const expiringSoon = serialized.filter(
    (d) => d.status === 'Expiring Soon' || d.status === 'Expired',
  );
  const sslAlerts = serialized.filter(
    (d) => d.sslStatus === 'Renew soon' || d.sslStatus === 'Expired',
  );
  const watchlistCount = serialized.filter((d) => d.watchlist).length;
  const monitoredCount = serialized.length;

  const renewalBudget = domains
    .filter((d) => isExpiringWithinDays(d.expiryDate, 30))
    .reduce((sum, d) => sum + parseRenewalPrice(d.renewalPrice), 0);

  const unreadAlerts = await Alert.countDocuments({ user: userId, read: false });

  return {
    stats: [
      {
        label: 'Domains tracked',
        value: String(monitoredCount),
        detail: 'Available domains in portfolio',
      },
      {
        label: 'Expiring soon',
        value: String(expiringSoon.length),
        detail: 'Within 30 days',
      },
      {
        label: 'SSL alerts',
        value: String(sslAlerts.length),
        detail: 'Certificates needing attention',
      },
      {
        label: 'Monthly budget',
        value: `$${Math.round(renewalBudget).toLocaleString()}`,
        detail: 'Projected renewal spend',
      },
    ],
    totalDomains: monitoredCount,
    expiringCount: expiringSoon.length,
    sslAlertCount: sslAlerts.length,
    renewalBudget,
    watchlistCount,
    monitoredCount,
    unreadAlerts,
  };
}

export async function getMonitoringSummary(userId) {
  const domains = await getUserDomains(userId);
  const serialized = domains.map(serializeDomain);

  const expiringIn30 = serialized.filter((d) => isExpiringWithinDays(d.expiryDate, 30));
  const expiringIn10 = serialized.filter((d) => {
    const days = getDaysLeft(d.expiryDate);
    return days !== null && days >= 0 && days <= 10;
  });
  const sslDueSoon = serialized.filter(
    (d) => d.sslStatus === 'Renew soon' || d.sslStatus === 'Expired',
  );

  const renewalBudget = domains
    .filter((d) => isExpiringWithinDays(d.expiryDate, 30))
    .reduce((sum, d) => sum + parseRenewalPrice(d.renewalPrice), 0);

  const highPriorityAlerts = await Alert.countDocuments({ user: userId, read: false });

  return {
    renewalBudget,
    domainsExpiringIn10: expiringIn10.length,
    sslRenewalsDue: sslDueSoon.length,
    domainsDueIn30: expiringIn30.length,
    highPriorityAlerts,
    domains: serialized,
  };
}

export async function checkDomainAvailability(domainName) {
  try {
    const data = await getDomainAvailability(domainName);
    // WHOISJSON returns { "available": true/false }
    return !!data.available;
  } catch (error) {
    console.error(`Availability check failed for ${domainName}, falling back to DNS:`, error.message);
    try {
      await dns.resolve4(domainName);
      return false;
    } catch {
      try {
        await dns.resolveNs(domainName);
        return false;
      } catch {
        return true;
      }
    }
  }
}

export const SEARCH_TLDS = ['.com', '.io', '.dev', '.app', '.co', '.ai'];

const TLD_PRICES = {
  '.com': 9.99,
  '.io': 29.99,
  '.dev': 14.99,
  '.app': 19.99,
  '.co': 24.99,
  '.ai': 34.99,
};

export async function searchDomains(keyword) {
  const base = keyword.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9-]/g, '');
  if (!base) return [];

  const results = await Promise.all(
    SEARCH_TLDS.map(async (tld) => {
      const domain = `${base}${tld}`;
      const available = await checkDomainAvailability(domain);
      const price = TLD_PRICES[tld] || 12.99;
      return {
        domain,
        available,
        price: available ? `$${price.toFixed(2)}/yr` : 'Taken',
        registrar: available ? 'Namecheap' : 'Owned',
      };
    }),
  );

  return results;
}

export async function ensureDb() {
  await connectDB();
}
