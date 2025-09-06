import React, { useEffect, useMemo, useRef, useState } from "react";

/* ---------- Mock data ---------- */
const BEACHES = [
  { id: "grace-bay", name: "Grace Bay Beach", country: "Turks & Caicos", zone: "NORTH", description: "Powder-soft sands and calm turquoise waters protected by a barrier reef.", images: ["https://images.unsplash.com/photo-1500375592092-40eb2168fd21","https://images.unsplash.com/photo-1507525428034-b723cf961d3e"] },
  { id: "bondi", name: "Bondi Beach", country: "Australia", zone: "EAST", description: "Iconic crescent beach near Sydney with buzzing promenade and surf culture.", images: ["https://images.unsplash.com/photo-1469474968028-56623f02e42e","https://images.unsplash.com/photo-1540541338287-41700207dee6"] },
  { id: "miami-south", name: "South Beach", country: "USA", zone: "WEST", description: "Art Deco vibes, palm-lined sands and lively boardwalks in Miami.", images: ["https://images.unsplash.com/photo-1533105079780-92b9be482077","https://images.unsplash.com/photo-1526481280698-8fcc13fdab58"] },
  { id: "zanzibar-nungwi", name: "Nungwi Beach", country: "Tanzania", zone: "SOUTH", description: "Crystal waters, dhow boats and spectacular sunsets at Zanzibar’s tip.", images: ["https://images.unsplash.com/photo-1455211641447-59724f265d3d","https://images.unsplash.com/photo-1493558103817-58b2924bce98"] },
];

const ZONES = ["NORTH", "SOUTH", "EAST", "WEST"];

/* ---------- helpers ---------- */
const classNames = (...xs) => xs.filter(Boolean).join(" ");

function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, setState];
}

/* ---------- Components ---------- */
const Logo = () => (
  <div className="flex items-center gap-2 select-none">
    <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-500 text-white font-bold shadow-md">BB</span>
    <span className="text-xl sm:text-2xl font-black tracking-tight">BeautyOfBeaches</span>
  </div>
);

const VisitorCounter = () => {
  const [visits, setVisits] = useLocalStorage("bb_visits", 0);
  useEffect(() => setVisits(v => v + 1), [setVisits]);
  return <div className="text-xs sm:text-sm text-gray-600">Visitors: <span className="font-semibold">{(visits || 0).toLocaleString()}</span></div>;
};

