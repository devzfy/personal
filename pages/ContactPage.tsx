import React, { useState } from "react";
import { motion } from "framer-motion";
import ThreeCanvas from "../components/ThreeCanvas";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would handle the form submission here
    console.log("Form Submitted:", formData);
    alert("Thank you for your message! This is a demo submission.");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const socialLinks = [
    {
      name: "Telegram",
      url: "https://t.me/devzfy",
      icon: (
        <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701-.331 4.958c.488 0 .702-.223.973-.486l2.337-2.273 4.857 3.589c.895.493 1.538.239 1.761-.832l3.185-15.008c.326-1.307-.5-1.894-1.355-1.503z" />
      ),
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/devzfy",
      icon: (
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      ),
    },
    {
      name: "Instagram",
      url: "https://instagram.com/devzfy",
      icon: (
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.805.249 2.227.412.558.217.957.477 1.377.896.419.42.679.819.896 1.377.163.422.358 1.057.412 2.227.059 1.266.071 1.646.071 4.85s-.012 3.584-.07 4.85c-.056 1.17-.251 1.805-.414 2.227-.217.558-.477.957-.896 1.377-.42.419-.819.679-1.377.896-.422.163-1.057.359-2.227.412-1.266.059-1.646.071-4.85.071s-3.584-.012-4.85-.07c-1.17-.056-1.805-.251-2.227-.414-.558-.217-.957-.477-1.377-.896-.419-.42-.679-.819-.896-1.377-.163-.422-.358-1.057-.412-2.227-.058-1.266-.071-1.646-.071-4.85s.013-3.584.071-4.85c.054-1.17.249-1.805.412-2.227.217-.558.477-.957.896-1.377.42-.419.819-.679 1.377-.896.422-.163 1.057-.358 2.227-.412 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.277.057-2.148.258-2.911.556-.788.306-1.457.715-2.122 1.381-.667.665-1.076 1.334-1.382 2.122-.298.763-.499 1.634-.556 2.911-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.057 1.277.258 2.148.556 2.911.306.788.715 1.457 1.381 2.122.665.666 1.334 1.076 2.122 1.382.763.298 1.634.499 2.911.556 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.277-.057 2.148-.258 2.911-.556.788-.306 1.457-.715 2.122-1.381.666-.665 1.076-1.334 1.382-2.122.298-.763.499-1.634.556-2.911.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.057-1.277-.258-2.148-.556-2.911-.306-.788-.715-1.457-1.381-2.122-.665-.667-1.334-1.076-2.122-1.382-.763-.298-1.634-.499-2.911-.556-1.28-.058-1.688-.072-4.947-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      ),
    },
    {
      name: "Facebook",
      url: "https://facebook.com/devzfy",
      icon: (
        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
      ),
    },
  ];

  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden flex flex-col items-center justify-start px-6 pt-32 pb-20">
      <ThreeCanvas />

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium tracking-[0.4em] text-red-600 uppercase mb-4 block">
            Get In Touch
          </span>
          <h1 className="text-5xl md:text-8xl font-serif mb-6 leading-tight">
            Work <span className="italic text-red-600">With Me.</span>
          </h1>
          <p className="text-white/40 text-lg max-w-xl mx-auto uppercase tracking-widest text-sm">
            Have a vision? Let's bring it to life through code.
          </p>
        </motion.div>

        {/* Contact Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20"
        >
          <div className="flex flex-col">
            <label className="text-[10px] uppercase tracking-widest text-white/40 mb-2 ml-1">
              Full Name *
            </label>
            <input
              required
              type="text"
              name="fullName"
              placeholder="Javokhir Shokirov"
              value={formData.fullName}
              onChange={handleChange}
              className="bg-white/5 border border-white/10 px-4 py-4 focus:outline-none focus:border-red-600 transition-colors text-white placeholder:text-white/10"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] uppercase tracking-widest text-white/40 mb-2 ml-1">
              Email Address *
            </label>
            <input
              required
              type="email"
              name="email"
              placeholder="hello@example.com"
              value={formData.email}
              onChange={handleChange}
              className="bg-white/5 border border-white/10 px-4 py-4 focus:outline-none focus:border-red-600 transition-colors text-white placeholder:text-white/10"
            />
          </div>
          <div className="flex flex-col md:col-span-2">
            <label className="text-[10px] uppercase tracking-widest text-white/40 mb-2 ml-1">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="+998 -- --- -- --"
              value={formData.phone}
              onChange={handleChange}
              className="bg-white/5 border border-white/10 px-4 py-4 focus:outline-none focus:border-red-600 transition-colors text-white placeholder:text-white/10"
            />
          </div>
          <div className="flex flex-col md:col-span-2">
            <label className="text-[10px] uppercase tracking-widest text-white/40 mb-2 ml-1">
              Message *
            </label>
            <textarea
              required
              name="message"
              rows={5}
              placeholder="Tell me about your project..."
              value={formData.message}
              onChange={handleChange}
              className="bg-white/5 border border-white/10 px-4 py-4 focus:outline-none focus:border-red-600 transition-colors text-white placeholder:text-white/10 resize-none"
            />
          </div>
          <div className="md:col-span-2 mt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-5 bg-red-600 text-white font-bold uppercase tracking-[0.3em] text-sm hover:bg-white hover:text-black transition-all duration-300"
            >
              Send Message
            </motion.button>
          </div>
        </motion.form>

        {/* Social Reach Out Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center"
        >
          <p className="text-white/40 text-xs uppercase tracking-[0.5em] mb-10">
            Or reach out via:
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5, color: "#dc2626" }}
                className="flex flex-col items-center group"
              >
                <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center mb-3 group-hover:border-red-600 transition-colors">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    {social.icon}
                  </svg>
                </div>
                <span className="text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  {social.name}
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Location / Status Info */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-12 text-white/40 text-[10px] tracking-[0.3em] uppercase border-t border-white/5 pt-12">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-white/20 mb-2 tracking-normal">Location</span>
            <span className="text-white/60">Tashkent, Uzbekistan (UTC+5)</span>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <span className="text-white/20 mb-2 tracking-normal">Status</span>
            <span className="text-green-500">Currently Open for Freelance</span>
          </div>
        </div>
      </div>

      {/* Background Decor */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 opacity-10 text-[10px] tracking-[2em] whitespace-nowrap pointer-events-none select-none">
        JAVOKHIR SHOKIROV • PREMIUM ENGINEERING
      </div>
    </div>
  );
};

export default ContactPage;
