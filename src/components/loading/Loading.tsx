"use client";

import { loadingAtom } from "@/jotai/global/loading.jotai";
import { useAtom } from "jotai";

export const Loading = () => {
    const [loading] = useAtom(loadingAtom);

    if (!loading) return null;

    return (
        <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white/95 dark:bg-[#080410]/95 backdrop-blur-md">
            <div className="flex flex-col items-center gap-8">

                {/* Orbs flutuantes */}
                <div className="relative w-24 h-24">

                    {/* Orb central */}
                    <div
                        className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-brand-500"
                        style={{
                            boxShadow: "0 0 30px 8px rgba(113,39,167,0.5), 0 0 60px 16px rgba(113,39,167,0.2)",
                            animation: "breathe 2s ease-in-out infinite",
                        }}
                    />

                    {/* Orb orbitando 1 */}
                    <div
                        className="absolute top-0 left-0 w-full h-full"
                        style={{ animation: "orbit1 1.6s linear infinite" }}
                    >
                        <div
                            className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-brand-400"
                            style={{ boxShadow: "0 0 12px 4px rgba(168,98,220,0.6)" }}
                        />
                    </div>

                    {/* Orb orbitando 2 */}
                    <div
                        className="absolute top-0 left-0 w-full h-full"
                        style={{ animation: "orbit2 2.4s linear infinite" }}
                    >
                        <div
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-brand-300"
                            style={{ boxShadow: "0 0 10px 3px rgba(196,146,240,0.5)" }}
                        />
                    </div>

                    {/* Orb orbitando 3 */}
                    <div
                        className="absolute top-0 left-0 w-full h-full"
                        style={{ animation: "orbit3 2s linear infinite reverse" }}
                    >
                        <div
                            className="absolute top-1/2 right-0 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brand-600"
                            style={{ boxShadow: "0 0 8px 3px rgba(80,20,130,0.7)" }}
                        />
                    </div>

                    {/* Anel de rastro */}
                    <div
                        className="absolute inset-2 rounded-full border border-brand-500/20"
                        style={{ animation: "ripple 2s ease-out infinite" }}
                    />
                    <div
                        className="absolute inset-2 rounded-full border border-brand-400/10"
                        style={{ animation: "ripple 2s ease-out infinite 0.6s" }}
                    />
                </div>

                {/* Texto com letras animadas */}
                <div className="flex items-center gap-1">
                    {"CARREGANDO".split("").map((char, i) => (
                        <span
                            key={i}
                            className="text-[10px] font-mono tracking-widest text-brand-500 dark:text-brand-400"
                            style={{
                                animation: `blink 1.4s ease-in-out infinite`,
                                animationDelay: `${i * 80}ms`,
                            }}
                        >
                            {char}
                        </span>
                    ))}
                </div>

            </div>

            <style>{`
                @keyframes breathe {
                    0%, 100% { transform: scale(1);   opacity: 1; }
                    50%       { transform: scale(1.3); opacity: 0.8; }
                }
                @keyframes orbit1 {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                @keyframes orbit2 {
                    from { transform: rotate(120deg); }
                    to   { transform: rotate(480deg); }
                }
                @keyframes orbit3 {
                    from { transform: rotate(240deg); }
                    to   { transform: rotate(600deg); }
                }
                @keyframes ripple {
                    0%   { transform: scale(1);   opacity: 0.4; }
                    100% { transform: scale(2.2); opacity: 0; }
                }
                @keyframes blink {
                    0%, 100% { opacity: 0.2; transform: translateY(0px); }
                    50%      { opacity: 1;   transform: translateY(-3px); }
                }
            `}</style>
        </div>
    );
};