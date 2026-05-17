import React from 'react';
import { motion } from 'motion/react';
import { Shield, FileText, RefreshCw, AlertTriangle } from 'lucide-react';
import { SEO } from '../components/SEO';

const LegalLayout = ({ children, title, icon: Icon, tag }: { children: React.ReactNode, title: string, icon: any, tag: string }) => (
  <div className="pt-32 pb-24 bg-bg-base min-h-screen">
    <SEO title={title} />
    <div className="max-w-4xl mx-auto px-6">
      <div className="text-center mb-16">
        <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-block mb-4 border border-primary/20">
          {tag}
        </span>
        <div className="flex items-center justify-center gap-4 mb-6">
          <Icon className="w-10 h-10 text-primary" />
          <h1 className="text-4xl md:text-6xl font-black text-text-main tracking-tight">
            {title}
          </h1>
        </div>
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[48px] p-8 md:p-16 border border-gray-100 shadow-2xl-premium prose prose-slate max-w-none"
      >
        {children}
      </motion.div>
      <div className="text-center mt-12 text-gray-400 text-xs font-medium">
        Last Updated: May 10, 2026
      </div>
    </div>
  </div>
);

export const PrivacyPage = () => (
  <LegalLayout title="Privacy Policy" icon={Shield} tag="Data Protection">
    <h2 className="text-2xl font-bold mb-4">1. Data Collection</h2>
    <p>Hum aapki personal information, jaise naam aur mobile number, sirf appointment booking aur consultation ke liye collect karte hain.</p>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">2. Patient Confidentiality</h2>
    <p>Aapki medical history aur symptoms ko hum 100% confidential rakhte hain. Ye data sirf Dr. Priyankar aur unki authorized medical team ke paas rehta hai.</p>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">3. Data Usage</h2>
    <p>Hum kisi bhi third-party ko aapka data nahi bechte hain. Data sirf service improvements aur medical advice ke liye use hota hai.</p>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">4. WhatsApp Usage</h2>
    <p>WhatsApp communication ka use quick updates aur pre-fill messages ke liye kiya jata hai. Ispar share kiya gaya data bhi personal rehta hai.</p>
  </LegalLayout>
);

export const TermsPage = () => (
  <LegalLayout title="Terms & Conditions" icon={FileText} tag="Legal Usage">
    <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
    <p>Anandam Arogyam website use karke aap humaare terms se sahmat hain.</p>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">2. Appointment Booking</h2>
    <p>Booking online ki ja sakti hai, lekin final confirming Dr. Priyankar ki availability par depend karti hai.</p>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">3. Medical Advice</h2>
    <p>Website par di gayi information general educational purposes ke liye hai. Ise final medical advice na maanein; hamesha 1-on-1 consultation prefer karein.</p>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">4. Consultation Charges</h2>
    <p>Consultation fees aur medicine charges clinic par visit ke samay diye jayenge.</p>
  </LegalLayout>
);

export const RefundPage = () => (
  <LegalLayout title="Refund Policy" icon={RefreshCw} tag="Returns & Credits">
    <h2 className="text-2xl font-bold mb-4">1. Booking Cancellations</h2>
    <p>Agar aap online booking cancel karna chahte hain, toh kripya 24 ghante pehle hume WhatsApp ya call par batayein.</p>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">2. Medicine Returns</h2>
    <p>Kyunki medicines customized aur health products hain, hum khule hue boxes ya partial use ki gayi medicines par returns accept nahi karte.</p>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">3. Consultation Fees</h2>
    <p>Ek baar consultation complete hone ke baad fees non-refundable hai.</p>
  </LegalLayout>
);

export const DisclaimerPage = () => (
  <LegalLayout title="Disclaimer" icon={AlertTriangle} tag="Medical Notice">
    <h2 className="text-2xl font-bold mb-4">1. General Information</h2>
    <p>Anandam Arogyam website par jitni bhi information (articles, treatments, details) hai, wo informational purpose ke liye hai.</p>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">2. Individual Results</h2>
    <p>Ayurveda mein results body type (Prakriti) aur lifestyle par nirbhar karte hain. Har kisi ko ek jaisa fayda ho, ye zaroori nahi hai.</p>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">3. Emergency Situations</h2>
    <p>Agar aapko koi acute emergency hai, toh kripya turant nearest emergency hospital visit karein. Ayurveda chronic ailments aur holistic health par focus karta hai.</p>
  </LegalLayout>
);
