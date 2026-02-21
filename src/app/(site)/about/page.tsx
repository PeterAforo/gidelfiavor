import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <section className="mb-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#d4a84b]">About the Author</p>
        <h1 className="mt-4 text-4xl font-bold text-white md:text-5xl">About Gidel Fiavor</h1>
        <div className="mt-6 text-lg text-gray-400 space-y-4">
          <p>
            Gidel Fiavor is a passionate storyteller dedicated to crafting narratives that inspire, educate, and transform lives.
          </p>
          <p>
            Through my books, I share insights on patience, personal growth, and the journey of self-discovery. 
            My writing explores the depths of human connection and the magic hidden in everyday moments.
          </p>
          <p>
            When I'm not writing, you can find me speaking at events, connecting with readers, and working on my next book.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">My Journey</h2>
        <div className="space-y-4">
          <div className="rounded-xl bg-[#132038] p-6">
            <p className="text-sm text-[#d4a84b]">2024</p>
            <h3 className="mt-1 text-xl text-white">Published "Patience, Process & Preparation"</h3>
            <p className="mt-2 text-gray-400">My debut book exploring the power of patience in personal transformation.</p>
          </div>
          <div className="rounded-xl bg-[#132038] p-6">
            <p className="text-sm text-[#d4a84b]">2023</p>
            <h3 className="mt-1 text-xl text-white">Started Writing Journey</h3>
            <p className="mt-2 text-gray-400">Began documenting insights and experiences that would become my first book.</p>
          </div>
        </div>
      </section>

      <section>
        <div className="rounded-xl bg-[#132038] p-8 text-center">
          <h2 className="text-2xl font-bold text-white">Let's Connect</h2>
          <p className="mt-4 text-gray-400">Have questions or want to collaborate? I'd love to hear from you.</p>
          <Link href="/contact" className="mt-6 inline-flex items-center px-8 py-4 bg-[#d4a84b] text-[#0a1628] font-bold rounded-full hover:bg-[#e6bc5f] transition-colors">
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
