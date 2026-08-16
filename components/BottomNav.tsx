"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Plus, Clock, Lightbulb, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/add", icon: Plus, label: "Add" },
  { href: "/history", icon: Clock, label: "History" },
  { href: "/insights", icon: Lightbulb, label: "Insights" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-2xl border-t border-white/[0.07] safe-area-pb">
      <div className="flex items-center justify-around px-2 h-16 max-w-lg mx-auto">
        {tabs.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all duration-200 min-w-[56px]",
                active ? "bg-violet-500/[0.14]" : ""
              )}
            >
              <Icon
                size={21}
                strokeWidth={active ? 2.2 : 1.7}
                className={cn(active ? "text-violet-400" : "text-zinc-500")}
              />
              <span className={cn("text-[10px] font-medium", active ? "text-violet-400" : "text-zinc-600")}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
