'use client';

import { Pricing } from '@/types/types';

interface PricingWidgetProps {
    pricing: Pricing;
    isVisible?: boolean;
}

export default function PricingWidget({ pricing, isVisible = true }: PricingWidgetProps) {
    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-6 py-6 pointer-events-none md:hidden">
            <div className="max-w-7xl mx-auto flex justify-center">
                <div className="glass pointer-events-auto bg-neutral-900/90 text-white rounded-3xl px-8 py-4 shadow-2xl border border-white/10 flex items-center justify-between gap-8 animate-slide-up w-full">
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Total Estimated</div>
                        <div className="text-2xl font-black">${pricing.total.toLocaleString()}</div>
                    </div>
                    <button className="bg-primary hover:bg-primary-dark text-neutral-900 px-8 py-3 rounded-xl font-black text-sm transition-all duration-300">
                        Book Trip
                    </button>
                </div>
            </div>
        </div>
    );
}