const Navbar = ({ active, onNavigate }) => {
  const links = [
    { id: "home", label: "Home" },
    { id: "gallery", label: "Gallery" },
    { id: "zones", label: "Zones" },
    { id: "ads", label: "Travel" },
    { id: "feedback", label: "Feedback" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
    { id: "sitemap", label: "Sitemap" },
  ];
  return (
    <nav className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Logo />
          <div className="hidden md:flex items-center gap-2">
            {links.map(l => (
              <button
                key={l.id}
                onClick={() => onNavigate(l.id)}
                className={classNames("px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                  active === l.id ? "bg-blue-600 text-white shadow" : "text-gray-700 hover:text-blue-700 hover:bg-blue-50")}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="md:hidden">
            <select aria-label="Navigate" className="border rounded-xl p-2 bg-white" value={active} onChange={(e) => onNavigate(e.target.value)}>
              {links.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
            </select>
          </div>

          <VisitorCounter />
        </div>
      </div>
    </nav>
  );
};

const Hero = ({ onExplore }) => (
  <section id="home" className="relative">
    <div className="h-[52vh] sm:h-[60vh] md:h-[66vh] w-full bg-cover bg-center" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e)" }}>
      <div className="h-full w-full bg-gradient-to-t from-black/50 via-black/20 to-transparent flex items-end">
        <div className="max-w-7xl mx-auto px-4 pb-8 text-white">
          <h1 className="text-3xl sm:text-5xl font-black drop-shadow">Explore the World’s Most Beautiful Beaches</h1>
          <p className="mt-2 max-w-2xl text-sm sm:text-base text-white/90">A single-page, responsive guide. Filter by zone, browse the gallery, send feedback and download details — all in one place.</p>
          <button onClick={onExplore} className="mt-4 px-5 py-3 bg-white/90 text-gray-900 rounded-2xl font-semibold hover:bg-white shadow-lg">Start Exploring</button>
        </div>
      </div>
    </div>
  </section>
);

const BeachCard = ({ beach, onOpen }) => (
  <div className="group rounded-2xl overflow-hidden bg-white shadow hover:shadow-lg transition">
    <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${beach.images?.[0]})` }} />
    <div className="p-4">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 px-2 py-0.5 font-medium">{beach.zone}</span>
        <span>•</span>
        <span>{beach.country}</span>
      </div>
      <h3 className="mt-1 text-lg font-bold">{beach.name}</h3>
      <p className="text-sm text-gray-600 line-clamp-2">{beach.description}</p>
      <div className="mt-3"><button onClick={onOpen} className="text-blue-700 hover:underline font-medium">View Details</button></div>
    </div>
  </div>
);

const GalleryModal = ({ open, onClose, beach }) => {
  const ref = useRef(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  if (!beach) return null;
  return (
    <dialog ref={ref} className="rounded-2xl p-0 max-w-2xl w-[95vw]">
      <div>
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h4 className="text-lg font-bold">{beach.name}</h4>
            <p className="text-sm text-gray-600">{beach.country} • {beach.zone}</p>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">✕</button>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {beach.images.map((src, i) => <img key={i} src={src} alt={`${beach.name} ${i+1}`} className="rounded-xl w-full h-48 object-cover" />)}
        </div>
        <div className="p-4"><p className="text-sm text-gray-700">{beach.description}</p></div>
      </div>
    </dialog>
  );
};

const ZonesSection = () => {
  const [filter, setFilter] = useState("ALL");
  const [open, setOpen] = useState(false);
  const [activeBeach, setActiveBeach] = useState(null);
  const beaches = useMemo(() => (filter === "ALL" ? BEACHES : BEACHES.filter(b => b.zone === filter)), [filter]);

  return (
    <section id="zones" className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h2 className="text-2xl sm:text-3xl font-black">Beaches by Zone</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => setFilter("ALL")} className={classNames("px-3 py-1.5 rounded-xl text-sm border", filter === "ALL" ? "bg-blue-600 text-white border-blue-600" : "hover:bg-blue-50")}>All</button>
          {ZONES.map(z => <button key={z} onClick={() => setFilter(z)} className={classNames("px-3 py-1.5 rounded-xl text-sm border", filter === z ? "bg-blue-600 text-white border-blue-600" : "hover:bg-blue-50")}>{z}</button>)}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {beaches.map(b => <BeachCard key={b.id} beach={b} onOpen={() => { setActiveBeach(b); setOpen(true); }} />)}
      </div>

      <GalleryModal open={open} onClose={() => setOpen(false)} beach={activeBeach} />
    </section>
  );
};

const GallerySection = () => (
  <section id="gallery" className="max-w-7xl mx-auto px-4 py-10">
    <h2 className="text-2xl sm:text-3xl font-black">Gallery</h2>
    <p className="text-sm text-gray-600 mt-1">A rotating selection of beach images.</p>
    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {BEACHES.flatMap(b => b.images).slice(0, 12).map((src, i) => <img key={i} src={src} alt="beach" className="rounded-xl h-36 w-full object-cover" />)}
    </div>
  </section>
);

const TravelAds = () => (
  <section id="ads" className="max-w-7xl mx-auto px-4 py-10">
    <h2 className="text-2xl sm:text-3xl font-black">Travel</h2>
    <p className="text-sm text-gray-600 mt-1">Plan how to get there: buses & flights.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div className="rounded-2xl p-5 border bg-gradient-to-br from-blue-50 to-white">
        <h3 className="text-xl font-bold">Flights</h3>
        <p className="text-sm text-gray-600 mt-1">Compare fares and find routes to beach destinations.</p>
        <a href="#" className="inline-block mt-3 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold">Search Flights</a>
      </div>
      <div className="rounded-2xl p-5 border bg-gradient-to-br from-emerald-50 to-white">
        <h3 className="text-xl font-bold">Buses</h3>
        <p className="text-sm text-gray-600 mt-1">Find intercity buses and coastal routes.</p>
        <a href="#" className="inline-block mt-3 px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold">Find Buses</a>
      </div>
    </div>
  </section>
);

const FeedbackSection = () => {
  const [entries, setEntries] = useLocalStorage("bb_feedback", []);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function submit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setEntries([ { ...form, ts: Date.now() }, ...entries ]);
    setForm({ name: "", email: "", message: "" });
    alert("Thanks for your feedback!");
  }

  return (
    <section id="feedback" className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl sm:text-3xl font-black">Feedback</h2>
      <p className="text-sm text-gray-600 mt-1">Tell us what you think or suggest a beach to add.</p>
      <form onSubmit={submit} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input required placeholder="Your name" className="border rounded-xl p-3" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} />
        <input required type="email" placeholder="Email" className="border rounded-xl p-3" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} />
        <textarea required placeholder="Message" className="border rounded-xl p-3 md:col-span-2 min-h-[120px]" value={form.message} onChange={(e)=>setForm({...form, message: e.target.value})} />
        <div className="md:col-span-2"><button className="px-5 py-3 rounded-2xl bg-blue-600 text-white font-semibold">Submit</button></div>
      </form>

      {entries.length > 0 && (
        <div className="mt-6">
          <h3 className="font-bold">Recent feedback</h3>
          <ul className="mt-2 space-y-2">
            {entries.slice(0,5).map((e,i) => (
              <li key={i} className="border rounded-xl p-3">
                <div className="text-sm font-semibold">{e.name}</div>
                <div className="text-xs text-gray-500">{new Date(e.ts).toLocaleString()}</div>
                <p className="text-sm mt-1">{e.message}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

const AboutSection = () => (
  <section id="about" className="max-w-7xl mx-auto px-4 py-10">
    <h2 className="text-2xl sm:text-3xl font-black">About Us</h2>
    <p className="text-sm text-gray-700 mt-2">We are students building a responsive SPA to showcase the world’s most beautiful beaches.</p>
    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
      <div className="rounded-2xl border p-4"><div className="font-bold">Email</div><a className="text-blue-700" href="mailto:info@beautyofbeaches.example">info@beautyofbeaches.example</a></div>
      <div className="rounded-2xl border p-4"><div className="font-bold">Address</div><p>123 Ocean View, Lagos, Nigeria</p></div>
      <div className="rounded-2xl border p-4"><div className="font-bold">Contact</div><p>+234 800 000 0000</p></div>
    </div>
  </section>
);

const ContactSection = () => (
  <section id="contact" className="max-w-7xl mx-auto px-4 py-10">
    <h2 className="text-2xl sm:text-3xl font-black">Contact Us</h2>
    <p className="text-sm text-gray-700 mt-2">Reach out for queries, partnerships or contributions.</p>
    <ul className="mt-3 text-sm text-gray-700 list-disc pl-5">
      <li>Email: support@beautyofbeaches.example</li>
      <li>Phone: +234 800 000 0000</li>
      <li>Address: 123 Ocean View, Lagos, Nigeria</li>
    </ul>
  </section>
);

const SitemapSection = () => (
  <section id="sitemap" className="max-w-7xl mx-auto px-4 py-10">
    <h2 className="text-2xl sm:text-3xl font-black">Sitemap</h2>
    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-sm">
      {[
        { href: "#home", label: "Home" },
        { href: "#gallery", label: "Gallery" },
        { href: "#zones", label: "Zones" },
        { href: "#ads", label: "Travel" },
        { href: "#feedback", label: "Feedback" },
        { href: "#about", label: "About" },
        { href: "#contact", label: "Contact" },
      ].map(l => <a key={l.href} href={l.href} className="hover:underline text-blue-700">{l.label}</a>)}
    </div>
  </section>
);

const DownloadButtons = () => {
  function downloadDoc() {
    const content = document.getElementById("downloadable-content");
    if (!content) return;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${content.innerHTML}</body></html>`;
    const blob = new Blob([html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "BeautyOfBeaches.doc"; a.click(); URL.revokeObjectURL(url);
  }
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button onClick={() => window.print()} className="px-4 py-2 rounded-xl bg-gray-800 text-white font-semibold">Print / Save as PDF</button>
      <button onClick={downloadDoc} className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold">Download .doc</button>
    </div>
  );
};

const FooterTicker = () => {
  const [now, setNow] = useState(new Date());
  const [coords, setCoords] = useState(null);
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => setCoords(pos.coords), () => setCoords(null), { timeout: 5000 });
    }
  }, []);
  const text = `Date: ${now.toLocaleDateString()}  Time: ${now.toLocaleTimeString()}  |  Location: ` + (coords ? `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}` : "Unavailable");
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white text-xs sm:text-sm py-2 overflow-hidden">
      <div className="whitespace-nowrap animate-marquee px-4">{text}</div>
      <style>{`@keyframes marquee {0%{transform:translateX(100%)} 100%{transform:translateX(-100%)}} .animate-marquee{display:inline-block;min-width:100%;animation:marquee 16s linear infinite}`}</style>
    </div>
  );
};

