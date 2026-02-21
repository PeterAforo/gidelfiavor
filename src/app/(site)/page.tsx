import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-[80vh] flex items-center bg-[#0a1628]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h1 className="text-5xl font-bold text-white md:text-7xl">
                Gidel Fiavor
              </h1>
              <p className="mt-6 text-xl text-gray-400">
                Check out my latest book
              </p>
              <div className="mt-8">
                <Link 
                  href="/books" 
                  className="inline-flex items-center px-8 py-4 bg-[#d4a84b] text-[#0a1628] font-bold rounded-full hover:bg-[#e6bc5f] transition-colors"
                >
                  Explore My Books →
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-[320px] h-[480px] rounded-lg bg-gradient-to-br from-[#d4a84b] to-[#e6bc5f] flex items-center justify-center shadow-2xl">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">📖</div>
                  <p className="text-2xl font-bold text-[#0a1628]">
                    Coming Soon
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Book Section */}
      <section className="py-20 bg-[#0f1d32]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="flex justify-center">
              <div className="w-[350px] h-[525px] rounded-lg bg-gradient-to-br from-[#d4a84b] to-[#e6bc5f] flex items-center justify-center shadow-2xl">
                <div className="text-8xl">📚</div>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#d4a84b]">
                Latest Book
              </p>
              <h2 className="mt-4 text-4xl font-bold text-white md:text-5xl">
                Patience, Process & Preparation
              </h2>
              <p className="mt-6 text-lg text-gray-400">
                In this book, discover how to use patience to completely transform your life as well as help you create the habit of patience, the understanding that you have to go through the process and the need for preparation.
              </p>
              <div className="mt-8">
                <Link 
                  href="/books" 
                  className="inline-flex items-center px-8 py-4 bg-[#d4a84b] text-[#0a1628] font-bold rounded-full hover:bg-[#e6bc5f] transition-colors"
                >
                  🛒 Buy on Amazon
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-[#0a1628]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#d4a84b]">
                About the Author
              </p>
              <h2 className="mt-4 text-4xl font-bold text-white md:text-5xl">
                Meet Gidel Fiavor
              </h2>
              <p className="mt-6 text-lg text-gray-400">
                A passionate storyteller dedicated to crafting narratives that inspire, educate, and transform lives. 
                Through my books, I share insights on patience, personal growth, and the journey of self-discovery.
              </p>
              <div className="mt-8">
                <Link 
                  href="/about" 
                  className="inline-flex items-center px-8 py-4 border-2 border-[#1e3a5f] text-white font-bold rounded-full hover:border-[#d4a84b] transition-colors"
                >
                  Learn More About Me →
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-[350px] h-[450px] rounded-2xl bg-[#132038] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto rounded-full bg-[#d4a84b]/20 flex items-center justify-center mb-4">
                    <span className="text-5xl font-bold text-[#d4a84b]">GF</span>
                  </div>
                  <p className="text-xl font-semibold text-white">Gidel Fiavor</p>
                  <p className="text-gray-400">Author & Speaker</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-[#1a365d] via-[#2563eb] to-[#7c3aed]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">Newsletter</h2>
          <p className="mt-4 text-lg text-white/80">
            Stay up to date with all my new works, news, and events. Sign up for my newsletter today!
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              placeholder="Your Email Address"
              className="flex-1 max-w-md rounded-lg border border-white/20 bg-white/10 px-4 py-3.5 text-white placeholder:text-white/60"
            />
            <button className="px-8 py-3.5 bg-[#d4a84b] text-[#0a1628] font-bold rounded-lg hover:bg-[#e6bc5f] transition-colors">
              Subscribe
            </button>
          </div>
          <p className="mt-4 text-sm text-white/60">
            We respect your privacy, so we never share your info.
          </p>
        </div>
      </section>
    </div>
  );
}
