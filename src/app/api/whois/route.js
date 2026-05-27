import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import {
    getWhoisData,
    getDNSRecords,
    getSubdomains,
} from '@/lib/whoisService';

export async function GET(req) {
    try {
        const auth = requireAuth(req);
        if (auth.error) return auth.error;

        const { searchParams } = new URL(req.url);
        const domain = searchParams.get('domain')?.trim().toLowerCase();
        console.log(`[WHOIS API] Looking up: ${domain}`);

        if (!domain) {
            return NextResponse.json(
                { success: false, message: 'Domain is required' },
                { status: 400 },
            );
        }

        // Basic validation: must have at least one dot to be a valid domain
        if (!domain.includes('.') && domain !== 'localhost') {
            return NextResponse.json(
                { success: false, message: 'Please provide a valid domain name (e.g., google.com)' },
                { status: 400 },
            );
        }

        // Fetch all data in parallel
        const [whois, dns, subdomains] = await Promise.all([
            getWhoisData(domain).catch((err) => ({ error: err.message })),
            getDNSRecords(domain).catch((err) => ({ error: err.message })),
            getSubdomains(domain).catch((err) => ({ error: err.message })),
        ]);

        return NextResponse.json({
            success: true,
            data: {
                whois,
                dns,
                subdomains,
            },
        });
    } catch (error) {
        console.error('WHOIS API Error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch WHOIS/DNS data' },
            { status: 500 },
        );
    }
}
