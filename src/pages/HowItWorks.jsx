import {
  UserPlus,
  Trash2,
  MapPin,
  Scale,
  Wallet,
  Gift,
  Recycle,
  FileText,
  Wine,
  Package,
} from "lucide-react";
import TopNavBar from "../components/TopNavBar";
import Footer from "../components/Footer";
import step1 from "../assets/how-it-works-imgs/step1.jpg";
import step2 from "../assets/how-it-works-imgs/step2.jpg";
import step3 from "../assets/how-it-works-imgs/step3.jpg";
import step4 from "../assets/how-it-works-imgs/step4.jpg";
import step5 from "../assets/how-it-works-imgs/step5.jpg";
import step6 from "../assets/how-it-works-imgs/step6.jpg"

const STEPS = [
  {
    number: "1",
    icon: UserPlus,
    title: "Create Account",
    desc: "Sign up on the EcoBridge platform to start your recycling journey. It only takes a minute to join the movement towards a cleaner Lagos.",
    illustration: step1,
  },
  {
    number: "2",
    icon: Trash2,
    title: "Sort Waste",
    desc: "Separate your recyclables at home. Clean plastics, glass, paper, and metals. Proper sorting ensures maximum value for your efforts.",
    illustration: step2,
  },
  {
    number: "3",
    icon: MapPin,
    title: "Visit Center",
    desc: "Bring your sorted waste to any of our certified EcoBridge collection centers conveniently located across Lagos.",
    illustration: step3,
  },
  {
    number: "4",
    icon: Scale,
    title: "Weighing",
    desc: "Our attendants will transparently weigh your recyclables. The weight and material type determine the points you'll receive.",
    illustration: step4,
  },
  {
    number: "5",
    icon: Wallet,
    title: "Earn Points",
    desc: "Points are instantly credited to your EcoBridge wallet based on the standard transparent rates for each material.",
    illustration: step5,
  },
  {
    number: "6",
    icon: Gift,
    title: "Redeem Rewards",
    desc: "Use your accumulated points to pay for essential services like electricity, water, airtime, or even groceries.",
    illustration: step6,
  },
];

const MATERIALS_TABLE = [
  { icon: Recycle, name: "PET Plastics", examples: "Water bottles, soda bottles", points: "50" },
  { icon: FileText, name: "Paper & Cardboard", examples: "Newspapers, cartons, office paper", points: "30" },
  { icon: Wine, name: "Glass", examples: "Beverage bottles, food jars", points: "20" },
  { icon: Package, name: "Aluminum & Metals", examples: "Drink cans, food tins", points: "80" },
];

// NOTE: your Figma had these FAQ items collapsed, so the answer text below
// is placeholder copy — swap in your real answers.
const FAQS = [
  {
    q: "Do I need to wash my recyclables?",
    a: "Yes — a quick rinse keeps items clean and easy to sort at the collection center.",
  },
  {
    q: "Is there a minimum weight requirement?",
    a: "No minimum — you can drop off any amount, though larger drop-offs are quicker to process per visit.",
  },
  {
    q: "How do I redeem my points?",
    a: "Open your EcoBridge wallet and choose from available redemption options like airtime, groceries, or utility payments.",
  },
];

export default function HowItWorks() {
  return (
    <div>
      <TopNavBar />

      {/* Page header */}
      <section className="bg-[#EAF6EC] px-6 md:px-10 py-14 text-center">
        <h1 className="text-3xl font-bold text-[#1A1A2E]">How EcoBridge Works</h1>
        <p className="mt-2 text-sm text-[#6B7280] max-w-md mx-auto">
          A simple, transparent process to turn your recyclable waste into
          rewarding value for you and your community.
        </p>
      </section>

      {/* Alternating steps */}
      <section className="px-6 md:px-10 py-16 bg-white">
        <div className="max-w-5xl mx-auto space-y-16">
          {STEPS.map((step, i) => {
            const reverse = i % 2 === 1;
            return (
              <div
                key={step.number}
                className={`grid md:grid-cols-2 gap-8 items-center ${
                  reverse ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="rounded-xl h-56 overflow-hidden shadow-sm flex items-center justify-center bg-gray-50">
                  <img src={step.illustration} alt={step.title}
                  className="w-full h-full object-cover" />
                </div>

                <div>
                  <span className="w-8 h-8 rounded-full bg-[#E7F7EC] flex items-center justify-center text-xs font-semibold text-[#0D631B]">
                    {step.number}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-[#1A1A2E]">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-[#6B7280] max-w-sm">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Value of Your Waste */}
      <section className="px-6 md:px-10 py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#1A1A2E]">Value of Your Waste</h2>
          <p className="mt-2 text-sm text-[#6B7280]">
            Transparent exchange rates for different recyclable materials.
          </p>

          <div className="mt-8 border border-[#E5E7EB] rounded-xl overflow-hidden text-left">
            <div className="grid grid-cols-3 bg-[#E7F7EC] px-5 py-3 text-xs font-semibold text-[#0D631B]">
              <span>Material Type</span>
              <span>Examples</span>
              <span className="text-right">Points per KG</span>
            </div>
            {MATERIALS_TABLE.map((row, i) => {
              const Icon = row.icon;
              return (
                <div
                  key={row.name}
                  className={`grid grid-cols-3 px-5 py-4 items-center text-sm ${
                    i !== MATERIALS_TABLE.length - 1 ? "border-b border-[#E5E7EB]" : ""
                  }`}
                >
                  <span className="flex items-center gap-2 text-[#1A1A2E] font-medium">
                    <Icon className="w-4 h-4 text-[#0D631B]" />
                    {row.name}
                  </span>
                  <span className="text-[#6B7280] text-xs">{row.examples}</span>
                  <span className="text-right font-semibold text-[#0D631B]">
                    {row.points} pts
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 md:px-10 py-16 bg-[#F8F7FB]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#1A1A2E]">
            Frequently Asked Questions
          </h2>

          <div className="mt-8 space-y-3 text-left">
            {FAQS.map((item) => (
              <details
                key={item.q}
                className="group bg-white border border-[#E5E7EB] rounded-lg px-4 py-3"
              >
                <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-[#1A1A2E] list-none">
                  {item.q}
                  <span className="text-[#6B7280] group-open:rotate-180 transition-transform">
                    ▾
                  </span>
                </summary>
                <p className="mt-2 text-sm text-[#6B7280]">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-[#0D631B] px-6 md:px-10 py-16 text-center">
        <h2 className="text-2xl font-bold text-white">Ready to make an impact?</h2>
        <p className="mt-2 text-sm text-white/80">
          Join thousands of Lagosians earning rewards while keeping our city
          clean.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/signup"
            className="bg-white text-[#0D631B] font-medium px-5 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Create Account
          </a>
          <a
            href="/how-it-works#centers"
            className="border border-white text-white font-medium px-5 py-2.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            Find a Center
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}