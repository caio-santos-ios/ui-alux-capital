"use client";

import { useState, useEffect, useRef, useCallback } from "react";


type TagVariant = "add" | "fix" | "remove" | "design" | "change";

interface ChangeTag {
    variant: TagVariant;
    label: string;
}

interface ScreenMockup {
    before?: React.ReactNode;
    after?: React.ReactNode;
}

interface ChangeEntry {
    id: string;
    date: { day: string; month: string; year: number };
    subtitle: string;
    title: string;
    description: string;
    tags: ChangeTag[];
    author: { image: string; name: string };
    mockup?: ScreenMockup;
    accentColor?: string;
}

const ENTRIES: ChangeEntry[] = [
    { 
        id: "dash-metrics-redesign",
        date: { day: "18", month: "Jul", year: 2025 },
        subtitle: "Dashboard",
        title: "Novo grid de métricas com sparklines",
        description: "Cards de estatísticas reorganizados em grid 3 colunas com hierarquia visual aprimorada. Adicionados mini gráficos de tendência (sparklines) e indicadores de variação percentual em cada card. Tabela de pagamentos recentes expandida.",
        tags: [
            { variant: "design", label: "Redesign visual" },
        ],
        author: { image: "MS", name: "Marcos S." },
        accentColor: "from-violet-500 to-teal-400",
    },
];

const TAG_STYLES: Record<TagVariant, string> = {
    add:    "text-emerald-400 border-emerald-400/25 bg-emerald-400/8",
    fix:    "text-teal-400    border-teal-400/25    bg-teal-400/8",
    remove: "text-rose-400    border-rose-400/25    bg-rose-400/8",
    design: "text-violet-400  border-violet-400/25  bg-violet-400/8",
    change: "text-brand-400   border-brand-400/25   bg-brand-400/8",
};

