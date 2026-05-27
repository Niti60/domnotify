import { whoisFetch } from './whoisClient';

/**
 * Normalizes WHOIS data from WHOISJSON (or other providers)
 * to a consistent schema for the frontend.
 */
export function normalizeWhoisData(raw) {
    if (!raw) return null;

    // WHOISJSON sometimes nests data under a 'whois' key
    const data = raw.whois || raw;

    const normalizeDate = (date) => {
        if (!date) return null;
        const d = new Date(date);
        return isNaN(d.getTime()) ? null : d.toISOString();
    };

    return {
        domain_name: data.domain_name || data.domain || data.domainName,
        registrar: data.registrar || data.registrar_name || 'N/A',
        created_date: normalizeDate(data.created_date || data.creation_date || data.registration_date),
        updated_date: normalizeDate(data.updated_date || data.last_updated),
        expiration_date: normalizeDate(data.expiration_date || data.expiry_date || data.expires_date),
        status: Array.isArray(data.status) ? data.status : (data.domain_status ? [data.domain_status] : []),
        name_servers: data.name_servers || data.nameservers || [],
        registrant_name: data.registrant?.name || data.registrant_name || data.registrant?.organization || 'Private/Hidden',
        registrant_email: data.registrant?.email || data.registrant_email || 'Hidden (Privacy Policy)',
        registrant_organization: data.registrant?.organization || data.registrant_organization || 'Private',
        registrant_country: data.registrant?.country || data.registrant_country || 'N/A',
        raw: data.raw || null
    };
}

/**
 * Normalizes DNS records
 */
export function normalizeDnsData(raw) {
    if (!raw) return [];
    const records = raw.records || raw;
    if (!Array.isArray(records)) return [];

    return records.map(r => ({
        type: r.type || 'UNKNOWN',
        name: r.name || '@',
        value: r.value || r.rdata || r.address || 'N/A',
        ttl: r.ttl || '3600',
        priority: r.priority || r.pref || null
    }));
}

/**
 * Normalizes Subdomain discovery data
 */
export function normalizeSubdomainData(raw) {
    if (!raw) return [];
    const subdomains = raw.subdomains || raw;
    if (!Array.isArray(subdomains)) return [];

    return subdomains.map(s => {
        if (typeof s === 'string') return { subdomain: s, target: 'N/A' };
        return {
            subdomain: s.subdomain || s.domain || 'N/A',
            target: s.target || s.cname || 'N/A'
        };
    });
}

export async function getWhoisData(domain) {
    try {
        const raw = await whoisFetch('/whois', { domain });
        return normalizeWhoisData(raw);
    } catch (err) {
        console.error(`[WHOISJSON] WHOIS lookup failed for ${domain}`);
        throw err;
    }
}

export async function getDomainAvailability(domain) {
    try {
        return await whoisFetch('/domain-availability', { domain });
    } catch (err) {
        console.error(`[WHOISJSON] Domain availability check failed for ${domain}`);
        throw err;
    }
}

export async function getDNSRecords(domain) {
    try {
        const raw = await whoisFetch('/nslookup', { domain });
        return normalizeDnsData(raw);
    } catch (err) {
        console.error(`[WHOISJSON] DNS lookup failed for ${domain}`);
        throw err;
    }
}

export async function getSSLCertificate(domain) {
    try {
        return await whoisFetch('/ssl-cert-check', { domain });
    } catch (err) {
        console.error(`[WHOISJSON] SSL lookup failed for ${domain}`);
        throw err;
    }
}

export async function getSubdomains(domain) {
    try {
        const raw = await whoisFetch('/subdomains', { domain });
        return normalizeSubdomainData(raw);
    } catch (err) {
        console.error(`[WHOISJSON] Subdomain discovery failed for ${domain}`);
        throw err;
    }
}

export async function getReverseWhois(query) {
    try {
        return await whoisFetch('/reverse-whois', { query });
    } catch (err) {
        console.error(`[WHOISJSON] Reverse WHOIS failed for query: ${query}`);
        throw err;
    }
}
