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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-t border-zinc-800 safe-area-pb">
      <div className="flex items-center justify-around px-2 h-16 max-w-lg mx-auto">
        {tabs.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors min-w-[56px]",
                active ? "text-white" : "text-zinc-500"
              )}
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 1.8}
                className={cn(active && "text-violet-400")}
              />
              <span className={cn("text-[10px] font-medium", active ? "text-violet-400" : "text-zinc-500")}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
