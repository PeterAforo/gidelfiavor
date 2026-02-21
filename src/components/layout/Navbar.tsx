"use client";

import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { cn } from "@/lib/utils";

type NavItem = { label?: string; href?: string };

const fallbackNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Bio", href: "/about" },
  { label: "Book", href: "/books" },
  { label: "CONTACT", href: "/contact" },
];

export function Navbar({
  navLinks,
  announcement,
}: {
  navLinks?: NavItem[];
  announcement?: { enabled?: boolean; message?: string; link?: string; linkText?: string };
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = useMemo(() => (navLinks && navLinks.length ? navLinks : fallbackNav), [navLinks]);

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-bg)]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        {/* Logo */}
        <Link href="/" className="group">
          <span 
            className="text-3xl text-[var(--color-accent)] transition-colors group-hover:text-[var(--color-accent-hover)]" 
            style={{ fontFamily: "'Brush Script MT', 'Segoe Script', cursive" }}
          >
            Gidel Fiavor
          </span>
        </Link>

        {/* Center Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((item) => (
            <Link
              key={`${item.label}-${item.href}`}
              href={item.href || "#"}
              className={cn(
                "text-sm font-medium transition-colors",
                pathname === item.href
                  ? "text-[var(--color-accent)]"
                  : "text-[var(--color-text)] hover:text-[var(--color-accent)]",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Side - Search */}
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-lg bg-[var(--color-bg-elevated)] px-3 py-2 md:flex">
            <input
              type="text"
              placeholder="Search..."
              className="w-32 bg-transparent text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none"
            />
            <Search size={16} className="text-[var(--color-accent)]" />
          </div>
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="rounded-lg p-2 text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)] md:hidden"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
      <MobileMenu open={open} onClose={() => setOpen(false)} links={links} />
    </header>
  );
}
