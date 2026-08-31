import {
  CheckCircle2,
  ArrowRight,
  Recycle,
  UserPlus,
  Truck,
  Wallet,
  Package,
  FileText,
  Wine,
} from "lucide-react";
import TopNavBar from "../components/TopNavBar";
import Footer from "../components/Footer";
import HomeIllustration from "../assets/home.jpg";

const STATS = [
  { value: "500+", label: "Registered Users" },
  { value: "2,000kg", label: "Waste Collected" },
  { value: "300+", label: "Rewards Redeemed" },
];

const RECYCLING_STEPS = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create Account",
    desc: "Sign up on the EcoBridge platform in under 2 minutes and set up your profile.",
  },
  {
    number: "02",
    icon: Truck,
    title: "Bring Waste",
    desc: "Sort your recyclables and drop them off at a nearby hub, or schedule a pickup.",
  },
  {
    number: "03",
    icon: Wallet,
    title: "Earn & Redeem",
    desc: "Get instantly credited eco-points and redeem them for cash or essentials.",
  },
];

const MATERIALS = [
  { icon: Recycle, name: "Plastic (PET)", points: "50", badge: "High Demand" },
  { icon: Package, name: "Aluminum Can", points: "60" },
  { icon: FileText, name: "Paper & Cardboard", points: "40" },
  { icon: Wine, name: "Glass Bottles", points: "30" },
];

export default function Home() {
  return (
    <div>
      <TopNavBar />

      {/* Hero Section */}
      <section className="px-6 md:px-10 py-16 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0D631B] bg-[#E7F7EC] px-3 py-1.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified Environmental Impact
            </span>

            <h1 className="mt-4 text-3xl md:text-4xl font-bold leading-tight text-[#1A1A2E]">
              Turn Your <span className="text-[#0D631B]">Waste</span>
              <br />
              Into Real Rewards
            </h1>

            <p className="mt-4 text-sm text-[#6B7280] max-w-md">
              Join thousands of Lagosians turning everyday recyclables into
              eco-points. Drop off plastic, paper, metal, and glass to earn
              rewards for your community and your wallet.
            </p>

            <a
              href="/signup"
              className="mt-6 inline-flex items-center gap-1.5 bg-[#0D631B] text-white font-medium px-5 py-2.5 rounded-lg hover:bg-[#0a4f15] transition-colors"
            >
              Start Earning Now
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="relative">
            <img src={HomeIllustration} alt="People sorting recyclables in Lagos" className="rounded-2xl w-full h-72 object-cover" />

            <div className="absolute -bottom-4 left-8 bg-white rounded-xl shadow-lg px-3 py-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E7F7EC] flex items-center justify-center">
                <Recycle className="w-3.5 h-3.5 text-[#0D631B]" />
              </span>
              <div>
                <p className="text-xs font-semibold text-[#1A1A2E] leading-none">50pts</p>
                <p className="text-[10px] text-[#6B7280] mt-0.5">Earned just now</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#0D631B] px-6 md:px-10 py-12">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 text-center">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
              <p className="mt-1 text-xs md:text-sm text-white/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recycling Made Simple */}
      <section className="px-6 md:px-10 py-16 bg-[#F8F7FB]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#1A1A2E]">
            Recycling Made Simple
          </h2>
          <p className="mt-2 text-sm text-[#6B7280] max-w-lg mx-auto">
            Three easy steps to start making an impact and earning rewards
            for a cleaner Lagos.
          </p>

          <div className="mt-10 grid sm:grid-cols-3 gap-6 text-left">
            {RECYCLING_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="bg-white rounded-xl p-5">
                  <div className="flex items-start justify-between">
                    <span className="w-10 h-10 rounded-full bg-[#E7F7EC] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#0D631B]" />
                    </span>
                    <span className="text-4xl font-medium text-[#E5E7EB] leading-none">
                      {step.number}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-[#1A1A2E]">{step.title}</p>
                  <p className="mt-1 text-xs text-[#6B7280]">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Value in Every Gram */}
      <section className="px-6 md:px-10 py-16 bg-[#EAF6EC]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-2xl font-bold text-[#1A1A2E]">Value in Every Gram</h2>
              <p className="mt-1 text-sm text-[#6B7280] max-w-lg">
                Different materials have different values. Here's a
                breakdown of what you can earn per kilogram of clean, sorted
                recyclables.
              </p>
            </div>
            <a href="/pricing" className="text-sm font-medium text-[#0D631B] hover:underline whitespace-nowrap">
              View Full Price List →
            </a>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {MATERIALS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.name} className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                  <div className="flex items-center justify-between">
                    <span className="w-10 h-10 rounded-full bg-[#EFECFF] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#6D28D9]" />
                    </span>
                    {item.badge && (
                      <span className="text-[10px] font-medium text-[#6D28D9] bg-[#EFECFF] px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-sm font-semibold text-[#1A1A2E]">{item.name}</p>
                  <p className="mt-1">
                    <span className="text-xl font-bold text-[#0D631B]">{item.points}</span>{" "}
                    <span className="text-xs text-[#6B7280]">pts / kg</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}