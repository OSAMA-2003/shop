import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import logo from '../assets/logo.png';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  ArrowUp
} from 'lucide-react';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube
} from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";

import toast from 'react-hot-toast';

// 1. Define Animation Variants
const footerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubscribe = (e) => {
    e.preventDefault();
    const emailInput = e.target.elements.email.value;
    if (emailInput) {
      toast.success('SUBSCRIBED SUCCESSFULLY! THANK YOU.');
      e.target.reset();
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socials = [
    { Icon: FaFacebookF, url: 'https://facebook.com', label: 'Facebook' },
    { Icon: FaXTwitter, url: 'https://twitter.com', label: 'Twitter' },
    { Icon: FaInstagram, url: 'https://instagram.com', label: 'Instagram' },
    { Icon: FaLinkedinIn, url: 'https://linkedin.com', label: 'LinkedIn' },
    { Icon: FaYoutube, url: 'https://youtube.com', label: 'YouTube' },
  ];

  const quickLinks = [
    { label: 'Home', to: 'home' },
    { label: 'Collection', to: 'categories' },
    { label: 'Mockups', to: 'mockups' },
    { label: 'Contact', to: 'contact' },
  ];

  const collections = [
    { label: 'Urban Apparel', to: 'categories' },
    { label: 'Streetwear Tees', to: 'categories' },
    { label: 'Premium Hoodies', to: 'categories' },
    { label: 'Accessories', to: 'categories' },
  ];

  return (
    <footer className="w-full bg-black text-[#f9f9f6] pt-16 pb-8 px-6 sm:px-10 font-sans border-t-[6px] border-[#ff5500] overflow-hidden">
      <motion.div
        variants={footerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.1 }}
        className="max-w-7xl mx-auto space-y-12"
      >
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Column 1: Brand & Logo */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Logo"
                onClick={() => {
                  if (location.pathname === '/') {
                    scrollToTop();
                  } else {
                    navigate('/');
                  }
                }}
                className="w-16 h-auto object-contain cursor-pointer hover:scale-105 transition-transform border border-zinc-800 p-1 bg-zinc-950/50 rounded-lg"
              />
              <div>
                <h2 className="text-2xl font-black  tracking-tighter leading-none">
                  <span className="text-[#ff5500]">K</span>yandr
                </h2>
                <p className="text-[10px] font-mono font-bold tracking-widest text-[#ff5500] uppercase mt-1">
                  BRUTALIST CANVAS
                </p>
              </div>
            </div>

            <p className="text-sm font-semibold font-mono text-gray-400 leading-relaxed max-w-sm pt-2">
              Not just clothes, it’s your vibe. Stay bold, stay Kyandr.
            </p>

            {/* Social Media Accounts with Lucide Icons */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              {socials.map(({ Icon, url, label }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 flex items-center justify-center bg-zinc-900 border-[2px] border-zinc-800 text-[#f9f9f6] hover:bg-[#ff5500] hover:text-black hover:border-black hover:-translate-y-1 active:translate-y-0 active:translate-x-0 transition-all duration-300 shadow-[2px_2px_0px_0px_rgba(255,85,0,0.25)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-none"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-black uppercase tracking-widest text-[#ff5500] border-b border-zinc-800 pb-2">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map(({ label, to }) => (
                <li key={label}>
                  {location.pathname === '/' ? (
                    <ScrollLink
                      to={to}
                      smooth={true}
                      duration={500}
                      offset={-80}
                      className="text-gray-400 hover:text-[#ff5500] transition-colors cursor-pointer text-sm font-bold uppercase tracking-wider block py-1"
                    >
                      {label}
                    </ScrollLink>
                  ) : (
                    <button
                      onClick={() => navigate('/')}
                      className="text-gray-400 hover:text-[#ff5500] transition-colors text-left text-sm font-bold uppercase tracking-wider block py-1 cursor-pointer"
                    >
                      {label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Collections */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-black uppercase tracking-widest text-[#ff5500] border-b border-zinc-800 pb-2">
              Collections
            </h3>
            <ul className="space-y-2.5">
              {collections.map(({ label, to }) => (
                <li key={label}>
                  {location.pathname === '/' ? (
                    <ScrollLink
                      to={to}
                      smooth={true}
                      duration={500}
                      offset={-80}
                      className="text-gray-400 hover:text-[#ff5500] transition-colors cursor-pointer text-sm font-bold uppercase tracking-wider block py-1"
                    >
                      {label}
                    </ScrollLink>
                  ) : (
                    <button
                      onClick={() => navigate('/')}
                      className="text-gray-400 hover:text-[#ff5500] transition-colors text-left text-sm font-bold uppercase tracking-wider block py-1 cursor-pointer"
                    >
                      {label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Contact & Newsletter */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-black uppercase tracking-widest text-[#ff5500] border-b border-zinc-800 pb-2">
              Newsletter
            </h3>
            <p className="text-sm font-semibold font-mono text-gray-400">
              Join the underground. Get 10% off your first drop.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col gap-2 pt-1">
              <div className="flex items-center border-[2px] border-zinc-800 focus-within:border-[#ff5500] bg-zinc-950 px-3 py-2 transition-colors">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="YOU@EXAMPLE.COM"
                  className="w-full bg-transparent border-none text-white text-xs font-bold font-mono uppercase focus:outline-none placeholder-zinc-600"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="text-gray-400 hover:text-[#ff5500] transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2.5 text-xs font-mono font-semibold text-gray-400">
                <Mail className="w-4 h-4 text-[#ff5500]" />
                <span>support@ecommerce.com</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-mono font-semibold text-gray-400">
                <Phone className="w-4 h-4 text-[#ff5500]" />
                <span>+123 456 7890</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-mono font-semibold text-gray-400">
                <MapPin className="w-4 h-4 text-[#ff5500]" />
                <span>Imagination Street, Future City</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Left: Copyright */}
          <motion.div variants={itemVariants} className="text-center md:text-left">
            <p className="font-mono text-xs font-bold text-gray-500 uppercase">
              © {new Date().getFullYear()} E-Commerce. All rights reserved.
            </p>
          </motion.div>

          {/* Right: Payment Icons & Back to Top */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-6">
            {/* Visual Payment Badges (Clean Neo-Brutalist Placeholders) */}
            <div className="flex gap-2">
              {['VISA', 'MC', 'PP', 'AP'].map((badge) => (
                <span
                  key={badge}
                  className="px-2 py-0.5 border border-zinc-800 bg-zinc-950 font-mono text-[9px] font-black uppercase tracking-widest text-zinc-500"
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* Back to top button */}
            <button
              onClick={scrollToTop}
              className="p-2 bg-zinc-900 border-[2px] border-zinc-800 text-gray-400 hover:text-white hover:bg-[#ff5500] hover:border-black transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] active:translate-y-0.5 active:shadow-none"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;