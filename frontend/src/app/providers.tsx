'use client';

import { AuthProvider } from '@/context/AuthContext';
import { TripProvider } from '@/context/TripContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <TripProvider>
                {children}
            </TripProvider>
        </AuthProvider>
    );
}
