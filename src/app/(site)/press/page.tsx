import Link from "next/link";

export default function PressPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <header className="mb-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#d4a84b]">Press</p>
        <h1 className="mt-4 text-4xl font-bold text-white md:text-5xl">Press & Media</h1>
        <p className="mt-4 text-lg text-gray-400">Resources for journalists, bloggers, and media professionals.</p>
      </header>

      <section className="mb-12">
        <div className="rounded-xl bg-[#132038] p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Press Kit</h2>
          <p className="text-gray-400 mb-6">
            Download author bios, high-resolution photos, and book cover images for your publication.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#" className="inline-flex items-center px-6 py-3 bg-[#d4a84b] text-[#0a1628] font-bold rounded-full hover:bg-[#e6bc5f] transition-colors">
              📄 Download Press Kit
            </a>
            <a href="#" className="inline-flex items-center px-6 py-3 border-2 border-[#1e3a5f] text-white font-bold rounded-full hover:border-[#d4a84b] transition-colors">
              📷 Download Photos
            </a>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Author Bio</h2>
        <div className="rounded-xl bg-[#132038] p-6">
          <p className="text-gray-400 leading-relaxed">
            Gidel Fiavor is an author and speaker dedicated to inspiring personal growth and transformation. 
            Their debut book, "Patience, Process & Preparation," explores the power of patience in achieving 
            life goals and personal development. Gidel's work focuses on helping readers understand the 
            importance of process and preparation in their journey to success.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-6">Media Inquiries</h2>
        <div className="rounded-xl bg-[#132038] p-6">
          <p className="text-gray-400 mb-4">
            For interview requests, review copies, or other media inquiries, please contact:
          </p>
          <p className="text-[#d4a84b] font-semibold">press@gidelfiavor.com</p>
          <div className="mt-6">
            <Link href="/contact" className="text-[#d4a84b] hover:text-[#e6bc5f] font-semibold">
              Or use our contact form →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
