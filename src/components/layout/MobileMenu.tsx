"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

type NavItem = { label?: string; href?: string };

export function MobileMenu({
  open,
  onClose,
  links,
}: {
  open: boolean;
  onClose: () => void;
  links: NavItem[];
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-[#0a1628]/95 p-6"
        >
          <button className="mb-8 text-sm text-white" onClick={onClose} type="button">
            Close
          </button>
          <nav className="flex flex-col gap-5 text-2xl text-[#f5f0e8]">
            {links.map((item) => (
              <Link key={`${item.label}-${item.href}`} href={item.href || "#"} onClick={onClose}>
                {item.label}
              </Link>
            ))}
          </nav>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
