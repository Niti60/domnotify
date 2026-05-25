import { whoisFetch } from './whoisClient';

export async function getWhoisData(domain) {
    try {
        return await whoisFetch('/whois', { domain });
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
        return await whoisFetch('/nslookup', { domain });
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
        return await whoisFetch('/subdomains', { domain });
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
