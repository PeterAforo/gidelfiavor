import Link from "next/link";
import { Facebook, Twitter, Youtube, Instagram } from "lucide-react";

type FooterGroup = { groupTitle?: string; links?: Array<{ label?: string; href?: string; isExternal?: boolean }> };

const defaultSocialLinks = [
  { platform: "facebook", url: "#" },
  { platform: "twitter", url: "#" },
  { platform: "youtube", url: "#" },
  { platform: "instagram", url: "#" },
];

const SocialIcon = ({ platform }: { platform: string }) => {
  const iconClass = "w-5 h-5";
  switch (platform.toLowerCase()) {
    case "facebook": return <Facebook className={iconClass} />;
    case "twitter": return <Twitter className={iconClass} />;
    case "youtube": return <Youtube className={iconClass} />;
    case "instagram": return <Instagram className={iconClass} />;
    default: return null;
  }
};

export function Footer({
  footerText,
  socialLinks,
}: {
  footerText?: string;
  socialLinks?: Array<{ platform?: string; url?: string }>;
  groups?: FooterGroup[];
}) {
  const socials = socialLinks && socialLinks.length > 0 ? socialLinks : defaultSocialLinks;

  return (
    <footer className="bg-[var(--color-bg)] border-t border-[var(--color-border)]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Copyright */}
          <p className="text-sm text-[var(--color-muted)]">
            {footerText || `Copyright © ${new Date().getFullYear()} All Rights Reserved By Gidel Fiavor.`}
          </p>

          {/* Logo */}
          <Link href="/" className="order-first md:order-none">
            <span 
              className="text-2xl text-[var(--color-accent)]" 
              style={{ fontFamily: "'Brush Script MT', 'Segoe Script', cursive" }}
            >
              Gidel Fiavor
            </span>
          </Link>

          {/* Navigation & Social */}
          <div className="flex items-center gap-8">
            <nav className="hidden items-center gap-6 md:flex">
              <Link href="/" className="text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]">
                Home
              </Link>
              <Link href="/about" className="text-sm text-[var(--color-text)] hover:text-[var(--color-accent)]">
                Bio
              </Link>
              <Link href="/books" className="text-sm text-[var(--color-text)] hover:text-[var(--color-accent)]">
                Book
              </Link>
              <Link href="/contact" className="text-sm text-[var(--color-text)] hover:text-[var(--color-accent)]">
                CONTACT
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              {socials.map((link) => (
                <a
                  key={`${link.platform}-${link.url}`}
                  href={link.url || "#"}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-bg-elevated)] text-[var(--color-text)] transition-all hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)]"
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.platform}
                >
                  <SocialIcon platform={link.platform || ""} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
