import { Leaf } from "lucide-react";

const FOOTER_COLUMNS = {
  Platform: [
    { label: "How It Works", href: "/how-it-works" },
    { label: "Rewards", href: "/reward" },
    { label: "Locations", href: "#" },
  ],
  Support: [
    { label: "FAQ", href: "/how-it-works#faq" },
    { label: "Contact Us", href: "/contact" },
    { label: "Privacy Policy", href: "#" },
  ],
  Brand: [
    { label: "Our Mission", href: "/about" },
    { label: "Impact Report", href: "#" },
  ],
};

export default function Footer({ variant = "full" }) {
  if (variant === "minimal") {
    return (
      <footer className="text-center py-6">
        <p className="text-xs text-gray-400">
          © 2026 EcoBridge. Empowering Nigerian communities.
        </p>
      </footer>
    );
  }

  if (variant === "compact") {
    return (
      <footer className="bg-[#EAF6EC] border-t border-[#E5E7EB] px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#6B7280]">
          <span className="font-semibold text-[#0D631B]">EcoBridge</span>
          <div className="flex items-center gap-4">
            <a href="/privacy-policy" className="hover:text-[#0D631B]">Privacy Policy</a>
            <a href="/terms-of-service" className="hover:text-[#0D631B]">Terms of Service</a>
            <a href="/contact" className="hover:text-[#0D631B]">Contact Us</a>
          </div>
          <span>© 2026 EcoBridge. All rights reserved.</span>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-[#EAF6EC] px-6 md:px-10 py-10">
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-[#0D631B]" />
            <span className="font-semibold text-[#1A1A2E]">EcoBridge</span>
          </div>
          <p className="mt-3 text-xs text-[#6B7280] max-w-[220px]">
            © 2026 EcoBridge. Empowering Nigerian communities for a
            sustainable future.
          </p>
        </div>

        {Object.entries(FOOTER_COLUMNS).map(([heading, links]) => (
          <div key={heading}>
            <p className="text-sm font-semibold text-[#1A1A2E]">{heading}</p>
            <ul className="mt-3 space-y-2">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-xs text-[#6B7280] hover:text-[#0D631B]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}