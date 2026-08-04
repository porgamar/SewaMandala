import { useState } from "react";

const FOUNDERS = [
  { name: "Aashraya Sharma", role: "Founder, programs", desc: "Leads program design and on-ground service delivery." },
  { name: "Kashyap Dhungel", role: "Founder, operations", desc: "Oversees logistics and volunteer coordination." },
  { name: "Sagun Kc", role: "Founder, partnerships", desc: "Builds relationships with donors and partners." },
  { name: "Nayan Poudel", role: "Founder, technology", desc: "Runs the digital platform and data tools." },
];

const RING_COLORS = ["#a63446", "#2f7c74", "#e8944a", "#4881E3"];

const STATS = [
  { num: "4", label: "Founders, one per position" },
  { num: "0", label: "Departments in active service" },
];

// Replace with your own Formspree form ID (formspree.io) — free tier works fine
// for a low-volume org contact form and needs no backend of your own.
const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="w-full max-w-md mx-auto bg-[#f5f5f4] rounded-xl border border-black/10 p-8 text-center">
        <p className="font-semibold text-black mb-1">Message sent</p>
        <p className="text-sm text-gray-500">
          Thanks for reaching out — someone from Sewa Mandala will reply to your email soon.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm text-[#4881E3] hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto bg-[#f5f5f4] rounded-xl border border-black/10 p-6 sm:p-8 flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-xs uppercase tracking-widest text-gray-500">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Your full name"
          className="bg-white border border-black/10 rounded-lg px-3 py-2 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-[#4881E3] transition"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-xs uppercase tracking-widest text-gray-500">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="you@example.com"
          className="bg-white border border-black/10 rounded-lg px-3 py-2 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-[#4881E3] transition"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-xs uppercase tracking-widest text-gray-500">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={form.message}
          onChange={handleChange}
          required
          placeholder="How can we help, or how would you like to help us?"
          className="bg-white border border-black/10 rounded-lg px-3 py-2 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-[#4881E3] transition resize-none"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-[#c26a1f]">
          Something went wrong sending your message. Please try again.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-1 rounded-lg bg-[#4881E3] text-white font-semibold text-sm py-2.5 hover:bg-[#5c90e8] disabled:opacity-60 disabled:cursor-not-allowed transition"
      >
        {status === "sending" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}

function OurTeam() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen bg-white text-black">

      <header className="text-center px-6 py-20 border-b border-black/10">
        <p className="text-xs uppercase tracking-widest text-[#22C55E] mb-3">
          Sewa, organized in circles
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold max-w-2xl mx-auto leading-tight">
          Meet the people behind Sewa Mandala
        </h1>
        <p className="text-gray-500 max-w-md mx-auto mt-4">
          Four founders, four responsibilities, one mission: service without gaps.
        </p>
      </header>

      {/* Founders — alternating-side timeline */}
      <section id="structure" className="px-6 py-20 border-b border-black/10">
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-widest text-[#e8944a] mb-2">Organization Members</p>
          <h2 className="text-2xl font-semibold text-black">The mandala</h2>
        </div>

        <div className="relative max-w-2xl mx-auto">
          {/* center spine */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black/10 -translate-x-1/2" />

          <div className="flex flex-col gap-10">
            {FOUNDERS.map((founder, i) => {
              const onLeft = i % 2 === 0;
              const color = RING_COLORS[i % RING_COLORS.length];
              const isSelected = selected?.name === founder.name;

              return (
                <div
                  key={founder.name}
                  className={`relative flex items-center ${onLeft ? "justify-start" : "justify-end"}`}
                >
                  {/* node on the spine */}
                  <div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white"
                    style={{ backgroundColor: color }}
                  />

                  <button
                    onClick={() => setSelected(founder)}
                    className={`w-[calc(50%-2rem)] rounded-xl border p-4 text-left transition
                      ${isSelected ? "border-black/30 bg-black/5" : "border-black/10 bg-[#f5f5f4] hover:border-black/20"}
                    `}
                  >
                    <div
                      className="flex items-center gap-3 mb-1"
                      style={onLeft ? {} : { flexDirection: "row-reverse", textAlign: "right" }}
                    >
                      <span
                        className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                        style={{ backgroundColor: color }}
                      >
                        {founder.name.slice(0, 2).toUpperCase()}
                      </span>
                      <span className="font-semibold text-black">{founder.name}</span>
                    </div>
                    <p className="text-sm mb-1" style={{ color }}>{founder.role}</p>
                    <p className={onLeft ? "text-left text-sm text-gray-500" : "text-right text-sm text-gray-500"}>
                      {founder.desc}
                    </p>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10 w-full max-w-sm mx-auto bg-[#f5f5f4] rounded-xl p-5 text-center">
          {selected ? (
            <>
              <p className="font-semibold text-black">{selected.name}</p>
              <p className="text-[#4881E3] text-sm mb-2">{selected.role}</p>
              <p className="text-gray-500 text-sm">{selected.desc}</p>
            </>
          ) : (
            <p className="text-gray-500 text-sm">Click a founder above to see details.</p>
          )}
        </div>
      </section>

      <section id="mission" className="px-6 py-20 border-b border-black/10">
        <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-6">
          {STATS.map((stat) => (
            <div key={stat.label} className="border-t border-black/10 pt-3">
              <div className="text-2xl font-bold text-[#4881E3]">{stat.num}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact — visitor submits, org receives it via email */}
      <section id="contact" className="px-6 py-20">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-widest text-[#a63446] mb-2">Get in touch</p>
          <h2 className="text-2xl font-semibold text-black">Contact Sewa Mandala</h2>
          <p className="text-gray-500 max-w-sm mx-auto mt-3 text-sm">
            Send a message and it'll land straight in our inbox.
          </p>
        </div>
        <ContactForm />
      </section>

    </div>
  );
}

export default OurTeam;