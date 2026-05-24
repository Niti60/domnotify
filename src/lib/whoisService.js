const API_KEY = process.env.WHO_IS_JSON_API_KEY;
const BASE_URL = 'https://whoisjson.com/api/v1';

async function fetchWhoisJSON(endpoint, params = {}) {
    try {
        const url = new URL(`${BASE_URL}${endpoint}`);
        Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                Authorization: `Token ${API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `WHOISJSON API error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching from WHOISJSON (${endpoint}):`, error.message);
        throw error;
    }
}

export async function getWhoisData(domain) {
    return fetchWhoisJSON('/whois', { domain });
}

export async function getDomainAvailability(domain) {
    return fetchWhoisJSON('/domain-availability', { domain });
}

export async function getDNSRecords(domain) {
    return fetchWhoisJSON('/nslookup', { domain });
}

export async function getSSLCertificate(domain) {
    return fetchWhoisJSON('/ssl-cert-check', { domain });
}

export async function getSubdomains(domain) {
    return fetchWhoisJSON('/subdomains', { domain });
}

export async function getReverseWhois(query) {
    // query can be email or company name
    return fetchWhoisJSON('/reverse-whois', { query });
}
