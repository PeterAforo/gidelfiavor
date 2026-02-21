export default function EventsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <header className="mb-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#d4a84b]">Events</p>
        <h1 className="mt-4 text-4xl font-bold text-white md:text-5xl">Events & Appearances</h1>
        <p className="mt-4 text-lg text-gray-400">Join me at upcoming events or catch up on past appearances.</p>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Upcoming Events</h2>
        <div className="rounded-xl bg-[#132038] p-8 text-center">
          <div className="text-4xl mb-4">📅</div>
          <p className="text-gray-400">No upcoming events scheduled at this time.</p>
          <p className="text-gray-500 mt-2">Check back soon or follow me on social media for updates!</p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-6">Past Events</h2>
        <div className="space-y-4">
          <article className="rounded-xl bg-[#132038] p-6">
            <p className="text-sm text-[#d4a84b]">December 2023</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Book Launch Event</h3>
            <p className="mt-2 text-gray-400">Celebrated the release of "Patience, Process & Preparation" with readers and supporters.</p>
          </article>
          <article className="rounded-xl bg-[#132038] p-6">
            <p className="text-sm text-[#d4a84b]">October 2023</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Author Workshop</h3>
            <p className="mt-2 text-gray-400">Shared insights on the writing process and personal development with aspiring authors.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
