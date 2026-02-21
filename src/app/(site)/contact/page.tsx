export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <header className="mb-12 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#d4a84b]">Contact</p>
        <h1 className="mt-4 text-4xl font-bold text-white md:text-5xl">Get in Touch</h1>
        <p className="mt-4 text-lg text-gray-400">
          I'd love to hear from you. Whether you're a reader, journalist, event organizer, or fellow author.
        </p>
      </header>

      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div className="rounded-xl bg-[#132038] p-4">
              <p className="text-[#d4a84b] font-semibold">📧 Email</p>
              <p className="text-gray-400 mt-1">contact@gidelfiavor.com</p>
            </div>
            <div className="rounded-xl bg-[#132038] p-4">
              <p className="text-[#d4a84b] font-semibold">📱 Social Media</p>
              <p className="text-gray-400 mt-1">@gidelfiavor on all platforms</p>
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mt-8 mb-4">I'm available for:</h3>
          <ul className="space-y-2 text-gray-400">
            <li>• General inquiries</li>
            <li>• Press & media requests</li>
            <li>• Speaking engagements</li>
            <li>• Book clubs</li>
            <li>• Rights & permissions</li>
          </ul>
        </div>

        <div className="rounded-xl bg-[#132038] p-6">
          <h2 className="text-xl font-bold text-white mb-4">Send a Message</h2>
          <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST" className="space-y-4">
            <input 
              name="name" 
              placeholder="Your Name" 
              required
              className="w-full rounded-lg bg-[#1e3a5f] border border-[#2d4a6f] px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4a84b]" 
            />
            <input 
              name="email" 
              type="email" 
              placeholder="Email" 
              required
              className="w-full rounded-lg bg-[#1e3a5f] border border-[#2d4a6f] px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4a84b]" 
            />
            <select 
              name="inquiry_type"
              className="w-full rounded-lg bg-[#1e3a5f] border border-[#2d4a6f] px-4 py-3 text-white focus:outline-none focus:border-[#d4a84b]"
            >
              <option value="general">General Inquiry</option>
              <option value="press">Press & Media</option>
              <option value="speaking">Speaking Engagement</option>
              <option value="bookclub">Book Club</option>
              <option value="rights">Rights & Permissions</option>
            </select>
            <textarea 
              name="message" 
              rows={5} 
              placeholder="Your Message" 
              required
              className="w-full rounded-lg bg-[#1e3a5f] border border-[#2d4a6f] px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4a84b]" 
            />
            <button 
              type="submit" 
              className="w-full rounded-lg bg-[#d4a84b] px-6 py-3 font-bold text-[#0a1628] hover:bg-[#e6bc5f] transition-colors"
            >
              Send Message
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-500 text-center">
            Or email directly at contact@gidelfiavor.com
          </p>
        </div>
      </div>
    </div>
  );
}
