const EXPIRING_SOON_DAYS = 30;

export function getDaysLeft(date) {
  if (!date) return null;
  const expiry = new Date(date);
  if (Number.isNaN(expiry.getTime())) return null;
  const now = new Date();
  return Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
}

export function computeDomainStatus(expiryDate) {
  const daysLeft = getDaysLeft(expiryDate);
  if (daysLeft === null) return 'Available';
  if (daysLeft < 0) return 'Expired';
  if (daysLeft <= EXPIRING_SOON_DAYS) return 'Expiring Soon';
  return 'Available';
}

export function computeSslStatus(validTo) {
  const daysLeft = getDaysLeft(validTo);
  if (daysLeft === null) return 'Unknown';
  if (daysLeft < 0) return 'Expired';
  if (daysLeft <= EXPIRING_SOON_DAYS) return 'Renew soon';
  return 'Valid';
}

export function formatDate(date) {
  if (!date) return '—';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toISOString().split('T')[0];
}

export function formatRenewalPrice(price) {
  if (price === null || price === undefined || price === '') return '—';
  if (typeof price === 'number') return `$${price.toFixed(2)}`;
  const str = String(price);
  return str.startsWith('$') ? str : `$${str}`;
}

export function parseRenewalPrice(price) {
  if (typeof price === 'number') return price;
  if (!price) return 0;
  const parsed = parseFloat(String(price).replace(/[^0-9.]/g, ''));
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function calculateDomainAge(createdDate) {
  if (!createdDate) return null;
  const created = new Date(createdDate);
  if (isNaN(created.getTime())) return null;
  const now = new Date();
  const diffTime = Math.abs(now - created);
  const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
  const diffDays = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24));

  if (diffYears > 0) return `${diffYears}y ${diffDays}d`;
  return `${diffDays}d`;
}

export function formatRelativeTime(date) {
  if (!date) return 'Never';
  const then = new Date(date).getTime();
  if (Number.isNaN(then)) return 'Never';

  const diffMs = Date.now() - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  return formatDate(date);
}

export function serializeDomain(domain) {
  const obj = domain.toObject ? domain.toObject() : domain;
  const daysLeft = getDaysLeft(obj.expiryDate);
  const status = obj.status || computeDomainStatus(obj.expiryDate);
  const sslStatus = obj.sslStatus || computeSslStatus(obj.sslValidTo);

  const getCleanVal = (val, fallback = 'Unknown') => {
    if (!val) return fallback;
    if (typeof val === 'object') {
      return val.name || val.id || val.organization || val.O || fallback;
    }
    return String(val);
  };

  return {
    _id: obj._id?.toString(),
    domain: obj.domainName,
    domainName: obj.domainName,
    registrar: getCleanVal(obj.registrar),
    domainExpiresAt: formatDate(obj.expiryDate),
    sslExpiresAt: formatDate(obj.sslValidTo),
    expiryDate: obj.expiryDate,
    daysLeft,
    renewal: formatRenewalPrice(obj.renewalPrice),
    renewalPrice: obj.renewalPrice,
    status: getCleanVal(status, 'Active'),
    lastChecked: formatRelativeTime(obj.lastChecked),
    sslIssuer: getCleanVal(obj.sslIssuer),
    sslValidFromAt: obj.sslValidFrom ? formatDate(obj.sslValidFrom) : 'Unavailable',
    sslValidToAt: obj.sslValidTo ? formatDate(obj.sslValidTo) : 'Unavailable',
    sslStatus: getCleanVal(sslStatus, 'Unknown'),
    sslDaysLeft: getDaysLeft(obj.sslValidTo),
    sslSerialNumber: getCleanVal(obj.sslSerialNumber, 'Unavailable'),
    sslEncryption: getCleanVal(obj.sslEncryption, 'Unavailable'),
    sslChainStatus: getCleanVal(obj.sslChainStatus, 'Unavailable'),
    nameservers: Array.isArray(obj.nameservers) ? obj.nameservers.map(ns => getCleanVal(ns)) : [],
    autoRenew: obj.autoRenew ?? false,
    watchlist: obj.watchlist ?? false,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
}

export function isExpiringWithinDays(expiryDate, days = EXPIRING_SOON_DAYS) {
  const daysLeft = getDaysLeft(expiryDate);
  return daysLeft !== null && daysLeft >= 0 && daysLeft <= days;
}
