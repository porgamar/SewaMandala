import { useState } from "react";
import Navbar from "./navbar";
import Footer from "./footer";

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

function OurTeam() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen bg-[#16151f] text-[#f1ede4]">
      <Navbar />

      <header className="text-center px-6 py-20 border-b border-white/10">
        <p className="text-xs uppercase tracking-widest text-[#22C55E] mb-3">
          Sewa, organized in circles
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold max-w-2xl mx-auto leading-tight">
          Meet the people behind Sewa Mandala
        </h1>
        <p className="text-[#9a94ab] max-w-md mx-auto mt-4">
          Four founders, four responsibilities, one mission: service without gaps.
        </p>
      </header>

      {/* Founders — alternating-side timeline */}
      <section id="structure" className="px-6 py-20 border-b border-white/10">
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-widest text-[#e8944a] mb-2">Organization Members</p>
          <h2 className="text-2xl font-semibold text-[#f1ede4]">The mandala</h2>
        </div>

        <div className="relative max-w-2xl mx-auto">
          {/* center spine */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />

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
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-[#16151f]"
                    style={{ backgroundColor: color }}
                  />

                  <button
                    onClick={() => setSelected(founder)}
                    className={`w-[calc(50%-2rem)] rounded-xl border p-4 text-left transition
                      ${isSelected ? "border-white/30 bg-white/10" : "border-white/10 bg-[#1e1c2c] hover:border-white/20"}
                    `}
                  >
                    <div
                      className="flex items-center gap-3 mb-1"
                      style={onLeft ? {} : { flexDirection: "row-reverse", textAlign: "right" }}
                    >
                      <span
                        className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold"
                        style={{ backgroundColor: color }}
                      >
                        {founder.name.slice(0, 2).toUpperCase()}
                      </span>
                      <span className="font-semibold text-[#f1ede4]">{founder.name}</span>
                    </div>
                    <p className="text-sm mb-1" style={{ color }}>{founder.role}</p>
                    <p className={onLeft ? "text-left text-sm text-[#9a94ab]" : "text-right text-sm text-[#9a94ab]"}>
                      {founder.desc}
                    </p>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10 w-full max-w-sm mx-auto bg-[#1e1c2c] rounded-xl p-5 text-center">
          {selected ? (
            <>
              <p className="font-semibold text-[#f1ede4]">{selected.name}</p>
              <p className="text-[#4881E3] text-sm mb-2">{selected.role}</p>
              <p className="text-[#9a94ab] text-sm">{selected.desc}</p>
            </>
          ) : (
            <p className="text-[#9a94ab] text-sm">Click a founder above to see details.</p>
          )}
        </div>
      </section>

      <section id="mission" className="px-6 py-20">
        <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-6">
          {STATS.map((stat) => (
            <div key={stat.label} className="border-t border-white/10 pt-3">
              <div className="text-2xl font-bold text-[#4881E3]">{stat.num}</div>
              <div className="text-sm text-[#818181]">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default OurTeam;
