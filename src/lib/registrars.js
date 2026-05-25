const registrars = {
    hostinger: {
        name: 'Hostinger',
        renewalUrl: 'https://hpanel.hostinger.com/domains',
        supportUrl: 'https://support.hostinger.com/',
    },
    namecheap: {
        name: 'Namecheap',
        renewalUrl: 'https://ap.www.namecheap.com/domains/list/',
        supportUrl: 'https://www.namecheap.com/support/',
    },
    cloudflare: {
        name: 'Cloudflare',
        renewalUrl: 'https://dash.cloudflare.com/',
        supportUrl: 'https://support.cloudflare.com/',
    },
    godaddy: {
        name: 'GoDaddy',
        renewalUrl: 'https://account.godaddy.com/products',
        supportUrl: 'https://www.godaddy.com/help',
    },
    squarespace: {
        name: 'Squarespace Domains',
        renewalUrl: 'https://account.squarespace.com/domains',
        supportUrl: 'https://support.squarespace.com/',
    },
};

/**
 * Normalizes registrar name to lowercase for lookup
 * @param {string} name 
 * @returns {string}
 */
export const normalizeRegistrarName = (name) => {
    if (!name) return '';
    const n = name.toLowerCase();
    if (n.includes('hostinger')) return 'hostinger';
    if (n.includes('namecheap')) return 'namecheap';
    if (n.includes('cloudflare')) return 'cloudflare';
    if (n.includes('godaddy')) return 'godaddy';
    if (n.includes('squarespace')) return 'squarespace';
    return n;
};

/**
 * Get registrar info by name
 * @param {string} registrarName 
 * @returns {object|null}
 */
export const getRegistrarInfo = (registrarName) => {
    const normalized = normalizeRegistrarName(registrarName);
    return registrars[normalized] || null;
};

export default registrars;
