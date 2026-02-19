import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClayCard } from '../components/ClayCard';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 px-6 md:px-12 lg:px-24 space-y-24 pb-24">
        
        {/* Hero Section */}
        <section className="relative pt-16">
          <div className="bg-background-light shadow-clay rounded-[3rem] p-8 md:p-20 flex flex-col items-center text-center gap-10 border border-white/60">
            <h1 className="max-w-4xl text-5xl font-black leading-tight text-slate-800 md:text-7xl tracking-tight drop-shadow-sm">
              From Our Soil to <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">Global Success</span>
            </h1>
            <p className="max-w-2xl text-xl text-text-muted font-medium leading-relaxed">
              Kshetri Industries Pvt. Ltd. is dedicated to transforming Northeast India's rich
              agricultural resources into world-class functional beverages and value-added products.
            </p>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center scroll-mt-32">
          <div className="relative group p-4">
            {/* Image Frame - Clay Style - Auto Height to fit full image */}
            <div className="rounded-[2.5rem] bg-background-light shadow-clay p-4 border border-white/50 transition-transform duration-700 hover:scale-[1.02]">
              <div className="overflow-hidden rounded-[2rem] shadow-clay-inset relative">
                <img 
                  src="https://raw.githubusercontent.com/h4444n55555/images/refs/heads/main/WhatsApp%20Image%202026-02-18%20at%208.54.51%20PM.jpg" 
                  alt="Premium Chak-hao (Black Rice) harvest" 
                  className="w-full h-auto object-contain block group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-slate-800 md:text-5xl leading-tight">
              About Our Company
            </h2>
            <p className="text-lg leading-loose text-text-muted font-medium">
              Kshetri Industries Pvt. Ltd., incorporated in 2025, is a forward-looking food and beverage company founded by Mr. Kshetrimayum Tojo Singh and co-founded by Mr. Nongmaithem Hans Nathanael Gabil Momin. With over six years of hands-on industry experience, the company formalizes earlier entrepreneurial efforts into a compliant private limited structure focused on sustainable growth.
            </p>
            <p className="text-lg leading-loose text-text-muted font-medium">
              We develop value-added, functional products using indigenous raw materials from Northeast India, with capabilities in formulation, sourcing, pilot processing, and regulatory compliance. Our team has completed multiple pilot formulations and preliminary compliance groundwork, ensuring readiness for controlled commercialization and scalable growth.
            </p>
            
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="shadow-clay-btn bg-background-light p-6 rounded-3xl border border-white/40 hover:-translate-y-1 transition-transform">
                <div className="h-10 w-10 rounded-xl bg-background-light shadow-clay-inset flex items-center justify-center mb-4 text-primary">
                   <span className="material-symbols-outlined">history_edu</span>
                </div>
                <p className="text-slate-800 font-bold text-lg">Structured Growth</p>
                <p className="text-sm text-text-muted mt-1">Formalized private limited structure</p>
              </div>
              <div className="shadow-clay-btn bg-background-light p-6 rounded-3xl border border-white/40 hover:-translate-y-1 transition-transform">
                <div className="h-10 w-10 rounded-xl bg-background-light shadow-clay-inset flex items-center justify-center mb-4 text-primary">
                   <span className="material-symbols-outlined">science</span>
                </div>
                <p className="text-slate-800 font-bold text-lg">R&D Focus</p>
                <p className="text-sm text-text-muted mt-1">Pilot-scale processing & formulation</p>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Section */}
        <section className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black text-slate-800 md:text-4xl">Our Leadership</h2>
            <p className="text-text-muted font-medium text-lg">The visionaries behind our mission</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* Founder */}
            <ClayCard className="p-12 flex flex-col items-center text-center transition-all duration-500 hover:shadow-clay-lg hover:-translate-y-2">
              <div className="w-64 h-80 rounded-[2.5rem] bg-background-light shadow-clay-inset p-4 mb-8 mx-auto">
                <img 
                  alt="Founder" 
                  className="w-full h-full rounded-[2rem] object-cover shadow-sm"
                  src="https://raw.githubusercontent.com/h4444n55555/images/refs/heads/main/tojo.jpg" 
                />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Kshetrimayum Tojo Singh</h3>
              <p className="text-primary font-bold mb-6 text-sm uppercase tracking-widest bg-background-light shadow-clay-sm px-4 py-2 rounded-full mt-2">Founder</p>
              
              <blockquote className="text-lg font-bold text-slate-700 italic mb-6">"NEVER GIVE IN, NEVER GIVE UP."</blockquote>
              
              <p className="text-text-muted text-sm leading-relaxed">
                "I founded Kshetri Industries Pvt. Ltd. in 2025 as a structured evolution of my six years of hands-on experience in the food and beverage sector. Holding a Bachelor of Fine Arts (BFA), I approach product development with creativity and precision. My focus is on value-added and functional beverages developed from indigenous agricultural resources of Northeast India. I am committed to a measured, execution-driven growth strategy."
              </p>
            </ClayCard>
            
            {/* Co-Founder */}
            <ClayCard className="p-12 flex flex-col items-center text-center transition-all duration-500 hover:shadow-clay-lg hover:-translate-y-2">
              <div className="w-64 h-80 rounded-[2.5rem] bg-background-light shadow-clay-inset p-4 mb-8 mx-auto">
                <img 
                  alt="Co-Founder" 
                  className="w-full h-full rounded-[2rem] object-cover shadow-sm"
                  src="https://raw.githubusercontent.com/h4444n55555/images/refs/heads/main/hans.jpg" 
                />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Nongmaithem Hans Nathanael Gabil Momin</h3>
              <p className="text-primary font-bold mb-6 text-sm uppercase tracking-widest bg-background-light shadow-clay-sm px-4 py-2 rounded-full mt-2">Co-Founder</p>
              
              <blockquote className="text-lg font-bold text-slate-700 italic mb-6">"THE JOURNEY OF A THOUSAND MILES BEGINS WITH A SINGLE STEP."</blockquote>

              <p className="text-text-muted text-sm leading-relaxed">
                "Currently pursuing a B.Tech in Artificial Intelligence and Data Engineering at IIT Ropar. I contribute from a technology and systems perspective, building foundations in software systems, data architecture, and machine learning. My focus is on responsibly integrating structured systems to enhance efficiency, quality monitoring, and long-term scalability in our manufacturing operations."
              </p>
            </ClayCard>
          </div>
        </section>

        {/* CTA Section */}
        <section className="flex justify-center py-8">
            <button 
              onClick={() => {
                navigate('/products');
                window.scrollTo(0, 0);
              }}
              className="group relative px-10 py-5 bg-background-light rounded-2xl shadow-clay-btn hover:shadow-clay-lg hover:-translate-y-1 active:shadow-clay-inset active:translate-y-0 transition-all duration-300 flex items-center gap-4 border border-white/50"
            >
               <span className="text-xl font-black text-slate-800 group-hover:text-primary transition-colors">View Our Products</span>
               <div className="h-10 w-10 rounded-xl bg-background-light shadow-clay-inset flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">arrow_forward</span>
               </div>
            </button>
         </section>

      </main>
    </div>
  );
};

export default HomePage;