const BASE_URL = 'https://whoisjson.com/api/v1';

function buildUrl(endpoint, params = {}) {
    const url = new URL(`${BASE_URL}${endpoint}`);
    Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== null) {
            url.searchParams.append(key, params[key]);
        }
    });
    return url.toString();
}

export async function whoisFetch(endpoint, params = {}) {
    const apiKey = process.env.WHO_IS_JSON_API_KEY;

    if (!apiKey) {
        console.error('[WHOISJSON] Missing API key (WHO_IS_JSON_API_KEY)');
        throw new Error('WHOIS provider configuration error');
    }

    const url = buildUrl(endpoint, params);

    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `TOKEN=${apiKey}`,
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            const providerMsg = (errorData && errorData.message) ? errorData.message : `status ${res.status}`;
            console.error(`[WHOISJSON] ${endpoint} failed: ${providerMsg}`);
            throw new Error('WHOIS provider error');
        }

        return await res.json();
    } catch (err) {
        console.error(`[WHOISJSON] Request failed for ${endpoint}:`, err.message);
        throw new Error('WHOIS request failed');
    }
}
