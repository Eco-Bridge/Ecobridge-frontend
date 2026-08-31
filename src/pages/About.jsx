import TopNavBar from "../components/TopNavBar";
import Footer from "../components/Footer";
import AboutIllustration from "../assets/about.jpg"

const STATS = [
  { value: "500+", label: "Active Users" },
  { value: "2,000kg", label: "Waste Recycled" },
  { value: "300+", label: "Rewards Given" },
  { value: "5+", label: "Partner Centers" },
];

const STORY = [
  {
    year: "2023",
    title: "The Vision",
    desc: "EcoBridge was founded by a group of Lagosians frustrated by the daily sight of mismanaged waste and inspired by the potential for change.",
  },
  {
    year: "2024",
    title: "First Partnerships",
    desc: "We launched our pilot program, partnering with two major recycling centers in Ikeja and onboarding our first 100 dedicated users.",
  },
  {
    year: "2025",
    title: "City-Wide Expansion",
    desc: "Expanding our network across Lagos, introducing smart contracts for transparent tracking, and onboarding major corporate reward partners.",
  },
];

export default function About() {
  return (
    <div>
      <TopNavBar />

      {/* Mission hero */}
      <section className="bg-[#EAF6EC] px-6 md:px-10 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight text-[#1A1A2E]">
              We Believe Lagos{" "}
              <span className="text-[#0D631B]">Deserves Better.</span>
            </h1>

            <p className="mt-4 text-sm text-[#6B7280] max-w-md">
              EcoBridge is on a mission to transform waste management in
              Lagos from a challenge into an opportunity. We connect
              citizens, recycling centers, and sustainable brands to create a
              cleaner, greener city while rewarding positive action.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/signup"
                className="bg-[#0D631B] text-white font-medium px-5 py-2.5 rounded-lg hover:bg-[#0a4f15] transition-colors"
              >
                Join the Movement
              </a>
              <a
                href="/impact"
                className="border border-[#0D631B] text-[#0D631B] font-medium px-5 py-2.5 rounded-lg hover:bg-[#E7F7EC] transition-colors"
              >
                Our Impact
              </a>
            </div>
          </div>

          <img src={AboutIllustration} alt="Lagos SkyLine" className="rounded-2xl w-full h-72 object-cover" />
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-[#0D631B] px-6 md:px-10 py-10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="text-xl md:text-2xl font-bold text-white">{stat.value}</p>
              <p className="mt-1 text-xs text-white/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story timeline */}
      <section className="px-6 md:px-10 py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#1A1A2E]">Our Story</h2>
          <p className="mt-2 text-sm text-[#6B7280]">
            How a simple idea grew into a city-wide movement for a cleaner
            Lagos.
          </p>

          <div className="mt-12">
            {/* Line + year badges — separate fixed-height row so card length can never shift alignment */}
            <div className="relative h-10">
              <div className="absolute top-1/2 left-0 right-0 h-px bg-[#E5E7EB] -translate-y-1/2" />
              <div className="relative grid md:grid-cols-3 gap-8">
                {STORY.map((item) => (
                  <div key={item.year} className="flex justify-center">
                    <span className="bg-[#0D631B] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                      {item.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cards row */}
            <div className="mt-4 grid md:grid-cols-3 gap-8 text-left">
              {STORY.map((item) => (
                <div key={item.year} className="border border-[#E5E7EB] rounded-xl p-5">
                  <p className="text-sm font-semibold text-[#1A1A2E]">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs text-[#6B7280]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}