import { useState } from "react";
import Navbar from "./navbar";
import Footer from "./footer";

const SERVICES = [
  { title: "Home repairs", desc: "Plumbing, electrical, and general fix-it help at your doorstep.", type: "Physical" },
  { title: "Cleaning", desc: "House and office cleaning by verified local providers.", type: "Physical" },
  { title: "Moving & delivery", desc: "Local moving help and same-day delivery runs.", type: "Physical" },
  { title: "Graphic design", desc: "Logos, posters, and branding from freelance designers.", type: "Digital" },
  { title: "Web development", desc: "Websites and apps built by independent developers.", type: "Digital" },
  { title: "Writing & content", desc: "Articles, copywriting, and editing on demand.", type: "Digital" },
  { title: "Tutoring", desc: "One-on-one lessons, in person or online.", type: "Digital" },
  { title: "Event help", desc: "Setup, staffing, and on-site support for events.", type: "Physical" },
];

const FILTERS = ["All", "Physical", "Digital"];

const FAQS = [
  { question: "How do I book a service?", answer: "Browse services, pick a provider, and send a request. They'll confirm details before you're charged." },
  { question: "Is payment protected?", answer: "Yes — funds are held until the work is marked complete, then released to the provider." },
  { question: "Can I offer both physical and digital services?", answer: "Yes, providers can list as many service types as they want under one profile." },
];


function ServiceRow({ title, desc, type }) {
  const tagColor = type === "Physical" ? "bg-[#22C55E]" : "bg-[#4881E3]";
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-[#e5e5e5]">
      <div>
        <h3 className="font-semibold text-[#181818]">{title}</h3>
        <p className="text-[#777777] text-sm">{desc}</p>
      </div>
      <span className={`shrink-0 text-xs px-2 py-1 rounded-full text-white ${tagColor}`}>
        {type}
      </span>
    </div>
  );
}

function FaqCard({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white border border-[#e5e5e5] rounded-xl p-5">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left"
      >
        <span className="font-semibold text-[#181818]">{question}</span>
        <span className="text-[#4881E3] text-xl">{open ? "−" : "+"}</span>
      </button>
      {open && <p className="text-[#777777] text-sm mt-3">{answer}</p>}
    </div>
  );
}

function Services() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const visibleServices = SERVICES
    .filter((s) => filter === "All" || s.type === filter)
    .filter((s) => s.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-white text-[#181818]">
      

      <header className="text-center px-6 py-16 border-b border-[#e5e5e5]">
        <p className="text-xs uppercase tracking-widest text-[#22C55E] mb-3">
          What our platform provides
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold max-w-2xl mx-auto leading-tight text-[#181818]">
          Hire for anything, physical or digital.
        </h1>
        <p className="text-[#777777] max-w-md mx-auto mt-4">
          Sewa Mandala connects you with people who can help.
        </p>
      </header>

      <div className="flex justify-center px-6 pt-10">
        <div className="flex w-full max-w-md gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services..."
            className="flex-1 border border-[#e5e5e5] rounded-full px-4 py-2 text-sm text-[#181818] outline-none focus:border-[#4881E3]"
          />
          <button
            onClick={() => setSearch(search)}
            className="bg-[#4881E3] text-white text-sm px-5 py-2 rounded-full"
          >
            Search
          </button>
        </div>
      </div>

      <div className="flex justify-center gap-3 px-6 pt-5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm border ${
              filter === f
                ? "bg-[#777777] text-white border-[#777777]"
                : "border-[#e5e5e5] text-[#777777] hover:text-[#181818]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <section className="px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {visibleServices.length > 0 ? (
            visibleServices.map((service) => (
              <ServiceRow key={service.title} {...service} />
            ))
          ) : (
            <p className="text-[#818181] text-sm text-center py-8">
              No services match your search.
            </p>
          )}
        </div>
      </section>

      <section className="px-6 py-16 border-t border-[#e5e5e5]">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-[#22C55E] mb-2 text-center">
            Questions
          </p>
          <h2 className="text-2xl font-semibold mb-8 text-center text-[#181818]">
            Frequently asked questions
          </h2>
          <div className="flex flex-col gap-4">
            {FAQS.map((faq) => (
              <FaqCard key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Services;