const PageFooter = () => (
  <footer className="bg-gray-50 border-t mt-12 print:hidden">
    <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-sm text-gray-600">© {new Date().getFullYear()} BeautyOfBeaches</p>
      <DownloadButtons />
    </div>
    <FooterTicker />
  </footer>
);

/* ---------- Main App ---------- */
export default function BeautyOfBeachesApp() {
  const [active, setActive] = useState("home");
  const containerRef = useRef(null);

  function navigateTo(id) {
    setActive(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  useEffect(() => {
    const ids = ["home", "gallery", "zones", "ads", "feedback", "about", "contact", "sitemap"];
    const elements = ids.map(id => document.getElementById(id)).filter(Boolean);
    if (elements.length === 0) return; // nothing to observe yet
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) setActive(visible.target.id);
    }, { rootMargin: "-40% 0px -55% 0px", threshold: [0.25, 0.5, 0.75] });

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="font-sans text-gray-900">
      <Navbar active={active} onNavigate={navigateTo} />
      <div id="downloadable-content">
        <Hero onExplore={() => navigateTo("zones")} />
        <GallerySection />
        <ZonesSection />
        <TravelAds />
        <FeedbackSection />
        <AboutSection />
        <ContactSection />
        <SitemapSection />
      </div>
      <PageFooter />
      <style>{`@media print { nav, .print\\:hidden, .fixed { display: none !important; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }`}</style>
    </div>
  );
}
