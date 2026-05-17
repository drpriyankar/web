import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, MessageCircle, Clock, Send, CheckCircle2, RefreshCw } from 'lucide-react';
import { SEO } from '../components/SEO';

export const ContactPage = ({ t }: { t: any }) => {
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    const fd = new FormData(e.currentTarget);
    const data = {
      name: fd.get('name') as string,
      phone: fd.get('phone') as string,
      issue: fd.get('issue') as string,
      message: fd.get('message') as string,
    };

    try {
      const res = await fetch('/api/save-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setStatus('success');
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="pt-32 pb-24 bg-white">
      <SEO 
        title="Contact Us"
        description="Get in touch with Anandam Arogyam Ayurvedic Clinic in Moradabad. Call us at +91 97616 96655 or visit our branches at Sonakpur and Majhola."
        keywords={["Contact Dr. Priyankar", "Moradabad clinic location", "ayurvedic consultation booking"]}
      />
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-block mb-4 border border-primary/20">
            Get in Touch
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-text-main tracking-tight mb-6">
            Contact <span className="text-primary">Us</span>
          </h1>
          <p className="text-text-muted font-medium text-lg max-w-2xl mx-auto">
            Have questions about our treatments? Humse kabhi bhi sampark karein.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-bg-base rounded-[32px] border border-gray-100 group hover:ring-2 ring-primary/10 transition-all">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Call Support</h3>
                <p className="text-text-muted text-sm font-medium mb-4">Urgent help ke liye phone karein.</p>
                <a href="tel:+919761696655" className="text-primary font-black text-lg">+91 97616 96655</a>
              </div>

              <div className="p-8 bg-bg-base rounded-[32px] border border-gray-100 group hover:ring-2 ring-primary/10 transition-all">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">WhatsApp</h3>
                <p className="text-text-muted text-sm font-medium mb-4">Quick chat or photo share karein.</p>
                <a href="https://wa.me/919761696655" target="_blank" rel="noreferrer" className="text-whatsapp font-black text-lg">Chat Now</a>
              </div>
            </div>

            <div className="p-10 bg-primary/5 rounded-[48px] border border-primary/10">
              <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                <MapPin className="w-6 h-6 text-primary" />
                Our Clinics
              </h3>
              <div className="space-y-12">
                <div>
                  <h4 className="font-bold text-lg mb-2">Sonakpur Branch</h4>
                  <p className="text-text-muted text-sm leading-relaxed mb-4">Sonakpur bypass road (between Shri Ram chauk & Chetiya farm house), Moradabad, U.P. 244001</p>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 text-primary text-xs font-black uppercase tracking-widest bg-white px-3 py-1.5 rounded-full border border-primary/10 shadow-sm">
                      <Clock className="w-4 h-4" />
                      Sun: 10:00 AM - 2:00 PM
                    </div>
                    <button 
                      onClick={() => window.open('https://www.google.com/maps/search/' + encodeURIComponent('Sonakpur bypass road (between Shri Ram chauk & Chetiya farm house), Moradabad, U.P. 244001'), '_blank')}
                      className="text-[10px] font-black uppercase tracking-widest text-text-main flex items-center gap-2 hover:text-primary transition-colors bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm"
                    >
                      <MapPin className="w-3 h-3" />
                      Get Directions
                    </button>
                  </div>
                </div>
                <div className="pt-12 border-t border-primary/10">
                  <h4 className="font-bold text-lg mb-2">Majhola Branch</h4>
                  <p className="text-text-muted text-sm leading-relaxed mb-4">Putlighar Road Nikat Missnaries of Charity Linepar Majhola, Moradabad, U.P. - 244001.</p>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 text-primary text-xs font-black uppercase tracking-widest bg-white px-3 py-1.5 rounded-full border border-primary/10 shadow-sm">
                      <Clock className="w-4 h-4" />
                      Mon-Sat: 10:30 AM - 2:00 PM & 5:00 PM - 7:00 PM
                    </div>
                    <button 
                      onClick={() => window.open('https://www.google.com/maps/search/' + encodeURIComponent('Putlighar Road Nikat Missnaries of Charity Linepar Majhola, Moradabad, U.P. - 244001.'), '_blank')}
                      className="text-[10px] font-black uppercase tracking-widest text-text-main flex items-center gap-2 hover:text-primary transition-colors bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm"
                    >
                      <MapPin className="w-3 h-3" />
                      Get Directions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white border border-gray-100 rounded-[48px] p-10 shadow-2xl-premium">
            <h3 className="text-3xl font-black mb-2 tracking-tight">Send a <span className="text-primary">Message</span></h3>
            <p className="text-text-muted font-medium mb-8">Details bharein, hum aapko call back karenge.</p>
            
            {status === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 p-8 rounded-3xl text-center border border-emerald-100"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-emerald-900 mb-2">Message Sent!</h4>
                <p className="text-emerald-700 text-sm">Shukriya. Hum jald hi aapse sampark karenge.</p>
                <button onClick={() => setStatus('idle')} className="mt-6 text-emerald-600 font-black text-[10px] uppercase tracking-widest">Send another</button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Full Name</label>
                    <input name="name" required placeholder="Your Name" className="w-full p-4 border border-gray-100 bg-bg-base rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Phone Number</label>
                    <input name="phone" required placeholder="+91 ..." className="w-full p-4 border border-gray-100 bg-bg-base rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Health Issue</label>
                  <select name="issue" className="w-full p-4 border border-gray-100 bg-bg-base rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium appearance-none">
                    <option>Gastrointestinal Problems</option>
                    <option>Skin Disorders</option>
                    <option>Joint/Muscle Pain</option>
                    <option>Weight Management</option>
                    <option>Diabetes Care</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Message (Optional)</label>
                  <textarea name="message" rows={4} placeholder="Apni samasya batayein..." className="w-full p-4 border border-gray-100 bg-bg-base rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none" />
                </div>
                {status === 'error' && <p className="text-red-500 text-xs font-bold">Kuch galat hua. Please try again.</p>}
                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="w-full btn-primary py-5 text-base flex items-center justify-center gap-3"
                >
                  {status === 'loading' ? <RefreshCw className="w-5 h-5 animate-spin" /> : <>Send Message <Send className="w-5 h-5" /></>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
