export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <header className="mb-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#d4a84b]">Blog</p>
        <h1 className="mt-4 text-4xl font-bold text-white md:text-5xl">The Journal</h1>
        <p className="mt-4 text-lg text-gray-400">Essays, updates, and writing notes.</p>
      </header>

      <div className="space-y-6">
        <article className="rounded-xl bg-[#132038] p-6">
          <p className="text-sm text-[#d4a84b]">January 15, 2024</p>
          <h2 className="mt-2 text-2xl font-bold text-white">The Power of Patience in Modern Life</h2>
          <p className="mt-3 text-gray-400">
            In our fast-paced world, patience has become a rare virtue. Learn how cultivating patience can transform your relationships, career, and personal growth.
          </p>
        </article>

        <article className="rounded-xl bg-[#132038] p-6">
          <p className="text-sm text-[#d4a84b]">December 20, 2023</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Why I Started Writing</h2>
          <p className="mt-3 text-gray-400">
            Every author has a story behind their stories. Here's mine - the journey that led me to put pen to paper and share my thoughts with the world.
          </p>
        </article>

        <article className="rounded-xl bg-[#132038] p-6">
          <p className="text-sm text-[#d4a84b]">November 5, 2023</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Lessons from My First Book</h2>
          <p className="mt-3 text-gray-400">
            Writing and publishing a book taught me more than I expected. Here are the key lessons I learned throughout the process.
          </p>
        </article>
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-400">More posts coming soon. Stay tuned!</p>
      </div>
    </div>
  );
}
