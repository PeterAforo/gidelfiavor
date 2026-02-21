import Link from "next/link";

export default function BooksPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <header className="mb-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#d4a84b]">My Books</p>
        <h1 className="mt-4 text-4xl font-bold text-white md:text-5xl">Books</h1>
        <p className="mt-4 text-lg text-gray-400">Browse all titles and upcoming releases.</p>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Featured Book */}
        <div className="md:col-span-2 rounded-2xl bg-[#0f1d32] p-8">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="flex justify-center">
              <div className="w-[280px] h-[420px] rounded-lg bg-gradient-to-br from-[#d4a84b] to-[#e6bc5f] flex items-center justify-center shadow-2xl">
                <div className="text-6xl">📚</div>
              </div>
            </div>
            <div>
              <p className="text-sm text-[#d4a84b]">Featured • 2024</p>
              <h2 className="mt-2 text-3xl font-bold text-white">Patience, Process & Preparation</h2>
              <p className="mt-4 text-gray-400">
                In this book, discover how to use patience to completely transform your life as well as help you 
                create the habit of patience, the understanding that you have to go through the process and the 
                need for preparation.
              </p>
              <a 
                href="https://amazon.com" 
                target="_blank" 
                rel="noreferrer"
                className="mt-6 inline-flex items-center px-6 py-3 bg-[#d4a84b] text-[#0a1628] font-bold rounded-full hover:bg-[#e6bc5f] transition-colors"
              >
                🛒 Buy on Amazon
              </a>
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="rounded-xl bg-[#132038] p-6">
          <div className="w-full h-[200px] rounded-lg bg-[#1e3a5f] flex items-center justify-center mb-4">
            <div className="text-4xl">📖</div>
          </div>
          <p className="text-sm text-[#d4a84b]">Coming Soon</p>
          <h3 className="mt-2 text-xl font-bold text-white">New Book Title</h3>
          <p className="mt-2 text-gray-400">Stay tuned for my upcoming release. Sign up for the newsletter to be notified.</p>
        </div>

        <div className="rounded-xl bg-[#132038] p-6">
          <div className="w-full h-[200px] rounded-lg bg-[#1e3a5f] flex items-center justify-center mb-4">
            <div className="text-4xl">✍️</div>
          </div>
          <p className="text-sm text-[#d4a84b]">In Progress</p>
          <h3 className="mt-2 text-xl font-bold text-white">Work in Progress</h3>
          <p className="mt-2 text-gray-400">Currently working on new material. Follow my journey on social media.</p>
        </div>
      </div>
    </div>
  );
}
