/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, FormEvent, cloneElement } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Cookies from 'js-cookie';
import {
  Phone,
  ArrowRight,
  Menu,
  X,
  Users,
  Activity,
  Heart,
  Droplet,
  Zap,
  CheckCircle2,
  Calendar,
  Lock,
  ChevronDown,
  Video,
  MapPin,
  Clock,
  Hand,
  Brain,
  Leaf,
  Info,
  Wind,
  Scale,
  Sparkles,
  Headphones,
  Eye,
  Baby,
  RefreshCw,
  HeartPulse,
  MessageCircle,
  Stethoscope,
  ShieldCheck
} from 'lucide-react';
import { dbService, Appointment } from './services/db';
import { Language } from './types';
import { getTreatments } from './data/treatments';
import dr from './img/dr.avif';
import { ContactPage } from './pages/ContactPage';
import { TermsPage, PrivacyPage, RefundPage, DisclaimerPage } from './pages/LegalPages';
import { AdminPage } from './pages/AdminPage';
import { SEO } from './components/SEO';

// --- Shared Helper for WhatsApp ---
const getWhatsAppUrl = (message: string) => {
  return `https://wa.me/919761696655?text=${encodeURIComponent(message)}`;
};

// --- Language Selection Modal ---
const LanguageSelectionModal = ({ onSelect }: { onSelect: (lang: Language) => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-[48px] p-8 md:p-12 max-w-xl w-full shadow-2xl border border-gray-100"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-6">
            <HeartPulse className="w-10 h-10" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-text-main mb-4">Choose Language</h2>
          <p className="text-text-muted font-medium">Please select your preferred language to continue</p>
        </div>

        <div className="grid gap-4">
          <button
            onClick={() => onSelect(Language.HINDI)}
            className="flex items-center gap-4 p-6 rounded-3xl border-2 border-gray-100 hover:border-primary hover:bg-primary/5 transition-all text-left group"
          >
            <span className="text-3xl">🕉️</span>
            <div>
              <div className="text-xl font-bold text-text-main group-hover:text-primary">हिन्दी (Hindi)</div>
              <div className="text-sm text-text-muted">शुद्ध और सरल हिन्दी</div>
            </div>
          </button>

          <button
            onClick={() => onSelect(Language.HINGLISH)}
            className="flex items-center gap-4 p-6 rounded-3xl border-2 border-gray-100 hover:border-primary hover:bg-primary/5 transition-all text-left group"
          >
            <span className="text-3xl">🅰️</span>
            <div>
              <div className="text-xl font-bold text-text-main group-hover:text-primary">Hinglish</div>
              <div className="text-sm text-text-muted">Mix Hindi & English</div>
            </div>
          </button>

          <button
            onClick={() => onSelect(Language.ENGLISH)}
            className="flex items-center gap-4 p-6 rounded-3xl border-2 border-gray-100 hover:border-primary hover:bg-primary/5 transition-all text-left group"
          >
            <span className="text-3xl">🇬🇧</span>
            <div>
              <div className="text-xl font-bold text-text-main group-hover:text-primary">English</div>
              <div className="text-sm text-text-muted">Standard English</div>
            </div>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Layout Components ---

const Header = ({ lang, setLang, t }: { lang: Language, setLang: (l: Language) => void, t: any }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const langConfig = {
    [Language.HINGLISH]: { name: 'Hinglish', local: 'Mix-हिन्दी', flag: '🅰️' },
    [Language.HINDI]: { name: 'Hindi', local: 'हिन्दी', flag: '🕉️' },
    [Language.ENGLISH]: { name: 'English', local: 'EN', flag: '🇬🇧' }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-10 shrink-0 shadow-sm">
      <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">A</div>
          <span className="text-xl font-bold tracking-tight text-text-main hidden sm:block">Anandam Arogyam</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-text-muted">
          <Link to="/" className="text-primary">Home</Link>
          <Link to="/about" className="hover:text-primary transition-colors">About Us</Link>
          <Link to="/services" className="hover:text-primary transition-colors">Services</Link>
          <Link to="/booking" className="hover:text-primary transition-colors">Booking</Link>
          <Link to="/admin-anandam" className="hover:text-primary flex items-center gap-1">
            <Lock className="w-3 h-3" /> Admin
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-6">
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-3 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl hover:bg-white hover:shadow-md transition-all active:scale-95"
            >
              <span className="text-lg">{langConfig[lang].flag}</span>
              <div className="text-left">
                <div className="text-[10px] font-black uppercase text-gray-400 leading-none mb-0.5 tracking-tighter">Bhasha</div>
                <div className="text-xs font-bold text-text-main leading-none flex items-center gap-1">
                  {langConfig[lang].name}
                  <ChevronDown className={`w-3 h-3 text-primary transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </button>

            <AnimatePresence>
              {isLangOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-2 grid gap-1">
                      {Object.values(Language).map((l) => (
                        <button
                          key={l}
                          onClick={() => { setLang(l); setIsLangOpen(false); }}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${lang === l ? 'bg-primary/5 border-primary/10' : 'hover:bg-gray-50 border-transparent'
                            } border`}
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-sm ${lang === l ? 'bg-white' : 'bg-gray-50'}`}>
                            {langConfig[l].flag}
                          </div>
                          <div className="text-left">
                            <div className={`text-sm font-bold ${lang === l ? 'text-primary' : 'text-text-main'}`}>{l}</div>
                            <div className="text-[10px] font-medium text-gray-400 capitalize">{langConfig[l].local}</div>
                          </div>
                          {lang === l && <CheckCircle2 className="w-4 h-4 text-primary ml-auto" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => window.open('tel:+919761696655')}
            className="bg-primary text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            Call Now
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.open('tel:+919761696655')}
            className="lg:hidden bg-primary text-white px-4 py-2.5 rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2 animate-pulse active:scale-95 transition-transform"
          >
            <Phone className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Call Abhi</span>
          </button>

          <button className="lg:hidden p-2 text-primary bg-bg-base rounded-xl border border-gray-100" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="lg:hidden fixed inset-0 top-20 bg-white z-40 p-6 flex flex-col gap-6"
          >
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-2xl font-display font-bold">Home</Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-2xl font-display font-bold">About Us</Link>
            <Link to="/services" onClick={() => setIsMenuOpen(false)} className="text-2xl font-display font-bold">Treatments</Link>
            <Link to="/booking" onClick={() => setIsMenuOpen(false)} className="text-2xl font-display font-bold">Book Appointment</Link>
            <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-2xl font-display font-bold text-text-muted">Staff Login</Link>

            <div className="mt-auto pt-6 border-t">
              <div className="text-xs font-bold text-text-muted uppercase mb-4 tracking-widest">Select Language</div>
              <div className="grid gap-3">
                {Object.values(Language).map((l) => (
                  <button
                    key={l}
                    onClick={() => { setLang(l); setIsMenuOpen(false); }}
                    className={`flex items-center gap-4 p-4 text-sm rounded-2xl border transition-all ${lang === l ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20' : 'border-gray-100 bg-gray-50'
                      }`}
                  >
                    <span className="text-2xl">{langConfig[l].flag}</span>
                    <div className="text-left">
                      <div className="font-bold">{l}</div>
                      <div className={`text-[10px] font-medium ${lang === l ? 'text-white/70' : 'text-gray-400'}`}>{langConfig[l].local}</div>
                    </div>
                    {lang === l && <CheckCircle2 className="w-5 h-5 ml-auto" />}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const Footer = ({ t }: { t: any }) => (
  <footer className="bg-white border-t border-gray-100 pt-24 pb-12">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">A</div>
            <span className="text-xl font-bold tracking-tight text-text-main">Anandam Arogyam</span>
          </div>
          <p className="text-text-muted text-sm leading-relaxed">
            {t.footerDesc}
          </p>
          <div className="mt-8 pt-8 border-t border-gray-100 flex gap-4">
            <Link to="/privacy" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors">{t.footerPrivacy}</Link>
            <Link to="/terms" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors">{t.footerTerms}</Link>
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-6 text-lg text-text-main">{t.footerContact}</h4>
          <ul className="space-y-4 text-text-muted text-sm">
            <li className="flex items-start gap-3 group">
              <Phone className="w-4 h-4 text-primary group-hover:rotate-12 transition-transform" />
              <a href="tel:+919761696655" className="font-medium hover:text-primary transition-colors">+91 97616 96655</a>
            </li>
            <li className="flex items-start gap-3 group">
              <MessageCircle className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
              <a
                href={getWhatsAppUrl(`Namaste Dr. Priyankar, mujhe jaankari chahiye.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-primary transition-colors"
              >
                WhatsApp: +91 97616 96655
              </a>
            </li>
            <li>
              <Link to="/contact" className="inline-block mt-2 px-6 py-2 bg-primary/5 rounded-full text-primary font-bold hover:bg-primary/10 transition-colors text-xs">
                {t.footerContactPage}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6 text-lg text-text-main">{t.footerLinks}</h4>
          <ul className="space-y-3 text-text-muted text-sm">
            <li><Link to="/about" className="hover:text-primary transition-colors font-medium">{t.footerAbout}</Link></li>
            <li><Link to="/services" className="hover:text-primary transition-colors font-medium">{t.footerServices}</Link></li>
            <li><Link to="/booking" className="hover:text-primary transition-colors font-medium">{t.footerBook}</Link></li>
            <li><Link to="/refund" className="hover:text-primary transition-colors font-medium">{t.footerRefund}</Link></li>
            <li><Link to="/disclaimer" className="hover:text-primary transition-colors font-medium">{t.footerDisclaimer}</Link></li>
            <li><Link to="/admin-anandam" className="hover:text-primary transition-colors font-medium">Clinic Portal (Admin)</Link></li>
          </ul>
        </div>
        <div className="bg-bg-base p-8 rounded-[32px] border border-gray-100">
          <h4 className="font-bold mb-4 text-lg text-text-main">{t.footerVisit}</h4>
          <Link to="/booking" className="w-full btn-primary block text-center py-3">{t.ctaBook}</Link>
        </div>
      </div>
      <div className="pt-12 border-t border-gray-100 text-center text-gray-400 text-xs font-medium">
        <p>© 2026 Anandam Arogyam by Dr. Priyankar. All Rights Reserved. <span className="text-primary font-bold">Pure Ayurveda.</span></p>
      </div>
    </div>
  </footer>
);

// --- Pages ---

const SpecialTreatments = ({ t }: { t: any }) => {
  const treatments = [
    {
      id: 'gastrointestinal',
      title: t.specGastroTitle,
      highlights: t.specGastroHindi,
      icon: <Activity className="w-8 h-8" />,
      color: "from-emerald-500/10 to-teal-500/10",
      iconColor: "text-emerald-500",
      accent: "bg-emerald-500"
    },
    {
      id: 'skin-disorders',
      title: t.specSkinTitle,
      highlights: t.specSkinHindi,
      icon: <Hand className="w-8 h-8" />,
      color: "from-orange-500/10 to-amber-500/10",
      iconColor: "text-orange-500",
      accent: "bg-orange-500"
    },
    {
      id: 'neuro-muscular',
      title: t.specNeuroTitle,
      highlights: t.specNeuroHindi,
      icon: <Brain className="w-8 h-8" />,
      color: "from-blue-500/10 to-indigo-500/10",
      iconColor: "text-blue-500",
      accent: "bg-blue-500"
    },
    {
      id: 'female-disease',
      title: t.specFemaleTitle,
      highlights: t.specFemaleHindi,
      icon: <Users className="w-8 h-8" />,
      color: "from-pink-500/10 to-rose-500/10",
      iconColor: "text-pink-500",
      accent: "bg-pink-500"
    },
    {
      id: 'male-disease',
      title: t.specMaleTitle,
      highlights: t.specMaleHindi,
      icon: <Users className="w-8 h-8" />,
      color: "from-cyan-500/10 to-blue-500/10",
      iconColor: "text-cyan-500",
      accent: "bg-cyan-500"
    },
    {
      id: 'panchkarma',
      title: t.specPanchTitle,
      highlights: t.specPanchHindi,
      icon: <Leaf className="w-8 h-8" />,
      color: "from-green-500/10 to-emerald-500/10",
      iconColor: "text-green-500",
      accent: "bg-green-500"
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-bg-base -skew-x-12 translate-x-1/2 opacity-50" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-block mb-4 border border-primary/20">
            {t.specTreatTag}
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-text-main tracking-tight mb-6">
            {t.specTreatTitle}
          </h2>
          <p className="text-text-muted font-medium text-lg max-w-2xl mx-auto">
            {t.specTreatSub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {treatments.map((tr, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative bg-white border border-gray-100 rounded-[48px] p-10 hover:shadow-2xl-premium transition-all duration-500 flex flex-col h-full hover:ring-1 ring-primary/5"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${tr.color} rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-700`} />

              <div className={`w-16 h-16 ${tr.iconColor} mb-8 bg-white shadow-lg rounded-[24px] flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-gray-50`}>
                {tr.icon}
              </div>

              <div className="flex-grow">
                <h3 className="text-3xl font-black text-text-main mb-4 group-hover:text-primary transition-colors leading-tight">
                  {tr.title}
                </h3>
                <div className="flex gap-2 flex-wrap mb-6">
                  {/* Visual dots */}
                  <div className={`w-3 h-3 rounded-full ${tr.accent} opacity-20`} />
                  <div className={`w-3 h-3 rounded-full ${tr.accent} opacity-10`} />
                </div>
                <p className="text-text-muted font-medium leading-relaxed text-sm">
                  {tr.highlights}
                </p>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-50 flex items-center justify-between">
                <Link to={`/services/${tr.id}`} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:gap-3 transition-all">
                  {t.specLearnMore}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className={`w-10 h-10 rounded-full ${tr.accent} opacity-5 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white`}>
                  <Info className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HomePage = ({ t }: { t: any }) => {
  const [checkerStep, setCheckerStep] = useState(0);
  const [checkerResult, setCheckerResult] = useState<string | null>(null);

  const symptomCheck = (option: string) => {
    if (checkerStep < 2) {
      setCheckerStep(prev => prev + 1);
    } else {
      setCheckerResult("Based on your symptoms, we recommend our 'Panchakarma Detox' plan combined with dietary adjustments. Dr. Priyankar can provide a detailed 1-on-1 analysis.");
    }
  };

  return (
    <div className="bg-bg-base min-h-screen">
      <SEO
        title="Home"
        description="Dr. Priyankar is the best Ayurvedic doctor in Moradabad. Specializing in Nadi Pariksha, Panchkarma, and treatment for chronic diseases. Natural healing for a better life."
        keywords={["Ayurvedic Doctor Moradabad", "Dr. Priyankar Ayurveda", "Nadi Pariksha specialist", "Panchkarma center Moradabad"]}
      />
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-12 lg:col-span-7 flex flex-col space-y-8"
          >
            <div className="space-y-4">
              <span className="bg-accent text-primary px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase inline-block">
                {t.heroTag}
              </span>
              <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight text-text-main">
                {t.heroTitleLine1} <span className="text-primary">{t.heroTitleLine2}</span>
              </h1>
              <p className="text-xl text-text-muted leading-relaxed max-w-lg">
                <span className="font-semibold text-text-main">{t.heroSubTagline}</span> {t.heroSub}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/booking" className="btn-secondary flex items-center justify-center gap-3">
                {t.ctaConsultation}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button
                onClick={() => window.open(getWhatsAppUrl(t.waPreFill), '_blank')}
                className="btn-outline flex items-center justify-center gap-3"
              >
                <MessageCircle className="w-5 h-5" />
                {t.ctaChat}
              </button>
            </div>

            <div className="pb-4" />
          </motion.div>

          {/* Right Column: Doctor Profile */}
          <div className="col-span-12 lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "circOut" }}
              className="relative group"
            >
              <div className="relative aspect-[4/5] rounded-[48px] overflow-hidden shadow-2xl-premium border-8 border-white bg-accent/10">
                <img
                  src={dr}
                  alt="Dr. Priyankar"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />

                {/* Floating Experience Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute top-8 right-8 bg-white/95 backdrop-blur-md p-5 rounded-[32px] shadow-2xl border border-white/50 text-center min-w-[120px] ring-1 ring-primary/5"
                >
                  <div className="text-4xl font-black text-primary leading-none tracking-tighter">20+</div>
                  <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-1">Years Exp.</div>
                </motion.div>

                {/* Rating Badge */}
                <div className="absolute top-8 left-8 bg-black/20 backdrop-blur-lg px-4 py-2 rounded-2xl border border-white/20 flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    <Heart className="w-3 h-3 fill-current" />
                  </div>
                  <span className="text-white text-[10px] font-bold">Top Rated Expert</span>
                </div>
              </div>

              {/* Name & Credentials Card */}
              <div className="absolute -bottom-6 -left-6 -right-6 lg:-right-12 bg-white p-10 rounded-[40px] shadow-2xl-premium border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-4xl font-black text-text-main tracking-tight mb-1">Dr. Priyankar</h3>
                    <p className="text-primary font-extrabold text-[10px] uppercase tracking-widest bg-primary/5 inline-block px-3 py-1 rounded-full border border-primary/10">
                      B.A.M.S, MD (Ayurveda)
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-primary">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-text-muted text-sm leading-relaxed font-medium">
                  {t.aboutShortDesc} <span className="text-primary">{t.aboutHighlight}</span>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-24 bg-bg-base relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--color-primary)_0%,_transparent_70%)] opacity-[0.03]" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
            <div className="max-w-2xl">
              <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-block mb-4 border border-primary/20">
                {t.locTag}
              </span>
              <h2 className="text-5xl md:text-7xl font-black text-text-main tracking-tight leading-none">
                {t.locTitle}
              </h2>
            </div>
            <p className="text-text-muted font-medium text-lg leading-relaxed max-w-sm">
              {t.locSub}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Location: Sonakpur (Was Loc 2, now first) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[64px] border border-gray-100 shadow-xl-premium overflow-hidden group hover:ring-2 ring-primary/10 transition-all duration-700"
            >
              <div className="p-12 pb-6">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 bg-accent/30 text-primary rounded-[32px] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <MapPin className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-text-main group-hover:text-primary transition-colors leading-tight">
                      {t.loc2Name}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Active Hub</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Address</p>
                    <p className="text-text-main font-bold leading-relaxed">{t.loc2Addr}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Timings</p>
                    <p className="text-primary font-black flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {t.loc2Time}
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Embed Sonakpur */}
              <div className="px-12 mb-10">
                <div className="w-full h-72 rounded-[40px] overflow-hidden border border-gray-100 shadow-inner group-hover/map:brightness-105 transition-all relative">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    title="Sonakpur Branch Map"
                    className="grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000"
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2802.1660132286734!2d78.73210370316288!3d28.84942032473286!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390afd53251e225b%3A0x30105565d6252b68!2z8J2QlfCdkJrwnZCi8J2QnfCdkLLwnZCaIPCdkI_wnZCr8J2QovCdkLLwnZCa8J2Qp_CdkKTwnZCa8J2QqyDwnZCa8J2QpPCdkJog8J2Qg_CdkKsuIPCdkI_wnZCr8J2QovCdkLLwnZCa8J2Qp_CdkKTwnZCa8J2QqyAo8J2QgPCdkKfwnZCa8J2Qp_CdkJ3wnZCa8J2QpiDwnZCA8J2Qq_CdkKjwnZCg8J2QsvCdkJrwnZCmKQ!5e0!3m2!1sen!2sin!4v1734858598531!5m2!1sen!2sin`}
                  />
                  <div className="absolute inset-0 pointer-events-none border-t border-white/20" />
                </div>
              </div>

              <div className="px-12 pb-12 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => window.open('https://share.google/ffx3hFWGsFj7RrnaN', '_blank')}
                  className="flex-1 bg-bg-base text-text-main py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2 border border-gray-100 shadow-sm"
                >
                  {t.locDirection}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  to="/booking"
                  className="flex-1 bg-primary text-white py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] hover:shadow-2xl hover:shadow-primary/40 transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  {t.ctaBook}
                </Link>
              </div>
            </motion.div>

            {/* Location: Majhola (Was Loc 1, now second) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[64px] border border-gray-100 shadow-xl-premium overflow-hidden group hover:ring-2 ring-primary/10 transition-all duration-700"
            >
              <div className="p-12 pb-6">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 bg-primary/5 text-primary rounded-[32px] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <MapPin className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-text-main group-hover:text-primary transition-colors leading-tight">
                      {t.loc1Name}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Clinical Care</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Address</p>
                    <p className="text-text-main font-bold leading-relaxed">{t.loc1Addr}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Timings</p>
                    <p className="text-primary font-black flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {t.loc1Time}
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Embed Majhola */}
              <div className="px-12 mb-10">
                <div className="w-full h-72 rounded-[40px] overflow-hidden border border-gray-100 shadow-inner group-hover/map:brightness-105 transition-all relative">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    title="Majhola Branch Map"
                    className="grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000"
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8313.179901818874!2d78.75267829300856!3d28.831070987892822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390afbf5c38d2525%3A0xcb8a6da0be215e35!2sAnandam%20Arogyam%20(Dr.Priyankar-Best%20Ayurveda%20%26%20Panchkarma%20Doctor%20for%20Gestro-liver%2C%20Sexual%20problems)!5e0!3m2!1sen!2sin!4v1733313239634!5m2!1sen!2sin`}
                  />
                  <div className="absolute inset-0 pointer-events-none border-t border-white/20" />
                </div>
              </div>

              <div className="px-12 pb-12 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => window.open('https://share.google/NfHZx673blVHQ5tjo', '_blank')}
                  className="flex-1 bg-bg-base text-text-main py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2 border border-gray-100 shadow-sm"
                >
                  {t.locDirection}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  to="/booking"
                  className="flex-1 bg-primary text-white py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] hover:shadow-2xl hover:shadow-primary/40 transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  {t.ctaBook}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <SpecialTreatments t={t} />

      {/* Comprehensive Services Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div className="max-w-2xl">
              <span className="bg-accent text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-block mb-4">
                {t.servicesTag}
              </span>
              <h2 className="text-5xl md:text-6xl font-extrabold text-text-main tracking-tight leading-[1.1]">
                {t.servicesTitle1} <span className="text-primary">{t.servicesTitle2}</span>
              </h2>
            </div>
            <Link to="/services" className="group flex items-center gap-3 text-primary font-bold text-sm hover:underline underline-offset-4">
              {t.servicesExplore}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Panchakarma Detox",
                desc: "Deep internal cleansing and rejuvenation using five sacred purification actions.",
                icon: <Droplet className="w-6 h-6" />,
                color: "bg-blue-50 text-blue-600"
              },
              {
                title: "Joint & Bone Care",
                desc: "Specialized oils and therapies for arthritis, back pain, and musculoskeletal disorders.",
                icon: <Activity className="w-6 h-6" />,
                color: "bg-orange-50 text-orange-600"
              },
              {
                title: "Stress & Anxiety",
                desc: "Manas Chikitsa focusing on mental clarity, deep sleep, and emotional balance.",
                icon: <Zap className="w-6 h-6" />,
                color: "bg-yellow-50 text-yellow-600"
              },
              {
                title: "Digestive Wellness",
                desc: "Fixing the root cause 'Agni' to eliminate bloating, acidity, and chronic gut issues.",
                icon: <Activity className="w-6 h-6" />,
                color: "bg-emerald-50 text-emerald-600"
              },
              {
                title: "Skin & Hair Therapy",
                desc: "Natural blood purification and herbal masks for lasting glow and hair strength.",
                icon: <Heart className="w-6 h-6" />,
                color: "bg-pink-50 text-pink-600"
              },
              {
                title: "Lifestyle Consultation",
                desc: "Customized Dinacharya (daily routine) based on your unique Prakriti (body type).",
                icon: <Users className="w-6 h-6" />,
                color: "bg-purple-50 text-purple-600"
              }
            ].map((s, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="group p-10 bg-white border border-gray-100 rounded-[40px] shadow-sm hover:shadow-xl-premium transition-all duration-500 flex flex-col items-start gap-6 cursor-pointer"
              >
                <div className={`w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                  {s.icon}
                </div>
                <div className="space-y-3">
                  <h4 className="text-2xl font-bold text-text-main group-hover:text-primary transition-colors">{s.title}</h4>
                  <p className="text-text-muted text-sm leading-relaxed font-medium">
                    {s.desc}
                  </p>
                </div>
                <div className="mt-4 pt-6 border-t border-gray-50 w-full flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Learn More</span>
                  <div className="w-8 h-8 rounded-full bg-bg-base flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Symptom Checker */}
      <section className="py-24 bg-white border-y border-gray-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {!checkerResult && (
            <div className="mb-12">
              <span className="bg-accent text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-block mb-4">
                {t.sCheckTag}
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-text-main tracking-tight">{t.sCheckTitle}</h2>
            </div>
          )}

          <motion.div layout className="bg-bg-base rounded-[40px] shadow-premium overflow-hidden border border-gray-100">
            {/* Progress Bar */}
            {!checkerResult && (
              <div className="h-1.5 w-full bg-gray-200 flex">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${((checkerStep + 1) / 3) * 100}%` }}
                  transition={{ duration: 0.5, ease: "circOut" }}
                />
              </div>
            )}

            <div className="p-8 md:p-16">
              <AnimatePresence mode="wait">
                {!checkerResult ? (
                  <motion.div
                    key={checkerStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
                  >
                    <div className="space-y-6">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-100 shadow-sm">
                        <Activity className="w-3.5 h-3.5" /> Step {checkerStep + 1} of 3
                      </div>
                      <h2 className="text-4xl md:text-5xl font-extrabold text-text-main leading-tight tracking-tight">
                        {checkerStep === 0 ? t.checkerQ1 : checkerStep === 1 ? t.checkerQ2 : t.checkerQ3}
                      </h2>
                      <p className="text-text-muted font-medium text-lg max-w-md">
                        {checkerStep === 0 ? t.checkerSub1 : checkerStep === 1 ? t.checkerSub2 : t.checkerSub3}
                      </p>
                    </div>

                    <div className="grid gap-4">
                      {checkerStep === 0 ? [
                        { label: "Pachan mein dikkat", sub: "Gas, acidity or bloating", icon: "🧪" },
                        { label: "Jodon mein dard", sub: "Joint or back stiffness", icon: "🦴" },
                        { label: "Skin/Baal ki samasya", sub: "Acne or hair fall", icon: "🌿" },
                        { label: "Neend or Tanaav", sub: "Stress & insomnia", icon: "🧘" }
                      ].map(o => (
                        <button
                          key={o.label}
                          onClick={() => symptomCheck(o.label)}
                          className="group flex items-center justify-between p-6 bg-white border border-gray-100 rounded-[28px] hover:border-primary hover:shadow-xl-premium transition-all text-left shadow-sm active:scale-[0.98]"
                        >
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-bg-base rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 group-hover:bg-primary/5 transition-all">
                              {o.icon}
                            </div>
                            <div>
                              <div className="font-bold text-lg text-text-main group-hover:text-primary transition-colors">{o.label}</div>
                              <div className="text-[10px] uppercase font-black text-gray-400 tracking-widest mt-0.5">{o.sub}</div>
                            </div>
                          </div>
                          <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </button>
                      )) : checkerStep === 1 ? [
                        { label: "Bas abhi shuru hua", sub: "Recent (Few days)", icon: "🌱" },
                        { label: "Kuch hafto se", sub: "Sub-acute (Weeks)", icon: "⏳" },
                        { label: "Mahino se chal raha hai", sub: "Chronic (Months)", icon: "🏛️" },
                        { label: "Bhout purana hai", sub: "Long-term (Years)", icon: "🌳" }
                      ].map(o => (
                        <button
                          key={o.label}
                          onClick={() => symptomCheck(o.label)}
                          className="group flex items-center justify-between p-6 bg-white border border-gray-100 rounded-[28px] hover:border-primary hover:shadow-xl-premium transition-all text-left shadow-sm active:scale-[0.98]"
                        >
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-bg-base rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-all">
                              {o.icon}
                            </div>
                            <div>
                              <div className="font-bold text-lg text-text-main group-hover:text-primary transition-colors">{o.label}</div>
                              <div className="text-[10px] uppercase font-black text-gray-400 tracking-widest mt-0.5">{o.sub}</div>
                            </div>
                          </div>
                          <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </button>
                      )) : [
                        { label: "Bhout thakan rehti hai", sub: "Low energy levels", icon: "🔋" },
                        { label: "Theek-thaak active hoon", sub: "Moderate activity", icon: "🏃" },
                        { label: "Sedentary (Baithe rehna)", sub: "Mostly sitting", icon: "🪑" },
                        { label: "High stress lifestyle", sub: "Constant pressure", icon: "⚡" }
                      ].map(o => (
                        <button
                          key={o.label}
                          onClick={() => symptomCheck(o.label)}
                          className="group flex items-center justify-between p-6 bg-white border border-gray-100 rounded-[28px] hover:border-primary hover:shadow-xl-premium transition-all text-left shadow-sm active:scale-[0.98]"
                        >
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-bg-base rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-all">
                              {o.icon}
                            </div>
                            <div>
                              <div className="font-bold text-lg text-text-main group-hover:text-primary transition-colors">{o.label}</div>
                              <div className="text-[10px] uppercase font-black text-gray-400 tracking-widest mt-0.5">{o.sub}</div>
                            </div>
                          </div>
                          <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                    <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-primary/5">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h3 className="text-4xl md:text-5xl font-extrabold mb-4 text-text-main tracking-tight">{t.checkerResultTitle}</h3>
                    <p className="text-xl text-text-muted mb-12 leading-relaxed max-w-2xl mx-auto font-medium">{t.checkerResultTitle === "Report Taiyaar Hai!" ? "Based on your symptoms, we recommend our 'Panchakarma Detox' plan combined with dietary adjustments. Dr. Priyankar can provide a detailed 1-on-1 analysis." : "Recommendations are ready for you."}</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                      <Link to="/booking" className="btn-primary px-12 py-5 shadow-2xl shadow-primary/40">{t.checkerBtnBook}</Link>
                      <button onClick={() => { setCheckerStep(0); setCheckerResult(null); }} className="btn-outline px-12 py-5 border-gray-200 text-text-main hover:bg-gray-50">{t.checkerBtnBack}</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
const AboutPage = ({ t }: { t: any }) => (
  <div className="pt-32 bg-bg-base">
    <SEO
      title="About Us - Anandam Arogyam"
      description="Learn about Anandam Arogyam and Dr. Priyankar, leading Ayurvedic specialists in Moradabad with over 20 years of experience."
      keywords={["About Dr. Priyankar", "Anandam Arogyam philosophy", "Ayurvedic specialist Moradabad"]}
    />

    {/* Hero Section */}
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="aspect-square rounded-[48px] overflow-hidden shadow-2xl-premium border-8 border-white bg-accent/20">
              <img src={dr} alt="Doctor Consultation" className=" object-cover" />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 p-8 bg-white rounded-[32px] shadow-2xl border border-gray-100 hidden md:block">
              <p className="text-primary font-black text-4xl mb-1">20+</p>
              <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Saalon ka Anubhav</p>
            </div>
          </div>
          <div className="space-y-8">
            <div>
              <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-block mb-4 border border-primary/20">
                Hamari Kahani (Our Story)
              </span>
              <h2 className="text-5xl md:text-7xl font-black mb-6 text-text-main leading-tight">Shuddh Ayurveda. <span className="text-primary">Sacchi Healing.</span></h2>
              <p className="text-lg text-text-muted leading-relaxed font-medium">
                {t.aboutDesc || "Anandam Arogyam ki shuruat ek mission ke saath hui thi—har vyakti tak Ayurveda ki shakti pahunchana. Dr. Priyankar ke neetritva mein, humne lifestyle se judi bimarion aur chronic ailments ka jad se ilaj karne mein maharat haasil ki hai."}
              </p>
              <div className="grid grid-cols-2 gap-6 mt-10">
                <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <h4 className="font-black text-primary text-xl mb-2">10,000+</h4>
                  <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Satisfied Patients</p>
                </div>
                <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <h4 className="font-black text-primary text-xl mb-2">2 Clinics</h4>
                  <p className="text-xs font-bold text-text-muted uppercase tracking-widest">In Moradabad</p>
                </div>
              </div>
            </div>
            <Link to="/booking" className="btn-primary inline-flex items-center gap-3">{t.aboutCta || "Appointmnet Book Karein"} <ArrowRight className="w-5 h-5" /></Link>
          </div>
        </div>
      </div>
    </section>

    {/* Philosophy section */}
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h3 className="text-4xl md:text-5xl font-black text-text-main mb-4">Hamara Philosophy</h3>
          <p className="text-text-muted font-medium text-lg max-w-2xl mx-auto">Hum sirf bimaari ka ilaj nahi karte, balki sharir or mann ke santulan ko vapas late hain.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { title: "Nadi Pariksha", desc: "Sharir ki nadiyo se bimaari ke mool karan (Root Cause) tak pahunchna.", icon: "🩺" },
            { title: "Prakriti Analysis", desc: "Aapke vata, pitta, or kapha dosha ke mutabik customized ilaj.", icon: "⚖️" },
            { title: "Panchakarma", desc: "Sharir ki geheri safai (Deep Detox) ki clinical vidhiyaan.", icon: "🌿" }
          ].map((item, idx) => (
            <div key={idx} className="p-10 bg-bg-base rounded-[40px] border border-gray-100 hover:shadow-xl transition-all group">
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">{item.icon}</div>
              <h4 className="text-2xl font-black text-text-main mb-4">{item.title}</h4>
              <p className="text-text-muted font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Locations Section (Re-used for consistency) */}
    <section className="py-24 bg-bg-base relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20 text-center md:text-left">
          <div className="max-w-2xl">
            <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-block mb-4 border border-primary/20">
              Where to find us?
            </span>

            <h2 className="text-5xl md:text-7xl font-black text-text-main tracking-tight leading-none">
              Our Clinics
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ================= SONAKPUR ================= */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[64px] border border-gray-100 shadow-xl-premium overflow-hidden group hover:ring-2 ring-primary/10 transition-all duration-700"
          >
            {/* Map */}
            <div className="h-[260px] overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2802.1660132286734!2d78.73210370316288!3d28.84942032473286!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390afd53251e225b%3A0x30105565d6252b68!2z8J2QlfCdkJrwnZCi8J2QnfCdkLLwnZCaIPCdkI_wnZCr8J2QovCdkLLwnZCa8J2Qp_CdkKTwnZCa8J2QqyDwnZCa8J2QpPCdkJog8J2Qg_CdkKsuIPCdkI_wnZCr8J2QovCdkLLwnZCa8J2Qp_CdkKTwnZCa8J2QqyAo8J2QgPCdkKfwnZCa8J2Qp_CdkJ3wnZCa8J2QpiDwnZCA8J2Qq_CdkKjwnZCg8J2QsvCdkJrwnZCmKQ!5e0!3m2!1sen!2sin!4v1734858598531!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div className="p-12 pb-6">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 bg-accent/30 text-primary rounded-[32px] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <MapPin className="w-10 h-10" />
                </div>

                <div>
                  <h3 className="text-3xl font-black text-text-main group-hover:text-primary transition-colors leading-tight">
                    Sonakpur Branch
                  </h3>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <p className="text-text-main font-bold leading-relaxed">
                  Sonakpur bypass road (between Shri Ram chauk & Chetiya farm house), Moradabad, U.P. 244001
                </p>

                <div className="text-primary font-black flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Sunday: 10:00 AM - 2:00 PM
                </div>
              </div>
            </div>

            <div className="px-12 pb-12">
              <button
                onClick={() =>
                  window.open(
                    "https://share.google/rr9fSaO6NeXXbxMWI",
                    "_blank"
                  )
                }
                className="w-full bg-bg-base text-text-main py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2 border border-gray-100 shadow-sm"
              >
                Rasta Dekhe
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* ================= MAJHOLA ================= */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[64px] border border-gray-100 shadow-xl-premium overflow-hidden group hover:ring-2 ring-primary/10 transition-all duration-700"
          >
            {/* Map */}
            <div className="h-[260px] overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8313.179901818874!2d78.75267829300856!3d28.831070987892822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390afbf5c38d2525%3A0xcb8a6da0be215e35!2sAnandam%20Arogyam%20(Dr.Priyankar-Best%20Ayurveda%20%26%20Panchkarma%20Doctor%20for%20Gestro-liver%2C%20Sexual%20problems)!5e0!3m2!1sen!2sin!4v1733313239634!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div className="p-12 pb-6">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 bg-primary/5 text-primary rounded-[32px] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <MapPin className="w-10 h-10" />
                </div>

                <div>
                  <h3 className="text-3xl font-black text-text-main group-hover:text-primary transition-colors leading-tight">
                    Majhola Branch
                  </h3>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <p className="text-text-main font-bold leading-relaxed">
                  Putlighar Road Nikat Missionaries of Charity Linepar Majhola,
                  Moradabad, U.P. - 244001
                </p>

                <div className="text-primary font-black flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Mon-Sat: 10:30 AM - 2:00 PM & 5:00 PM - 7:00 PM
                </div>
              </div>
            </div>

            <div className="px-12 pb-12">
              <button
                onClick={() =>
                  window.open(
                    "https://share.google/mLAiG7BUmTiBxuxdw",
                    "_blank"
                  )
                }
                className="w-full bg-bg-base text-text-main py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2 border border-gray-100 shadow-sm"
              >
                Rasta Dekhe
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  </div>
);

const ServiceDetailPage = ({ t }: { t: any }) => {
  const { slug } = useParams<{ slug: string }>();
  const treatments = getTreatments(t);
  const service = treatments.find(s => s.slug === slug);

  if (!service) return <div className="pt-40 text-center">Service not found.</div>;

  return (
    <div className="pt-32 pb-20 bg-bg-base min-h-screen">
      <SEO
        title={service.fullTitle}
        description={service.description}
        keywords={service.keywords}
      />
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[60px] p-8 md:p-16 shadow-2xl border border-gray-100 overflow-hidden relative"
        >
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl -z-10" />

          <div className="flex flex-wrap items-center gap-4 mb-12">
            <span className="bg-primary/10 text-primary px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
              Expert Clinical Ayurveda
            </span>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-100">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Available in Moradabad</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-7xl font-black text-text-main mb-10 leading-[1.1] tracking-tight">
            {service.fullTitle}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-16">

              <section>
                <h2 className="text-3xl font-black text-text-main mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                    <Info className="w-6 h-6" />
                  </div>
                  Yeh Bimari Kya Hai? (What is it?)
                </h2>
                <div className="prose prose-lg max-w-none text-text-muted font-medium leading-relaxed">
                  {service.content.whatIsIt}
                </div>
              </section>

              <section>
                <h2 className="text-3xl font-black text-text-main mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center">
                    <Activity className="w-6 h-6" />
                  </div>
                  Kaise Hoti Hai? (Causes & Symptoms)
                </h2>
                <div className="prose prose-lg max-w-none text-text-muted font-medium leading-relaxed">
                  {service.content.howItHappens}
                </div>
              </section>

              <section className="bg-bg-base/50 p-10 rounded-[48px] border border-gray-100">
                <h2 className="text-3xl font-black text-text-main mb-8 flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  Ayurvedic Ilaj Aur Labh (Treatment & Benefits)
                </h2>
                <div className="space-y-10">
                  <div>
                    <h4 className="font-black text-primary uppercase text-xs tracking-widest mb-3">Hamara Approach</h4>
                    <p className="text-text-muted font-medium italic text-lg leading-relaxed">{service.content.whatToDo}</p>
                  </div>
                  <div>
                    <h4 className="font-black text-primary uppercase text-xs tracking-widest mb-3">Ilaj Ke Faayde</h4>
                    <p className="text-text-muted font-medium text-lg leading-relaxed">{service.content.benefits}</p>
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-black text-text-main mb-4 flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-primary" /> Lifestyle Advice
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed font-medium">{service.content.lifestyle}</p>
                </div>
                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-black text-text-main mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-orange-500" /> Dietary Pathya
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed font-medium">{service.content.diet}</p>
                </div>
              </section>

              <section>
                <h2 className="text-3xl font-black text-text-main mb-6">Home Remedies (Gharelu Nuskhe)</h2>
                <p className="text-text-muted text-lg leading-relaxed font-medium bg-primary/5 p-8 rounded-[40px] border-l-8 border-primary">
                  {service.content.homeRemedies}
                </p>
              </section>

              {service.content.faq && (
                <section>
                  <h2 className="text-3xl font-black text-text-main mb-8">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    {service.content.faq.map((f, i) => (
                      <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100">
                        <h4 className="font-bold text-text-main mb-2">Q: {f.q}</h4>
                        <p className="text-sm text-text-muted font-medium">A: {f.a}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <h3 className="text-2xl font-black text-text-main mb-6">Regional SEO & Local Connection</h3>
                <p className="text-sm text-text-muted leading-relaxed italic bg-gray-50 p-8 rounded-3xl border border-gray-100">
                  {service.content.localSEO}
                </p>
              </section>
            </div>

            {/* Sidebar CTAs */}
            <div className="space-y-6">
              <div className="sticky top-40 space-y-6">
                <div className="bg-white p-10 rounded-[48px] border-2 border-primary/20 shadow-xl shadow-primary/5">
                  <h3 className="text-2xl font-black text-text-main mb-8 leading-tight">Connect with Dr. Priyankar</h3>
                  <div className="space-y-5">
                    <button
                      onClick={() => window.open('tel:+919761696655')}
                      className="w-full bg-primary text-white py-6 rounded-3xl font-black text-[12px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/40 transition-all flex items-center justify-center gap-3 group border-b-4 border-primary-dark"
                    >
                      <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      अभी कॉल करें (Call)
                    </button>
                    <button
                      onClick={() => window.open(getWhatsAppUrl(`Namaste Dr. Priyankar, mujhe ${service.title} ke baare mein jaankari chahiye.`), '_blank')}
                      className="w-full bg-[#25D366] text-white py-6 rounded-3xl font-black text-[12px] uppercase tracking-[0.2em] shadow-xl shadow-green-500/20 hover:bg-[#20ba5a] transition-all flex items-center justify-center gap-3 group border-b-4 border-green-700"
                    >
                      <MessageCircle className="w-5 h-5 group-hover:scale-125 transition-transform" />
                      WhatsApp पर बात करें
                    </button>
                    <Link
                      to="/booking"
                      className="w-full bg-black text-white py-6 rounded-3xl font-black text-[12px] uppercase tracking-[0.2em] hover:bg-gray-900 transition-all flex items-center justify-center gap-3 border-b-4 border-gray-800"
                    >
                      <Calendar className="w-5 h-5" />
                      Book Appointment
                    </Link>
                  </div>

                  <div className="mt-10 pt-10 border-t border-gray-100">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-6">Patient Keywords</p>
                    <div className="flex flex-wrap gap-2">
                      {service.keywords.map((k, i) => (
                        <span key={i} className="text-[9px] font-bold bg-bg-base px-3 py-2 rounded-full text-text-muted border border-gray-100">#{k.replace(/\s+/g, '')}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-accent/40 p-8 rounded-[48px] border border-accent/20">
                  <div className="flex items-center gap-4 mb-4 text-primary">
                    <Stethoscope className="w-8 h-8" />
                    <h4 className="font-black text-xl leading-tight">Clinical Standards</h4>
                  </div>
                  <p className="text-xs font-medium text-text-muted leading-relaxed">
                    Hamare yahan research-based herbs aur proper Panchkarma hospital facility uplabdh hai in the heart of Moradabad. Total care for Rampur, Amroha, and Sambhal patients.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const ServicesPage = ({ t }: { t: any }) => {
  const treatmentsList = [
    { slug: 'gastrointestinal', title: t.specGastroTitle || "Gastrointestinal", icon: <Activity />, color: "bg-emerald-50" },
    { slug: 'skin-disorders', title: t.specSkinTitle || "Skin Disorders", icon: <Hand />, color: "bg-orange-50" },
    { slug: 'neuro-muscular', title: t.specNeuroTitle || "Neuro-Muscular", icon: <Brain />, color: "bg-blue-50" },
    { slug: 'female-disease', title: t.specFemaleTitle || "Female Health", icon: <Users />, color: "bg-pink-50" },
    { slug: 'male-disease', title: t.specMaleTitle || "Male Health", icon: <Users />, color: "bg-cyan-50" },
    { slug: 'panchkarma', title: t.specPanchTitle || "Panchkarma", icon: <Leaf />, color: "bg-green-50" },
    { slug: 'respiratory-care', title: "Respiratory Care", icon: <Wind />, color: "bg-sky-50" },
    { slug: 'weight-management', title: "Weight Management", icon: <Scale />, color: "bg-rose-50" },
    { slug: 'diabetes-care', title: "Diabetes Care", icon: <Activity />, color: "bg-indigo-50" },
    { slug: 'stress-anxiety', title: "Stress & Anxiety", icon: <Headphones />, color: "bg-violet-50" },
    { slug: 'hair-scalp-care', title: "Hair & Scalp", icon: <Sparkles />, color: "bg-yellow-50" },
    { slug: 'eye-care', title: "Eye Care", icon: <Eye />, color: "bg-cyan-50" },
    { slug: 'pediatric-care', title: "Pediatric Care", icon: <Baby />, color: "bg-orange-50" },
    { slug: 'post-pregnancy-care', title: "Post Natal Care", icon: <Users />, color: "bg-pink-50" },
    { slug: 'addiction-recovery', title: "Addiction Recovery", icon: <RefreshCw />, color: "bg-slate-50" },
    { slug: 'cardiovascular-health', title: "Heart Health", icon: <HeartPulse />, color: "bg-red-50" },
    { slug: 'general-consultation', title: "General Consultation", icon: <Activity />, color: "bg-amber-50" },
    { slug: 'yoga-meditation', title: "Yoga & Meditation", icon: <Brain />, color: "bg-purple-50" },
    { slug: 'geriatric-care', title: "Geriatric Care", icon: <Heart />, color: "bg-red-50" },
    { slug: 'urinary-disorders', title: "Urinary Care", icon: <Droplet />, color: "bg-blue-50" }
  ];

  return (
    <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto bg-bg-base min-h-screen">
      <SEO
        title="Our Ayurvedic Services"
        description="Comprehensive Ayurvedic treatments in Moradabad: Skin, Gastro, Joint Pain, Male/Female health, and more. Authentic care for modern ailments."
        keywords={["Ayurvedic treatments", "ayurvedic services Moradabad", "joint pain support", "skin disorder ayurveda"]}
      />
      <div className="max-w-4xl mb-24">
        <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase inline-block mb-6 border border-primary/20">
          Scientific Ayurvedic Excellence
        </span>
        <h1 className="text-6xl md:text-8xl font-black mb-8 text-text-main tracking-tighter leading-none">
          Root Cause <span className="text-primary">Healing.</span>
        </h1>
        <p className="text-xl text-text-muted leading-relaxed font-medium max-w-2xl">
          Dr. Priyankar combines ancient wisdom with modern diagnostic standards to treat patients across <span className="text-primary italic">Moradabad, Rampur, and Amroha</span>. Select a specialty to learn more.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {treatmentsList.map((tr, idx) => (
          <motion.div
            key={tr.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className={`group relative bg-white border border-gray-100 rounded-[56px] p-12 hover:shadow-2xl-premium transition-all duration-700 flex flex-col h-full`}
          >
            <div className={`w-20 h-20 rounded-[32px] ${tr.color} flex items-center justify-center text-primary mb-10 group-hover:scale-110 transition-transform duration-500`}>
              {cloneElement(tr.icon as any, { size: 36 })}
            </div>

            <h3 className="text-3xl font-black text-text-main mb-6 leading-tight group-hover:text-primary transition-colors">
              {tr.title}
            </h3>

            <p className="text-text-muted font-medium mb-10 text-sm leading-relaxed">
              Localized, specialized care for patients in Moradabad seeking permanent relief through clinical Ayurveda.
            </p>

            <Link
              to={`/services/${tr.slug}`}
              className="mt-auto w-full py-5 bg-bg-base rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] text-text-main hover:bg-black hover:text-white transition-all text-center flex items-center justify-center gap-3 border border-gray-100"
            >
              Learn More
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const CLINICS = [
  {
    id: 'clinic2' as const,
    name: 'Majhola Branch (Putlighar Road)',
    icon: '🏥',
    address: 'Putlighar Road, Nikat Missionaries of Charity, Linepar Majhola, Moradabad, Uttar Pradesh – 244001',
    schedule: {
      '1': { start: '10:30', end: '19:00' }, // Mon
      '2': { start: '10:30', end: '19:00' }, // Tue
      '3': { start: '10:30', end: '19:00' }, // Wed
      '4': { start: '10:30', end: '19:00' }, // Thu
      '5': { start: '10:30', end: '19:00' }, // Fri
      '6': { start: '10:30', end: '19:00' }, // Sat
    },
    days: [1, 2, 3, 4, 5, 6]
  },
  {
    id: 'clinic1' as const,
    name: 'Sonakpur Branch (Bypass Road)',
    icon: '🏥',
    address: 'Near Sri Ram Chowk, Sonakpur Bypass Road, Moradabad, Uttar Pradesh – 244001',
    schedule: {
      '0': { start: '10:00', end: '14:00' }, // Sunday
    },
    days: [0]
  }
];

const BookingPage = () => {
  const [step, setStep] = useState(1);
  const [selectedClinic, setSelectedClinic] = useState<typeof CLINICS[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [existingApps, setExistingApps] = useState<Appointment[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setExistingApps(dbService.getAppointments());
  }, []);

  const handleBooking = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedClinic) return;
    const fd = new FormData(e.currentTarget);
    const bookingData = {
      name: fd.get('name') as string,
      phone: fd.get('phone') as string,
      date: selectedDate,
      timing: selectedTime,
      branch: selectedClinic.name,
      symptoms: fd.get('symptoms') as string,
      bookingType: 'Online'
    };

    try {
      await fetch('/api/save-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      // Still update local state for the current view
      dbService.addAppointment({
        patientName: bookingData.name,
        phone: bookingData.phone,
        date: selectedDate,
        time: selectedTime,
        clinicId: selectedClinic.id
      });
      setStep(5);
    } catch (err) {
      alert('Booking failed. Please check connection.');
    }
  };

  const getAvailableDates = () => {
    if (!selectedClinic) return [];
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      if (selectedClinic.days.includes(d.getDay())) {
        dates.push({
          full: d.toISOString().split('T')[0],
          display: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })
        });
      }
    }
    return dates;
  };

  const getAvailableTimes = () => {
    if (!selectedClinic || !selectedDate) return [];
    const dateObj = new Date(selectedDate);
    const dayOfWeek = dateObj.getDay().toString() as keyof typeof selectedClinic.schedule;
    const hours = selectedClinic.schedule[dayOfWeek];
    if (!hours) return [];

    const slots = [];
    let current = new Date(`${selectedDate}T${hours.start}:00`);
    const end = new Date(`${selectedDate}T${hours.end}:00`);

    while (current < end) {
      const timeStr = current.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      const isBooked = existingApps.some(a => a.date === selectedDate && a.time === timeStr && a.clinicId === selectedClinic.id);
      const isPast = (selectedDate === new Date().toISOString().split('T')[0] && current < new Date());
      slots.push({ time: timeStr, booked: isBooked || isPast });
      current.setMinutes(current.getMinutes() + 10);
    }
    return slots;
  };

  return (
    <div className="pt-40 pb-24 px-6 max-w-4xl mx-auto bg-bg-base min-h-screen">
      <SEO
        title="Book Appointment"
        description="Book your Ayurvedic consultation with Dr. Priyankar. Choose your preferred clinic branch in Moradabad and select a timing that suits you."
      />
      <div className="bg-white p-6 md:p-12 rounded-[32px] shadow-xl-premium border border-gray-100">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div key="s1" layout className="space-y-8">
              <div className="text-center">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Step 1 of 4</span>
                <h2 className="text-4xl font-extrabold mt-4 text-text-main">Choose Preferred Clinic</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {CLINICS.map(c => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedClinic(c); setStep(2); }}
                    className="group p-8 border-2 border-gray-100 rounded-[32px] hover:border-primary hover:bg-primary/5 transition-all text-left space-y-4"
                  >
                    <div className="w-14 h-14 bg-bg-base rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">{c.icon}</div>
                    <div className="space-y-4">
                      <div>
                        <div className="font-bold text-xl text-text-main">{c.name}</div>
                        <div className="text-xs text-text-muted leading-relaxed mt-1">{c.address}</div>
                      </div>
                      <div className="pt-4 border-t border-gray-100">
                        <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Available Timing</div>
                        <div className="space-y-1">
                          {c.id === 'clinic1' ? (
                            <>
                              <div className="text-xs font-bold text-text-main flex justify-between"><span>Sunday</span> <span>10:00 AM – 2:00 PM</span></div>
                              <div className="text-xs font-bold text-text-main flex justify-between"><span>Tuesday</span> <span>4:00 PM – 8:00 PM</span></div>
                            </>
                          ) : (
                            <div className="text-xs font-bold text-text-main flex justify-between"><span>Mon - Fri</span> <span>10:30 AM – 6:00 PM</span></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : step === 2 ? (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="text-center">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Step 2 of 4</span>
                <h2 className="text-3xl font-extrabold mt-4 text-text-main">Select Visit Date</h2>
                <button onClick={() => setStep(1)} className="text-primary font-bold text-xs mt-2 hover:underline">← Change Clinic</button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {getAvailableDates().map(d => (
                  <button
                    key={d.full}
                    onClick={() => { setSelectedDate(d.full); setStep(3); }}
                    className={`p-4 border-2 rounded-2xl text-center transition-all ${selectedDate === d.full ? 'border-primary bg-primary text-white shadow-lg' : 'border-gray-100 bg-bg-base hover:border-primary/50'}`}
                  >
                    <div className="text-[10px] font-black uppercase mb-1 opacity-70">{d.display.split(',')[0]}</div>
                    <div className="font-bold text-lg">{d.display.split(',')[1]}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : step === 3 ? (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="text-center">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Step 3 of 4</span>
                <h2 className="text-3xl font-extrabold mt-4 text-text-main">Choose Time Slot</h2>
                <button onClick={() => setStep(2)} className="text-primary font-bold text-xs mt-2 hover:underline">← Change Date</button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {getAvailableTimes().map((t, idx) => (
                  <button
                    key={idx}
                    disabled={t.booked}
                    onClick={() => { setSelectedTime(t.time); setStep(4); }}
                    className={`p-3 border rounded-xl font-bold text-sm transition-all ${t.booked ? 'bg-gray-100 text-gray-400 cursor-not-allowed line-through border-transparent' : selectedTime === t.time ? 'bg-primary text-white border-primary border-2 scale-105' : 'border-gray-100 bg-bg-base hover:border-primary/50'}`}
                  >
                    {t.time}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : step === 4 ? (
            <motion.form key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleBooking} className="space-y-8">
              <div className="text-center">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Step 4 of 4</span>
                <h2 className="text-3xl font-extrabold mt-4 text-text-main">Patient Details</h2>
                <button onClick={() => setStep(3)} className="text-primary font-bold text-xs mt-2 hover:underline">← Back to Time</button>
              </div>

              <div className="bg-bg-base/50 p-6 rounded-2xl border border-gray-100 space-y-2 mb-8">
                <div className="flex justify-between text-xs font-bold text-text-muted uppercase tracking-wider">
                  <span>Clinic</span>
                  <span className="text-primary">{selectedClinic?.name}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-text-muted uppercase tracking-wider">
                  <span>Appointment</span>
                  <span className="text-primary">{new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} at {selectedTime}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Full Name</label>
                  <input name="name" required placeholder="John Doe" className="w-full p-4 border border-gray-100 bg-bg-base rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">WhatsApp Number</label>
                  <input name="phone" required placeholder="+91 ..." className="w-full p-4 border border-gray-100 bg-bg-base rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Main Symptoms / Problem</label>
                  <textarea name="symptoms" required placeholder="Describe your health concern..." rows={3} className="w-full p-4 border border-gray-100 bg-bg-base rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none" />
                </div>
              </div>

              <button type="submit" className="w-full btn-primary py-5 text-base shadow-lg shadow-primary/20 transition-transform active:scale-[0.98]">Confirm Booking</button>
            </motion.form>
          ) : (
            <motion.div key="s5" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
              <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-primary/5">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h3 className="text-4xl font-extrabold mb-4 text-text-main tracking-tight">Appointment Confirm Ho Gaya!</h3>
              <p className="text-lg text-text-muted mb-8 leading-relaxed max-w-sm mx-auto font-medium">
                Humne aapki request receive kar li hai. Dr. Priyankar ki team aapse jald hi contact karegi.
              </p>

              {/* Summary Card */}
              <div className="bg-bg-base/50 p-8 rounded-[32px] border border-gray-100 mb-10 max-w-md mx-auto text-left space-y-4 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm">🏥</div>
                  <div>
                    <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Clinic</div>
                    <div className="font-bold text-text-main">{selectedClinic?.name}</div>
                    <div className="text-xs text-text-muted leading-tight mt-0.5">{selectedClinic?.address}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm">📅</div>
                  <div>
                    <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Date & Time</div>
                    <div className="font-bold text-text-main">
                      {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                    </div>
                    <div className="text-primary font-bold">{selectedTime}</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => {
                    if (!selectedClinic) return;
                    const startTime = selectedTime;
                    const date = selectedDate;
                    const [h, m] = startTime.split(':');
                    const isPM = startTime.includes('PM');
                    let startH = parseInt(h);
                    if (isPM && startH !== 12) startH += 12;
                    if (!isPM && startH === 12) startH = 0;

                    const startStr = `${date.replace(/-/g, '')}T${startH.toString().padStart(2, '0')}${m.substring(0, 2)}00Z`;
                    const endH = (startH + 1); // 1 hour duration
                    const endStr = `${date.replace(/-/g, '')}T${endH.toString().padStart(2, '0')}${m.substring(0, 2)}00Z`;

                    const gCalUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=Ayurvedic+Consultation+with+Dr.+Priyankar&details=Appointment+at+${selectedClinic.name}&location=${encodeURIComponent(selectedClinic.address)}&dates=${startStr}/${endStr}`;
                    window.open(gCalUrl, '_blank');
                  }}
                  className="btn-outline flex items-center justify-center gap-2 group"
                >
                  <Calendar className="w-4 h-4" /> Add to Google Calendar
                </button>
                <button
                  onClick={() => {
                    const message = `Namaste Dr. Priyankar, maine appointment book ki hai.\n\nClinic: ${selectedClinic?.name}\nDate: ${selectedDate}\nTime: ${selectedTime}\n\nKripya karke confirm karein.`;
                    window.open(getWhatsAppUrl(message), '_blank');
                  }}
                  className="bg-[#25D366] text-white px-12 py-5 rounded-full font-bold hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  WhatsApp Par Karein
                </button>
                <button onClick={() => navigate('/')} className="btn-secondary px-12">Return Home</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- Main App ---

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default function App() {
  const [lang, setLang] = useState<Language>(Language.HINDI);
  const [showLangModal, setShowLangModal] = useState(false);

  useEffect(() => {
    const savedLang = Cookies.get('app_language') as Language;
    if (savedLang && Object.values(Language).includes(savedLang)) {
      setLang(savedLang);
      setShowLangModal(false);
    } else {
      setShowLangModal(true);
    }
  }, []);

  const handleLangSelect = (selectedLang: Language) => {
    setLang(selectedLang);
    Cookies.set('app_language', selectedLang, { expires: 365 });
    setShowLangModal(false);
  };

  const handleLangChange = (newLang: Language) => {
    setLang(newLang);
    Cookies.set('app_language', newLang, { expires: 365 });
  };

  const content = {
    [Language.HINGLISH]: {
      heroTag: "Purane Upchar, Naya Tarika",
      heroTitleLine1: "Behtar zindagi ke liye",
      heroTitleLine2: "Natural Ilaj.",
      heroSubTagline: "Sahi upchar, sahi samay par.",
      heroSub: "Ab bimaariyo ko kaho bye-bye. Dr. Priyankar ke saath payein 100% shuddh Ayurvedic ilaj.",
      ctaBook: "Book Appointment",
      ctaChat: "WhatsApp Chat",
      ctaConsultation: "Book Appointment",
      servicesTag: "Specialized Treatments",
      servicesTitle1: "Puraani Bimariyon ka",
      servicesTitle2: "Pakka Ilaj.",
      servicesExplore: "Saari Services Dekhein",
      aboutTag: "20+ Saalo Ka Bharosa",
      aboutTitle: "Miliye Dr. Priyankar Se",
      aboutShortDesc: "Purani bimariyon aur metabolic disorders ke bade expert. Aapki sehat ko balance karne ke liye",
      aboutHighlight: "clinical Ayurvedic tareeke.",
      aboutDesc: "Ayurvedic methods ko modern research ke saath milakar hum purani bimariyon ka ilaj karte hain. 20+ saal ke experience ke saath, Dr. Priyankar ne hazaro logon ki madad ki hai Moradabad mein.",
      aboutCta: "Dr. Se Salah Lein",
      sCheckTag: "Health Test",
      sCheckTitle: "Apni Sehat Check Karein",
      footerDesc: "Dr. Priyankar pure Ayurveda ke zariye aapko swasth banane ke liye kaam kar rahe hain. Moradabad ka sabse bharosemand Ayurvedic center.",
      footerContact: "Humein Contact Karein",
      footerLinks: "Jaruri Links",
      footerAbout: "Doctor Ke Baare Mein",
      footerServices: "Hamare Ilaj",
      footerBook: "Online Booking",
      footerVisit: "Clinic Visit",
      footerContactPage: "Contact Page",
      footerTerms: "Niyam aur Shartein",
      footerPrivacy: "Privacy Policy",
      footerRefund: "Refund Policy",
      footerDisclaimer: "Disclaimer",
      checkerQ1: "Aapko kya takleef hai?",
      checkerQ2: "Ye kab se ho raha hai?",
      checkerQ3: "Aapka lifestyle kaisa hai?",
      checkerSub1: "Apne symptoms select karein taaki hum sahi upchar bata sakein.",
      checkerSub2: "Sahi duration se hum behtar ilaj bata paayenge.",
      checkerSub3: "Aapki daily habits health par asar dalti hain.",
      checkerResultTitle: "Report Taiyaar Hai!",
      checkerBtnBack: "Wapas Start Karein",
      checkerBtnBook: "Abhi Appointment Book Karein",
      waPreFill: "Namaste Dr. Priyankar, mujhe Ayurvedic treatment ke baare mein jaankari chahiye. Kya aap meri madad kar sakte hain?",
      locTag: "Kahan Milein?",
      locTitle: "Hamare Clinics",
      locSub: "Moradabad mein hamare do centers hain aapki seva ke liye.",
      loc1Name: "Majhola Branch (Putlighar Road)",
      loc1Addr: "Putlighar Road, Missnaries of Charity ke paas, Linepar Majhola, Moradabad, U.P.",
      loc1Time: "Mon - Sat: 10:30am - 2:00pm & 5:00pm - 7:00pm",
      loc2Name: "Sonakpur Branch (Bypass Road)",
      loc2Addr: "Sonakpur bypass road (Shri Ram chauk aur Chetiya farm house ke beech), Moradabad, U.P.",
      loc2Time: "Sunday: 10:00am - 2:00pm",
      locDirection: "Rasta Dekhein",
      locCall: "Call Karein",
      specTreatTag: "Scientific Ayurveda",
      specTreatTitle: "Hamari Specialties",
      specTreatSub: "Puraani bimariyon ka jad se ilaj, clinical research aur purane gyaan ke saath.",
      specGastroTitle: "Pet ki Samasya",
      specGastroHindi: "Pet dard, acidity, gas, kabz, liver ki bimari aur bawaseer ka jad se ilaj.",
      specSkinTitle: "Skin ki Samasya",
      specSkinHindi: "Khujli, eczema, psoriasis, acne, aur fungal infection ka natural ilaj.",
      specNeuroTitle: "Nasso aur Jodon ka Dard",
      specNeuroHindi: "Migraine, peeth dard, gardan dard, aur har tarah ke jodon ke dard ka pakka ilaj.",
      specFemaleTitle: "Mahila Rog",
      specFemaleHindi: "Masik dharm ki dikkat, PCOD, thyroid aur hormonal imbalances ka Ayurvedic ilaj.",
      specMaleTitle: "Purush Rog",
      specMaleHindi: "Gupt rog, weakness, aur har tarah ki purush samasyao ka confidential ilaj.",
      specPanchTitle: "Panchkarma Detox",
      specPanchHindi: "Sharir ki shuddhi ke liye Vaman, Virechana aur Shirodhara jaisi advanced therapies.",
      specLearnMore: "Aur Jaanein"
    },
    [Language.HINDI]: {
      heroTag: "नया जमाना, पुरानी देखभाल",
      heroTitleLine1: "एक बेहतर जीवन के लिए",
      heroTitleLine2: "प्राकृतिक उपचार।",
      heroSubTagline: "सही उपचार, सही समय पर।",
      heroSub: "अब बीमारियों को कहें अलविदा। डॉ प्रियंकर के साथ शुद्ध और भरोसेमंद आयुर्वेदिक इलाज पाएं।",
      ctaBook: "अपॉइंटमेंट बुक करें",
      ctaChat: "WhatsApp पर बात करें",
      ctaConsultation: "अपॉइंटमेंट बुक करें",
      servicesTag: "विशेष उपचार",
      servicesTitle1: "पुरानी बीमारियों का",
      servicesTitle2: "आयुर्वेदिक समाधान।",
      servicesExplore: "सभी सेवाएं देखें",
      aboutTag: "20+ सालों का अनुभव",
      aboutTitle: "डॉ. प्रियंकर से मिलें",
      aboutShortDesc: "पुरानी बीमारियों और मेटाबॉलिक विकारों के विशेषज्ञ। आपके स्वास्थ्य को संतुलित करने के लिए",
      aboutHighlight: "शुद्ध आयुर्वेदिक विधियां।",
      aboutDesc: "आयुर्वेदिक विधियों को आधुनिक शोध के साथ मिलाकर हम पुरानी बीमारियों का इलाज करते हैं। 20+ साल के अनुभव के साथ, डॉ. प्रियंकर ने मुरादाबाद में हजारों लोगों की मदद की है।",
      aboutCta: "डॉक्टर से परामर्श लें",
      sCheckTag: "स्वास्थ्य परीक्षण",
      sCheckTitle: "अपनी सेहत की जांच करें",
      footerDesc: "डॉ. प्रियंकर शुद्ध आयुर्वेद के माध्यम से स्वास्थ्य को बहाल करने के लिए समर्पित हैं। मुरादाबाद का प्रमुख केंद्र।",
      footerContact: "संपर्क करें",
      footerLinks: "जरूरी लिंक्स",
      footerAbout: "डॉक्टर के बारे में",
      footerServices: "हमारे उपचार",
      footerBook: "ऑनलाइन बुकिंग",
      footerVisit: "क्लिनिक आएं",
      footerContactPage: "संपर्क पृष्ठ",
      footerTerms: "नियम और शर्तें",
      footerPrivacy: "गोपनीयता नीति",
      footerRefund: "रिफंड पॉलिसी",
      footerDisclaimer: "डिस्क्लेमर",
      checkerQ1: "आपको क्या समस्या है?",
      checkerQ2: "यह कब से चल रहा है?",
      checkerQ3: "आपकी जीवनशैली कैसी है?",
      checkerSub1: "अपने लक्षणों को चुनें ताकि हम सही उपचार बता सकें।",
      checkerSub2: "अवधि से हमें बीमारी की गहराई का पता चलता है।",
      checkerSub3: "आपकी दैनिक आदतें स्वास्थ्य पर बड़ा असर डालती हैं।",
      checkerResultTitle: "रिपोर्ट तैयार है!",
      checkerBtnBack: "फिर से शुरू करें",
      checkerBtnBook: "अभी अपॉइंटमेंट बुक करें",
      waPreFill: "नमस्ते डॉ प्रियंकर, मुझे आयुर्वेदिक उपचार के बारे में जानकारी चाहिए। क्या आप मेरी मदद कर सकते हैं?",
      locTag: "हम कहां हैं?",
      locTitle: "हमारे क्लिनिक स्थान",
      locSub: "मुरादाबाद में आपकी सुविधा के लिए हमारे दो क्लिनिक हैं।",
      loc1Name: "मझोला शाखा (पुतलीघर रोड)",
      loc1Addr: "पुतलीघर रोड, मिशनरीज ऑफ चैरिटी के पास, लाइनपार मझोला, मुरादाबाद, उत्तर प्रदेश - 244001।",
      loc1Time: "सोम - शनि: 10:30am - 2:00pm और 5:00pm - 7:00pm",
      loc2Name: "सोनकपुर शाखा (बाईपास रोड)",
      loc2Addr: "सोनकपुर बाईपास रोड (श्री राम चौक और चेतिया फार्म हाउस के बीच), मुरादाबाद, उत्तर प्रदेश।",
      loc2Time: "रविवार: 10:00am - 2:00pm",
      locDirection: "रास्ता देखें",
      locCall: "कॉल करें",
      specTreatTag: "वैज्ञानिक आयुर्वेद",
      specTreatTitle: "विशेष उपचार",
      specTreatSub: "पुरानी बीमारियों का जड़ से इलाज, शोध और पारंपरिक ज्ञान के साथ।",
      specGastroTitle: "पेट के रोग",
      specGastroHindi: "एसिडिटी, गैस, कब्ज, लिवर की बीमारी, और बवासीर का जड़ से आयुर्वेदिक इलाज।",
      specSkinTitle: "त्वचा रोग",
      specSkinHindi: "खुजली, एक्जिमा, सोरायसिस, मुहांसे और फंगल इन्फेक्शन का प्राकृतिक समाधान।",
      specNeuroTitle: "नसों और जोड़ों का दर्द",
      specNeuroHindi: "माइग्रेन, पीठ दर्द, गर्दन दर्द और हर तरह के जोड़ों के दर्द का पक्का इलाज।",
      specFemaleTitle: "महिला रोग",
      specFemaleHindi: "मासिक धर्म की समस्याएं, PCOD, थायराइड और बांझपन का सफल आयुर्वेदिक इलाज।",
      specMaleTitle: "पुरुषों के रोग",
      specMaleHindi: "शारीरिक कमजोरी, गुप्त रोग और पुरुषों की अन्य स्वास्थ्य समस्याओं का गोपनीय इलाज।",
      specPanchTitle: "पंचकर्म डिटॉक्स",
      specPanchHindi: "वमन, विरेचन और शिरोधारा द्वारा शरीर की गहरी सफाई और कायाकल्प।",
      specLearnMore: "और जानें"
    },
    [Language.ENGLISH]: {
      heroTag: "Startup-Grade Ayurvedic Care",
      heroTitleLine1: "Natural Healing for a",
      heroTitleLine2: "Better Life.",
      heroSubTagline: "Right treatment, at the right time.",
      heroSub: "Say goodbye to ailments naturally. Experience authentic healing with Dr. Priyankar.",
      ctaBook: "Book Appointment",
      ctaChat: "WhatsApp Dr. Priyankar",
      ctaConsultation: "Book Appointment",
      servicesTag: "Specialized Treatments",
      servicesTitle1: "Authentic Ayurveda for",
      servicesTitle2: "Modern Ailments.",
      servicesExplore: "Explore All Services",
      aboutTag: "Legacy of Healing",
      aboutTitle: "Meet Dr. Priyankar",
      aboutShortDesc: "Renowned specialist in chronic ailments and metabolic disorders. Dedicated to restoring balance through authentic",
      aboutHighlight: "clinical Ayurvedic methodologies.",
      aboutDesc: "Combining traditional Ayurvedic methodologies with clinical research to provide non-invasive treatment for chronic ailments. With over 20 years of experience, Dr. Priyankar has helped thousands regain their health naturally.",
      aboutCta: "Book Private Consultation",
      sCheckTag: "Self Assessment",
      sCheckTitle: "Check your health status",
      footerDesc: "Dr. Priyankar is dedicated to restoring health through pure Ayurveda. We are committed to making modern living sustainable and balanced.",
      footerContact: "Contact Us",
      footerLinks: "Quick Links",
      footerAbout: "About Doctor",
      footerServices: "Our Treatments",
      footerBook: "Book Online",
      footerVisit: "Clinic Visit",
      footerContactPage: "Contact Us",
      footerTerms: "Terms & Conditions",
      footerPrivacy: "Privacy Policy",
      footerRefund: "Refund Policy",
      footerDisclaimer: "Disclaimer",
      checkerQ1: "Identify body imbalance",
      checkerQ2: "How long has this been happening?",
      checkerQ3: "How is your lifestyle?",
      checkerSub1: "Select your symptoms so we can advise the right treatment.",
      checkerSub2: "Duration helps us understand the severity.",
      checkerSub3: "Your daily habits have a huge impact on health.",
      checkerResultTitle: "Report is Ready!",
      checkerBtnBack: "Start Again",
      checkerBtnBook: "Book Appointment Now",
      waPreFill: "Namaste Dr. Priyankar, I would like to inquire about Ayurvedic treatment.",
      locTag: "Where to find us?",
      locTitle: "Our Clinic Locations",
      locSub: "We have two conveniently located clinics in Moradabad to serve you better.",
      loc1Name: "Majhola Branch (Putlighar Road)",
      loc1Addr: "Putlighar Road Nikat Missnaries of Charity Linepar Majhola, Moradabad, U.P. - 244001.",
      loc1Time: "Mon - Sat: 10:30am - 2:00pm & 5:00pm - 7:00pm",
      loc2Name: "Sonakpur Branch (Bypass Road)",
      loc2Addr: "Sonakpur bypass road (between Shri Ram chauk & Chetiya farm house), Moradabad, U.P. 244001",
      loc2Time: "Sunday: 10:00am - 2:00pm",
      locDirection: "View Location",
      locCall: "Call Now",
      specTreatTag: "Scientific Ayurveda",
      specTreatTitle: "Specialized Treatments",
      specTreatSub: "Treating chronic diseases from the root using clinical research and traditional wisdom.",
      specGastroTitle: "GastroIntestinal",
      specGastroHindi: "Stomach Pain, Indigestion, Ulcer, Acidity, Gas, Constipation, Liver Disease, Intestines Inflammation, Hemorrhoids.",
      specSkinTitle: "Skin Disorders",
      specSkinHindi: "Itching, Dermatitis, Eczema, Psoriasis, Acne, Fungal Infection, Vitiligo, Pigmentation.",
      specNeuroTitle: "Neuro & Muscular",
      specNeuroHindi: "Migraine, Back Pain, Neck Pain, Nerve Pain, Muscle Strain, Joint Pain, Paralysis, Spinal Issues.",
      specFemaleTitle: "Female Disease",
      specFemaleHindi: "Menstrual Problems, PCOD, Fibroids, Pregnancy Issues, Menopause, Infertility, Ovarian Cysts, PMS.",
      specMaleTitle: "Male Disease",
      specMaleHindi: "Prostate, Erectile Dysfunction, Infertility, Low Sperm Count, Testicular Inflammation, STDs.",
      specPanchTitle: "Panchkarma",
      specPanchHindi: "Vamana, Virechana, Basti, Nasya, Raktamokshana, Shirodhara, Pinda Sweda, Abhyanga, Udwartana.",
      specLearnMore: "Learn More"
    }
  };

  const t = content[lang];

  return (
    <Router>
      <ScrollToTop />
      <AnimatePresence>
        {showLangModal && <LanguageSelectionModal onSelect={handleLangSelect} />}
      </AnimatePresence>
      <div className="min-h-screen bg-bg-base">
        <Header lang={lang} setLang={handleLangChange} t={t} />
        <Routes>
          <Route path="/" element={<HomePage t={t} />} />
          <Route path="/about" element={<AboutPage t={t} />} />
          <Route path="/admin" element={<Navigate to="/admin-anandam" replace />} />
          <Route path="/services" element={<ServicesPage t={t} />} />
          <Route path="/services/:slug" element={<ServiceDetailPage t={t} />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/contact" element={<ContactPage t={t} />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/refund" element={<RefundPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/admin-anandam" element={<AdminPage />} />
        </Routes>
        <Footer t={t} />

        {/* Floating WhatsApp Button */}
        <a
          href="https://wa.me/919761696655?text=Namaste Dr. Priyankar, mujhe Ayurvedic treatment ke baare mein jaankari chahiye."
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-8 right-8 z-[100] group"
        >
          <div className="absolute inset-0 bg-[#25D366] rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="relative bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.067 2.877 1.215 3.076.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 00-5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </motion.div>
        </a>
      </div>
    </Router>
  );
}
