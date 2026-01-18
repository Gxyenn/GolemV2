
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Shield, Zap, Cpu, Terminal, Heart, Code, Smartphone, Globe, CheckCircle2, Layout } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const handleScrollToFeatures = () => {
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden flex flex-col items-center bg-[#0a0a0a] selection:bg-blue-500/30">
      {/* Background blobs with animation */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full"
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full"
      />

      {/* Nav */}
      <nav className="w-full max-w-7xl px-6 py-8 flex justify-between items-center z-50">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)] group-hover:scale-110 transition-transform duration-500">
            <Cpu className="text-white" size={20} />
          </div>
          <span className="text-2xl font-black tracking-tighter">GOLEM AI</span>
        </motion.div>
        
        <motion.div 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="hidden md:flex gap-10 text-xs font-black uppercase tracking-widest text-zinc-500"
        >
          <button onClick={handleScrollToFeatures} className="hover:text-white transition-colors">Features</button>
          <a href="#about" className="hover:text-white transition-colors">About Dev</a>
          <a href="#vision" className="hover:text-white transition-colors">Vision</a>
        </motion.div>

        <motion.button 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={onStart}
          className="px-8 py-3 bg-white text-black text-xs font-black uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-all shadow-xl hover:shadow-white/10 active:scale-95"
        >
          Launch Chat
        </motion.button>
      </nav>

      {/* Hero Section */}
      <motion.main 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex-1 flex flex-col items-center justify-center px-6 text-center z-10 max-w-5xl pt-20 pb-32"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/5 border border-blue-500/20 rounded-full text-[10px] font-black text-blue-400 mb-10 tracking-[0.2em] uppercase">
          <Sparkles size={14} className="text-blue-400 animate-pulse" />
          Powered by Gemini 3 Pro
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="text-6xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.9] bg-gradient-to-b from-white via-white to-zinc-600 bg-clip-text text-transparent">
          Intelligence with <br /> a Human Touch.
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-lg md:text-2xl text-zinc-400 mb-12 max-w-3xl leading-relaxed font-medium">
          Meet <span className="text-white">Golem AI</span>. A cheerful and polite companion meticulously crafted by <span className="text-blue-500 font-bold underline decoration-blue-500/30 underline-offset-8">Stoky</span> to revolutionize how you interact with artificial intelligence.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 mb-32 w-full justify-center">
          <button 
            onClick={onStart}
            className="group relative px-10 py-5 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 overflow-hidden transition-all shadow-[0_20px_40px_rgba(37,99,235,0.25)] hover:shadow-[0_25px_50px_rgba(37,99,235,0.4)] hover:-translate-y-1 active:translate-y-0"
          >
            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
            Start Your Journey
            <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform duration-300" />
          </button>
          <button 
            onClick={handleScrollToFeatures}
            className="px-10 py-5 bg-zinc-900/50 backdrop-blur-md text-white rounded-2xl font-black text-lg hover:bg-zinc-800 transition-all border border-white/5 hover:border-white/10 flex items-center justify-center gap-2 group"
          >
            <Layout size={20} className="group-hover:text-blue-400 transition-colors" />
            View Showcase
          </button>
        </motion.div>

        {/* Features Section */}
        <div id="features" className="w-full space-y-32 scroll-mt-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <FeatureCard 
              delay={0.1}
              icon={<Shield size={28} className="text-blue-400" />}
              title="Locally Secure"
              desc="Your data is your business. We prioritize local storage and top-tier encryption standards."
            />
            <FeatureCard 
              delay={0.2}
              icon={<Zap size={28} className="text-yellow-400" />}
              title="Cheerfully Polite"
              desc="Golem isn't just a bot; it's a polite assistant designed to uplift your mood every conversation."
            />
            <FeatureCard 
              delay={0.3}
              icon={<Code size={28} className="text-purple-400" />}
              title="Modern Core"
              desc="Built by Stoky using Gemini 3's advanced logic for lightning-fast analysis and coding."
            />
          </div>

          {/* About Developer Section */}
          <motion.section 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            id="about" 
            className="relative w-full rounded-[3rem] overflow-hidden bg-gradient-to-b from-zinc-900/40 to-transparent border border-white/5 p-8 md:p-20 text-left"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] font-black text-purple-400 mb-6 tracking-widest uppercase">
                  THE ARCHITECT
                </div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
                  Crafted with Passion <br /> by Stoky.
                </h2>
                <p className="text-lg text-zinc-400 mb-8 leading-relaxed font-medium">
                  Stoky adalah seorang Senior Frontend Engineer yang memiliki visi untuk menyatukan estetika desain modern dengan kekuatan kecerdasan buatan. Golem AI adalah perwujudan dari dedikasi Stoky dalam menghadirkan tools yang tidak hanya cerdas, tapi juga memiliki "jiwa" melalui interaksi yang ramah.
                </p>
                <div className="space-y-4">
                  {[
                    "Minimalis & Modern Design Aesthetic",
                    "Deep Expertise in Generative AI Integration",
                    "Focused on Performance & Responsiveness",
                    "User-Centric Behavioral Logic"
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3 text-zinc-300 font-bold text-sm">
                      <CheckCircle2 size={18} className="text-blue-500" />
                      {text}
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-[4rem] flex items-center justify-center p-8 animate-float">
                  <div className="w-full h-full glass rounded-[3rem] flex flex-col items-center justify-center text-center p-10">
                    <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-blue-500/50 mb-6 flex items-center justify-center font-black text-3xl shadow-[0_0_30px_rgba(37,99,235,0.3)]">ST</div>
                    <h4 className="text-2xl font-black mb-2">Stoky</h4>
                    <p className="text-blue-400 font-bold uppercase tracking-widest text-xs mb-6">Lead Developer</p>
                    <div className="flex gap-4">
                      <div className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"><Globe size={20} /></div>
                      <div className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"><Terminal size={20} /></div>
                      <div className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"><Heart size={20} /></div>
                    </div>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-blue-500/20 blur-3xl -z-10" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/20 blur-3xl -z-10" />
              </div>
            </div>
          </motion.section>

          {/* Vision Section */}
          <div id="vision" className="max-w-3xl mx-auto py-20">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h3 className="text-3xl md:text-5xl font-black tracking-tight mb-8">Ready to Meet Golem?</h3>
              <p className="text-zinc-500 font-medium mb-12 text-lg">
                Bergabunglah dengan pengalaman baru berinteraksi dengan AI. Golem dirancang untuk menjadi partner diskusi yang ceria, sopan, dan sangat membantu kebutuhan harian Anda.
              </p>
              <button 
                onClick={onStart}
                className="px-12 py-5 bg-white text-black rounded-2xl font-black text-xl hover:scale-105 transition-transform active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.15)]"
              >
                Get Started Now
              </button>
            </motion.div>
          </div>
        </div>
      </motion.main>

      {/* Footer */}
      <footer className="w-full py-12 border-t border-white/5 bg-[#0d0d0d]/50 backdrop-blur-md mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Cpu size={16} />
              </div>
              <span className="font-black tracking-tighter text-xl">GOLEM AI</span>
            </div>
            <p className="text-zinc-600 text-sm font-medium">Crafting the future of human-AI collaboration.</p>
          </div>
          
          <div className="flex gap-12 text-zinc-500 font-bold text-xs uppercase tracking-widest">
            <button onClick={handleScrollToFeatures} className="hover:text-white transition-colors">Showcase</button>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>

          <div className="text-zinc-500 text-sm font-bold">
            © 2024 Developed by <span className="text-white hover:text-blue-400 cursor-pointer transition-colors">Stoky</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, desc: string, delay: number }> = ({ icon, title, desc, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.8 }}
    whileHover={{ y: -8 }}
    className="glass p-10 rounded-[2.5rem] group hover:border-blue-500/30 transition-all duration-500 text-left h-full flex flex-col shadow-xl hover:shadow-blue-500/10 relative overflow-hidden"
  >
    <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-600/5 blur-2xl group-hover:bg-blue-600/10 transition-all duration-700" />
    <div className="mb-8 bg-white/5 w-16 h-16 flex items-center justify-center rounded-2xl border border-white/5 group-hover:scale-110 group-hover:bg-blue-600/10 group-hover:border-blue-500/30 transition-all duration-500">
      {icon}
    </div>
    <h3 className="text-2xl font-black mb-4 tracking-tight">{title}</h3>
    <p className="text-zinc-500 leading-relaxed font-medium text-[15px]">{desc}</p>
  </motion.div>
);

export default LandingPage;
