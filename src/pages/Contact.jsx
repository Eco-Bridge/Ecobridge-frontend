import { useState } from "react";
import { Mail, MessageCircle, MapPin, Send, CheckCircle2 } from "lucide-react";
import TopNavBar from "../components/TopNavBar";
import Footer from "../components/Footer";

// Replace these with your real contact details.
const SUPPORT_EMAIL = "rahmatopoola9@gmail.com";
const WHATSAPP_NUMBER = "2349158525758"; // no + or spaces, matches wa.me format

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: send this to your Node.js contact endpoint, or a service like
    // Formspree if you don't have a backend for this yet.
    console.log({ name, email, message });
    setSent(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div>
      <TopNavBar />

      <section className="px-6 md:px-10 py-16 bg-[#EAF6EC]">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-[#1A1A2E]">Get in Touch</h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            Have a question or need help? We're here for you.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-10 py-16 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
          {/* Direct contact options */}
          <div className="space-y-4">
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="flex items-start gap-3 border border-[#E5E7EB] rounded-xl p-5 hover:border-[#0D631B]/40 transition-colors"
            >
              <span className="w-10 h-10 rounded-full bg-[#E7F7EC] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-[#0D631B]" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[#1A1A2E]">Email Us</p>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  We usually reply within 24 hours.
                </p>
                <p className="text-sm text-[#0D631B] mt-1">{SUPPORT_EMAIL}</p>
              </div>
            </a>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 border border-[#E5E7EB] rounded-xl p-5 hover:border-[#0D631B]/40 transition-colors"
            >
              <span className="w-10 h-10 rounded-full bg-[#E7F7EC] flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 text-[#0D631B]" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[#1A1A2E]">Chat on WhatsApp</p>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Fastest way to reach our support team directly.
                </p>
                <p className="text-sm text-[#0D631B] mt-1">Message us now →</p>
              </div>
            </a>

            <div className="flex items-start gap-3 border border-[#E5E7EB] rounded-xl p-5">
              <span className="w-10 h-10 rounded-full bg-[#E7F7EC] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-[#0D631B]" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[#1A1A2E]">Find Us</p>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  EcoBridge Collection Hub, Ikeja, Lagos, Nigeria.
                </p>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="border border-[#E5E7EB] rounded-xl p-6">
            {sent && (
              <div className="mb-4 flex items-center gap-2 bg-[#E7F7EC] text-[#0D631B] text-sm rounded-lg px-4 py-2.5">
                <CheckCircle2 className="w-4 h-4" />
                Message sent! We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help?"
                  rows={5}
                  required
                  className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D631B]/40 focus:border-[#0D631B]"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#0D631B] text-white font-medium py-2.5 rounded-lg hover:bg-[#0a4f15] transition-colors"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}