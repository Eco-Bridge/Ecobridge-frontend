import { Check } from "lucide-react";
import Logo from "./Logo";
import SignupIllustration from "../assets/signup.jpg";

const BENEFITS = [
  {
    title: "Earn Real Rewards",
    desc: "Convert your recyclables into points redeemable for cash and essentials.",
  },
  {
    title: "Build Community",
    desc: "Connect with local eco-champions and track your collective impact.",
  },
  {
    title: "Cleaner Environment",
    desc: "Directly contribute to a greener, healthier Lagos for future generations.",
  },
];

export default function BrandPanel({ illustration }) {
  return (
    <div className="w-full md:w-[38%] bg-[#0D631B] text-white p-8 md:p-10 flex flex-col justify-between">
    
    <div className="flex items-center gap-2">
      <Logo variant="light" />
    </div>

      <div className="my-8 md:my-0">
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">
          Join Lagos Recyclers
        </h1>
        <p className="mt-3 text-sm text-white/80 max-w-sm">
          Be part of the movement transforming waste into wealth across Lagos
          State. Your sustainable journey starts here.
        </p>

        <ul className="mt-8 space-y-5">
          {BENEFITS.map((b) => (
            <li key={b.title} className="flex gap-3">
              <span className="shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Check className="w-4 h-4" />
              </span>
              <div>
                <p className="text-sm font-semibold">{b.title}</p>
                <p className="text-xs text-white/75 mt-0.5">{b.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {illustration ? (
          <img src={SignupIllustration} alt="People sorting recyclables in Lagos" className="rounded-xl w-full h-56 object-cover" />
      ) : (
          <div className="hidden md:flex h-32 rounded-xl bg-white/10 border border-dashed border-white/30 items-center justify-center text-xs text-white/60">
          Swap in your illustration asset here
          </div>
      )}
      

    </div>
  );
}