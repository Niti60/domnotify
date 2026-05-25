'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Lock } from 'lucide-react';

export default function AuthRequiredState({
    title = "Authentication Required",
    description = "Please login to access this page and manage your domain data.",
    showLoginButton = true
}) {
    const nextPath = typeof window !== 'undefined'
        ? `${window.location.pathname}${window.location.search}`
        : '/dashboard';

    return (
        <div className="flex min-h-100 w-full flex-col items-center justify-center p-8 text-center sm:p-12 animate-in fade-in duration-500">
            <Card className="flex max-w-md flex-col items-center border-dashed bg-card/50 p-12 transition-all hover:border-muted-foreground/30">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Lock className="h-8 w-8 text-muted-foreground" />
                </div>

                <h2 className="mb-2 text-xl font-semibold tracking-tight text-foreground">
                    {title}
                </h2>

                <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
                    {description}
                </p>

                {showLoginButton && (
                    <Link href={`/auth?next=${encodeURIComponent(nextPath)}`}>
                        <Button
                            variant="primary"
                            className="px-8 shadow-lg shadow-blue-500/10"
                        >
                            Login
                        </Button>
                    </Link>
                )}
            </Card>
        </div>
    );
}