function Tag({ variant, label }: ChangeTag) {
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded text-[10px] font-mono font-medium tracking-wide border ${TAG_STYLES[variant]}`}>
            {label}
        </span>
    );
}

function Avatar({ initials, name }: { initials: string; name: string }) {
    return (
        <div className="flex items-center gap-2 shrink-0">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-medium text-zinc-900 shrink-0">
                {initials}
            </div>
            <span className="text-[11px] text-zinc-500 font-mono">{name}</span>
        </div>
    );
}

interface EntryCardProps {
    entry: ChangeEntry;
    // visible: boolean;
    index: number;
}

function EntryCard({ entry, index }: EntryCardProps) {

    return (
        <div
        key={index}
        className="grid grid-cols-[60px_1fr] gap-x-5"
        style={{
            opacity: 1,
            transform: "translateY(0)",
            transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 60}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 60}ms`,
        }}
        >
            <div className="flex flex-col items-center pt-0.5 relative z-10">
                <div className={`w-3 h-3 rounded-full bg-brand-500 outline outline-brand-500 outline-1.5 outline-offset-2 shrink-0 transition-all duration-300 group-hover:scale-150`}/>
                    <div className="mt-2.5 flex flex-col items-center gap-0.5">
                        <span className="font-display text-[22px] leading-none text-white">{entry.date.day}</span>
                        <span className="text-[9px] font-mono tracking-widest uppercase text-zinc-500">{entry.date.month}</span>
                    </div>
                </div>

                <div className="group mb-10">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden transition-all duration-300 hover:border-zinc-600 hover:shadow-2xl hover:-translate-y-1">

                    <div className={`h-0.5 w-full bg-linear-to-r ${entry.accentColor ?? "from-zinc-500 to-zinc-700"}`} />

                    <div className="flex items-start gap-3.5 p-5 pb-3">
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-mono tracking-[2px] uppercase text-zinc-500 mb-1.5">{entry.subtitle}</p>
                            <h3 className="font-serif text-[19px] font-semibold text-zinc-100 leading-snug">{entry.title}</h3>
                        </div>
                    </div>

                    <p className="px-5 pb-4 text-[13px] font-mono font-light text-zinc-400 leading-relaxed">
                        {entry.description}
                    </p>

                    {entry.mockup && (
                        <div className="mx-5 mb-4 grid grid-cols-2 gap-2">
                        {entry.mockup.before && (
                            <div className="relative rounded-lg overflow-hidden border border-zinc-800">
                            <span className="absolute top-2 left-2 z-10 text-[8px] font-mono font-medium tracking-widest uppercase px-1.5 py-0.5 rounded bg-white/8 text-zinc-400">
                                Antes
                            </span>
                            {entry.mockup.before}
                            </div>
                        )}
                        {entry.mockup.after && (
                            <div className="relative rounded-lg overflow-hidden border border-zinc-700">
                            <span className="absolute top-2 left-2 z-10 text-[8px] font-mono font-medium tracking-widest uppercase px-1.5 py-0.5 rounded bg-brand-400 text-zinc-900">
                                Depois
                            </span>
                            {entry.mockup.after}
                            </div>
                        )}
                        </div>
                    )}

                    <div className="px-5 py-3.5 border-t border-zinc-800 flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] text-zinc-500 font-mono">{entry.author.name}</span>
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-medium text-zinc-900 shrink-0">
                                {/* <img src={entry.author.image} alt="" /> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function YearDivider({ year }: { year: number }) {
  return (
    <div className="grid grid-cols-[60px_1fr] gap-x-5 mb-8">
      <div />
      <div className="flex items-center gap-4">
        <span className="font-display text-[13px] tracking-[4px] text-brand-400">{year}</span>
        <div className="flex-1 h-px bg-linear-to-r from-brand-400/30 to-transparent" />
      </div>
    </div>
  );
}

function ScrollProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY;
            const total = document.body.scrollHeight - window.innerHeight;
            setProgress(total > 0 ? (scrolled / total) * 100 : 0);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 h-0.5 z-50 bg-zinc-900">
            <div
                className="h-full bg-brand-400 shadow-[0_0_12px_rgba(212,168,67,0.8)] transition-[width] duration-75"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}

function useIntersectionReveal(ids: string[]) {
  const [visible, setVisible] = useState<Set<string>>(new Set());
  const refs = useRef<Map<string, Element>>(new Map());

  const setRef = useCallback((id: string) => (el: Element | null) => {
    if (el) refs.current.set(id, el);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).dataset.entryId;
            if (id) setVisible((prev) => new Set(prev).add(id));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.07, rootMargin: "0px 0px -20px 0px" }
    );

    refs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return { visible, setRef };
}

export default function ScreenChangelog({title, cards}: {title: string; cards: ChangeEntry[]}) {
    return (
        <div className="min-h-subtitle">
            <div
                className="fixed inset-0 pointer-events-none z-40 opacity-[0.025]"
                style={{
                backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)",
                }}
            />

            <ScrollProgress />

            <header className="max-w-5xl mx-auto px-6 lg:px-14 pb-2 border-b border-brand-400">
                <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono tracking-[3px] uppercase text-brand-400">
                        {title}
                    </span>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 lg:px-14 pt-14 pb-28 relative">
                <div className="absolute top-14 bottom-0 pointer-events-none"
                style={{
                    left: "calc(3.5rem + 56px + 20px / 2)", 
                    width: "1px",
                    background: "linear-gradient(to bottom, #7127A7 0%, rgba(113,39,167,0.3) 8%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.04) 75%, transparent 100%)",          
                }}/>

                {
                    cards.map((x: ChangeEntry, index: number) => {
                        return (
                            <div key={index}>
                                {
                                    index == 0 ? (
                                        <div className="grid grid-cols-[60px_1fr] gap-x-5 mb-8">
                                            <div />
                                                <div className="flex items-center gap-4">
                                                    <span className="font-display text-[13px] tracking-[4px] text-brand-400">{x.date.year}</span>
                                                <div className="flex-1 h-px bg-linear-to-r from-brand-400/30 to-transparent" />
                                            </div>
                                        </div>
                                    ) : (
                                        cards[index - 1].date.year != x.date.year &&
                                        (
                                            <div className="grid grid-cols-[60px_1fr] gap-x-5 mb-8">
                                                <div />
                                                    <div className="flex items-center gap-4">
                                                        <span className="font-display text-[13px] tracking-[4px] text-brand-400">{x.date.year}</span>
                                                    <div className="flex-1 h-px bg-linear-to-r from-brand-400/30 to-transparent" />
                                                </div>
                                            </div>
                                        )
                                    ) 
                                }
                                <EntryCard
                                    entry={x}
                                    // visible={visible.has(entry.id)}
                                    index={index}
                                />
                            </div>
                        )
                    })
                }
            </main>
        </div>
    );
}