import { useState } from "react";
import {
  Leaf,
  Recycle,
  Wallet,
  UserPlus,
  Trash2,
  Clock,
  Gift,
} from "lucide-react";
import Footer from "../components/Footer";
import Logo from "../components/Logo";
import WaitlistSuccess from "../components/WaitlistSuccess";
import Waitlist from "../assets/waitlist-imgs/waitlist.svg";
import avatar1 from "../assets/waitlist-imgs/icon-waitlist.svg";
import avatar2 from "../assets/waitlist-imgs/icon-waitlist1.svg";
import avatar3 from "../assets/waitlist-imgs/icon-waitlist2.svg";


// const AVATARS = [avatar1, avatar2, avatar3];

const STEPS = [
  {
    icon: UserPlus,
    color: "#27AE60",
    bg: "#E7F7EC",
    title: "1. Sign Up",
    desc: "Join the waitlist and create your secure EcoBridge profile.",
  },
  {
    icon: Trash2,
    color: "#3B82F6",
    bg: "#E8F0FE",
    title: "2. Sort Waste",
    desc: "Separate your plastics, paper, metals, and glass.",
  },
  {
    icon: Clock,
    color: "#F59E0B",
    bg: "#FEF3C7",
    title: "3. Drop-off / Pickup",
    desc: "Visit a Hub in Lagos or schedule a convenient pickup.",
  },
  {
    icon: Wallet,
    color: "#0D631B",
    bg: "#E7F7EC",
    title: "4. Get Rewarded",
    desc: "Watch points hit your wallet instantly for every KG.",
  },
];

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [ctaEmail, setCtaEmail] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleWaitlistSubmit = (e) => {
    e.preventDefault();
    // TODO: wire up to your Node.js waitlist endpoint
    console.log({ name, email });
    setShowSuccess(true);
  };

  const handleCtaSubmit = (e) => {
    e.preventDefault();
    // TODO: wire up to your Node.js waitlist endpoint
    console.log({ ctaEmail });
    setShowSuccess(true);
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-2">
          <Logo />
        </div>
        <a
          href="#waitlist"
          className="bg-[#0D631B] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#0a4f15] transition-colors"
        >
          Join Waitlist
        </a>
      </nav>

      {/* Hero section */}
      <section className="bg-[#EAF6EC] px-6 md:px-10 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left: copy + waitlist form */}
          <div>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-[#0D631B] bg-white px-3 py-1 rounded-full">
              <Leaf className="w-3 h-3" />
              Coming Soon to Lagos
            </span>

            <h1 className="mt-4 text-3xl md:text-4xl font-bold leading-tight text-[#1A1A2E]">
              Recycle Your Waste.
              <br />
              <span className="text-[#0D631B]">Earn Real Rewards.</span>
            </h1>

            <p className="mt-4 text-sm text-[#374151] max-w-md">
              Join the smart recycling movement in Nigeria. Turn your
              everyday plastics, paper, and glass into airtime, groceries,
              and cash.
            </p>

            <div className="mt-4 flex items-center gap-2">
            
              <div className="flex -space-x-2">
                {[avatar1, avatar2, avatar3].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="w-7 h-7 rounded-sm border-1 border-white object-cover"
                  />
                ))}
              </div>
              <span className="text-xs text-[#6B7280]">247 already joined</span>
            </div>

            <form
              id="waitlist"
              onSubmit={handleWaitlistSubmit}
              className="mt-6 bg-white rounded-xl p-5 max-w-md shadow-sm"
            >
              <p className="text-sm font-semibold text-[#1A1A2E] mb-3">
                Secure Your Early Access
              </p>

              <div className="space-y-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  required
                  className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                  className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
                />
              </div>

              <button
                type="submit"
                className="mt-3 w-full bg-[#0D631B] text-white font-medium py-2.5 rounded-lg hover:bg-[#0a4f15] transition-colors"
              >
                Join the Waitlist
              </button>
            </form>
          </div>

          {/* Right: illustration + floating stat badges */}
          <div className="relative hidden md:block">
            {/* <div className="rounded-2xl bg-white border border-dashed border-[#D9E3F7] h-72 flex items-center justify-center ">
              Swap in your "Waitlist Landing Page" illustration here
            </div> */}

             <img src={Waitlist} alt="People sorting recyclables in Lagos" className="rounded-2xl w-full h-72 object-cover" />

            <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg px-3 py-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E8F0FE] flex items-center justify-center">
                <Recycle className="w-3.5 h-3.5 text-[#3B82F6]" />
              </span>
              <div>
                <p className="text-[10px] text-[#6B7280] leading-none">
                  Waste Collected
                </p>
                <p className="text-xs font-semibold text-[#1A1A2E]">1,340 kg</p>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg px-3 py-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#FEF3C7] flex items-center justify-center">
                <Gift className="w-3.5 h-3.5 text-[#F59E0B]" />
              </span>
              <div>
                <p className="text-[10px] text-[#6B7280] leading-none">
                  Rewards Available
                </p>
                <p className="text-xs font-semibold text-[#1A1A2E]">₦500,000+</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How EcoBridge Works */}
      <section className="px-6 md:px-10 py-16 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#1A1A2E]">
            How EcoBridge Works
          </h2>
          <p className="mt-2 text-sm text-[#6B7280] max-w-md mx-auto">
            A seamless process designed to make recycling as easy as making a
            phone call.
          </p>

          <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-4 gap-6 text-left">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="border border-[#E5E7EB] rounded-xl p-5"
                >
                  <span
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: step.bg }}
                  >
                    <Icon className="w-5 h-5" style={{ color: step.color }} />
                  </span>
                  <p className="mt-3 text-sm font-semibold text-[#1A1A2E]">
                    {step.title}
                  </p>
                  <p className="mt-1 text-xs text-[#6B7280]">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-[#0D631B] px-6 md:px-10 py-14">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white">
            Ready to transform your waste?
          </h2>
          <p className="mt-2 text-sm text-white/80">
            Join hundreds of Lagosians securing early access to the smartest
            way to recycle and earn.
          </p>

          <form
            onSubmit={handleCtaSubmit}
            className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={ctaEmail}
              onChange={(e) => setCtaEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 rounded-lg px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-white text-[#0D631B] font-medium px-5 py-2.5 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              Secure My Spot
            </button>
          </form>
        </div>
      </section>

      <Footer />

      {
        showSuccess &&(
          <WaitlistSuccess
            email={email}
            position={247}
            onClose={() => setShowSuccess(false)}
          />
        )
      }
    </div>
  );
}