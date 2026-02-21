import Link from "next/link";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="top" className="min-h-screen bg-[#0a1628]">
      {/* Simple Navbar */}
      <header className="sticky top-0 z-40 bg-[#0a1628]/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-5">
          <Link href="/" className="text-3xl text-[#d4a84b]" style={{ fontFamily: "cursive" }}>
            Gidel Fiavor
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-[#d4a84b]">Home</Link>
            <Link href="/about" className="text-sm text-white hover:text-[#d4a84b]">Bio</Link>
            <Link href="/books" className="text-sm text-white hover:text-[#d4a84b]">Book</Link>
            <Link href="/contact" className="text-sm text-white hover:text-[#d4a84b]">CONTACT</Link>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      {/* Simple Footer */}
      <footer className="bg-[#0a1628] border-t border-[#1e3a5f] py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <Link href="/" className="text-2xl text-[#d4a84b]" style={{ fontFamily: "cursive" }}>
            Gidel Fiavor
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            Copyright © {new Date().getFullYear()} All Rights Reserved By Gidel Fiavor.
          </p>
        </div>
      </footer>
    </div>
  );
}
