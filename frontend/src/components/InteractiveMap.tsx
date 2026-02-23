'use client';

import { useEffect, useState } from 'react';
import { Destination } from '@/types/types';

interface InteractiveMapProps {
    destination: Destination;
    markers?: Array<{ lat: number; lng: number; label: string }>;
}

export default function InteractiveMap({ destination, markers = [] }: InteractiveMapProps) {
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setMapLoaded(true), 800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="w-full h-full bg-neutral-100 rounded-[2.5rem] overflow-hidden relative border border-neutral-100 shadow-inner">
            {!mapLoaded ? (
                <div className="w-full h-full flex items-center justify-center bg-neutral-50">
                    <div className="text-center">
                        <div className="w-8 h-8 border-2 border-neutral-200 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-neutral-300">Rendering Grid</div>
                    </div>
                </div>
            ) : (
                <>
                    <div
                        className="w-full h-full bg-neutral-200 relative grayscale hover:grayscale-0 transition-all duration-1000"
                        style={{
                            backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${destination.coordinates?.lng || 0},${destination.coordinates?.lat || 0},10,0/1200x800@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        {/* Premium Map Overlay */}
                        <div className="absolute top-8 left-8 p-6 glass rounded-3xl border border-white/20 shadow-2xl max-w-xs animate-slide-up">
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1">Active Region</div>
                            <div className="text-2xl font-black text-neutral-900 tracking-tighter leading-none mb-1">{destination.city}</div>
                            <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{destination.country}</div>
                        </div>

                        {/* Interactive Markers */}
                        {markers.map((marker, index) => (
                            <div
                                key={index}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-20"
                                style={{
                                    top: `${40 + (index * 8)}%`,
                                    left: `${30 + (index * 12)}%`,
                                }}
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-primary/40 rounded-full blur-xl animate-pulse"></div>
                                    <div className="relative w-10 h-10 bg-neutral-900 border-4 border-white rounded-2xl shadow-2xl flex items-center justify-center text-white text-[10px] font-black group-hover:bg-primary group-hover:scale-125 transition-all duration-500 cursor-pointer">
                                        {index + 1}
                                    </div>
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-neutral-900 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-2xl">
                                        {marker.label}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Map Gradient Overlay */}
                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-neutral-900/10 to-transparent pointer-events-none"></div>
                    </div>

                    <div className="absolute bottom-8 right-8 flex flex-col gap-2">
                        <button className="w-12 h-12 glass bg-white/80 hover:bg-neutral-900 hover:text-white rounded-2xl shadow-xl flex items-center justify-center font-black transition-all">
                            +
                        </button>
                        <button className="w-12 h-12 glass bg-white/80 hover:bg-neutral-900 hover:text-white rounded-2xl shadow-xl flex items-center justify-center font-black transition-all">
                            −
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
