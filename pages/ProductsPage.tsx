import React from 'react';

const ProductsPage: React.FC = () => {
  
  // Nutrition data is identical for all current flavors
  const nutritionData = [
    ['Energy', '39.82 kcal'],
    ['Total Carbohydrates', '9.82 g'],
    ['Sugar', '8.99 g'],
    ['Protein', '0.12 g'],
    ['Total Lipid', '0.01 g'],
    ['Total Fat', '0.05 g'],
    ['Fiber', '0.01 g'],
    ['Taurine', '400 mg'],
    ['Caffeine', '32 mg']
  ];

  return (
    <div className="flex flex-col items-center">
      <main className="w-full max-w-[1200px] px-6 py-12">
        
        {/* --- Section 1: Cha-bon Series --- */}
        <section className="mb-32 border-b border-slate-200/50 pb-24">
            {/* Hero Title */}
            <div className="mb-20 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-background-light shadow-clay-inset text-primary rounded-full mb-6">
                <span className="material-symbols-outlined text-sm">water_drop</span>
                <span className="text-xs font-black uppercase tracking-widest">Cha-bon Series</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-slate-800 mb-6 tracking-tight">Sweet Rice <br/> Energy Drink.</h2>
            <p className="text-text-muted text-xl max-w-2xl leading-relaxed md:ml-1">
                Experience the "Original Manipuri Taste" with our Cha-bon series. Formulated with indigenous Chak-hao (Black Rice) and Angouba rice, enriched with Taurine and Caffeine for that extra boost.
            </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            
            {/* Product Card 1: Chak-hao Natural */}
            <div className="bg-background-light shadow-clay rounded-[2.5rem] p-8 flex flex-col transition-all duration-300 hover:shadow-clay-lg hover:-translate-y-2 border border-white/50 group">
                <div className="shadow-clay-inset rounded-[2rem] overflow-hidden mb-8 aspect-[3/4] p-4 bg-background-light relative">
                <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative">
                    <img 
                        src="https://raw.githubusercontent.com/h4444n55555/images/refs/heads/main/chak.jpeg"
                        alt="Chak-hao Natural Flavour"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-purple-900/10 mix-blend-multiply rounded-[1.5rem] pointer-events-none"></div>
                </div>
                </div>
                <div className="flex-grow space-y-4">
                <h3 className="text-2xl font-bold text-slate-800">Chak-hao Natural Flavour</h3>
                <p className="text-text-muted text-sm leading-relaxed">
                    The signature sweet rice energy drink made from indigenous Black Rice. 
                </p>
                </div>
            </div>

            {/* Product Card 2: Cinnamon */}
            <div className="bg-background-light shadow-clay rounded-[2.5rem] p-8 flex flex-col transition-all duration-300 hover:shadow-clay-lg hover:-translate-y-2 border border-white/50 group">
                <div className="shadow-clay-inset rounded-[2rem] overflow-hidden mb-8 aspect-[3/4] p-4 bg-background-light relative">
                <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative">
                    <img 
                        src="https://raw.githubusercontent.com/h4444n55555/images/refs/heads/main/cinn.jpeg"
                        alt="Chak-hao with Cinnamon"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-orange-900/10 mix-blend-multiply rounded-[1.5rem] pointer-events-none"></div>
                </div>
                </div>
                <div className="flex-grow space-y-4">
                <h3 className="text-2xl font-bold text-slate-800">Chak-hao with Cinnamon</h3>
                <p className="text-text-muted text-sm leading-relaxed">
                    Infused with natural cinnamon for a warm, aromatic twist on the classic Chak-hao flavour.
                </p>
                </div>
            </div>

            {/* Product Card 3: Angouba */}
            <div className="bg-background-light shadow-clay rounded-[2.5rem] p-8 flex flex-col transition-all duration-300 hover:shadow-clay-lg hover:-translate-y-2 border border-white/50 group">
                <div className="shadow-clay-inset rounded-[2rem] overflow-hidden mb-8 aspect-[3/4] p-4 bg-background-light relative">
                <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative">
                    <img 
                        src="https://raw.githubusercontent.com/h4444n55555/images/refs/heads/main/white.jpeg"
                        alt="Angouba Flavour"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-yellow-100/20 mix-blend-multiply rounded-[1.5rem] pointer-events-none"></div>
                </div>
                </div>
                <div className="flex-grow space-y-4">
                <h3 className="text-2xl font-bold text-slate-800">Angouba Flavour</h3>
                <p className="text-text-muted text-sm leading-relaxed">
                    A refreshing white rice variant offering the distinct, clean taste of Angouba.
                </p>
                </div>
            </div>

            </div>

            {/* Product Specifications Section */}
            <div id="specifications" className="mt-24">
            <div className="bg-background-light shadow-clay rounded-[3rem] p-10 md:p-16 border border-white/50 relative overflow-hidden">
                {/* Decorative blob */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/40 to-transparent rounded-bl-[10rem] pointer-events-none"></div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
                
                {/* Nutrition Facts */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4 mb-2">
                    <div className="h-12 w-12 rounded-xl bg-background-light shadow-clay-inset flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">nutrition</span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-800">Nutrition Facts</h2>
                    </div>

                    <div className="space-y-2">
                    <p className="text-text-muted font-medium">Per 100g Serving</p>
                    </div>
                    
                    <div className="bg-background-light rounded-[2.5rem] p-8 shadow-clay-inset border border-slate-100 min-h-[400px]">
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="text-left border-b border-slate-200">
                            <th className="pb-4 pl-4 font-black text-slate-800 uppercase tracking-wider text-xs">Parameter</th>
                            <th className="pb-4 font-black text-slate-800 uppercase tracking-wider text-xs text-right pr-4">Value</th>
                        </tr>
                        </thead>
                        <tbody className="text-base">
                        {nutritionData.map(([label, value], idx) => (
                            <tr key={label} className={`group hover:bg-white/40 transition-colors ${idx !== nutritionData.length - 1 ? 'border-b border-slate-200/50' : ''}`}>
                            <td className="py-3 pl-4 text-text-muted font-medium">{label}</td>
                            <td className="py-3 pr-4 font-bold text-slate-700 text-right">{value}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                    
                    <div className="bg-blue-50 text-blue-800 p-6 rounded-2xl border border-blue-100 text-sm font-medium leading-relaxed">
                    <p className="mb-2"><span className="font-bold">Net Content:</span> 250 ml</p>
                    <p><span className="font-bold">Reference intake:</span> 2000 kcal per day (Adult)</p>
                    </div>
                </div>
                
                {/* Manufacturer & Regulatory */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4 mb-2">
                    <div className="h-12 w-12 rounded-xl bg-background-light shadow-clay-inset flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">factory</span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-800">Manufacturing</h2>
                    </div>

                    {/* Company Card */}
                    <div className="p-8 shadow-clay-sm rounded-[2rem] bg-background-light border border-white/40 space-y-4">
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-text-muted mb-2">Manufactured & Sold By</h4>
                        <p className="text-lg font-bold text-slate-800 leading-snug">Kshetri Industries Pvt. Ltd.</p>
                    </div>
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-text-muted mb-2">Address</h4>
                        <p className="text-slate-600 font-medium leading-relaxed">
                        Kongba Bazar, near Bank of Baroda<br/>
                        Imphal East, Manipur — 795005<br/>
                        India
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200/50">
                        <div>
                        <span className="block text-xs font-bold text-text-muted uppercase mb-1">FSSAI Lic. No.</span>
                        <span className="text-slate-800 font-mono font-medium">21624002000327</span>
                        </div>
                        <div>
                        <span className="block text-xs font-bold text-text-muted uppercase mb-1">Website</span>
                        <a href="http://www.kshetriindustries.com" target="_blank" rel="noreferrer" className="text-primary font-medium hover:underline">kshetriindustries.com</a>
                        </div>
                    </div>
                    <div>
                        <span className="block text-xs font-bold text-text-muted uppercase mb-1">Email</span>
                        <p className="text-slate-600 font-medium text-sm">ktsingh27@gmail.com</p>
                        <p className="text-slate-600 font-medium text-sm">tojokshetrimayum@gmail.com</p>
                    </div>
                    </div>

                    {/* Price & Date Card */}
                    <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 shadow-clay-sm rounded-[2rem] bg-background-light border border-white/40">
                        <h4 className="text-xs font-black uppercase tracking-widest text-text-muted mb-2">MRP</h4>
                        <p className="text-3xl font-black text-primary">₹150</p>
                        <p className="text-xs text-text-muted mt-1">(Incl. of all taxes)</p>
                    </div>
                    <div className="p-6 shadow-clay-sm rounded-[2rem] bg-background-light border border-white/40 flex flex-col justify-between">
                        <div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-text-muted mb-1">Mfg Date</h4>
                            <p className="text-base font-bold text-slate-800">18/02/2026</p>
                        </div>
                        <div className="mt-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-text-muted mb-1">Shelf Life</h4>
                            <p className="text-base font-bold text-slate-800">6 Months</p>
                        </div>
                    </div>
                    </div>

                    {/* Warnings / Instructions */}
                    <div className="p-6 shadow-clay-inset rounded-[2rem] bg-red-50/50 border border-red-100">
                    <h4 className="text-sm font-bold text-red-800 mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">warning</span>
                        Warnings & Instructions
                    </h4>
                    <ul className="text-sm text-red-900/80 space-y-2 font-medium list-disc list-inside">
                        <li>Please don’t buy if the seal is broken or tampered.</li>
                        <li>Store in a cool place.</li>
                        <li>Refrigerate after opening.</li>
                        <li>Consume immediately after opening.</li>
                        <li>Not recommended for children or pregnant persons.</li>
                        <li>There will be sediments of rice extract.</li>
                        <li>Contains caffeine.</li>
                    </ul>
                    </div>

                </div>
                </div>
            </div>
            </div>
        </section>

        {/* --- Section 2: Rice Paper (New) --- */}
        <section className="mb-20">
             {/* Header */}
             <div className="mb-20 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-6 py-2 bg-background-light shadow-clay-inset text-primary rounded-full mb-6">
                  <span className="material-symbols-outlined text-sm">layers</span>
                  <span className="text-xs font-black uppercase tracking-widest">Rice Paper</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-black text-slate-800 mb-6 tracking-tight">Artisan <br/> Rice Paper.</h2>
                <p className="text-text-muted text-xl max-w-3xl leading-relaxed md:ml-1">
                  Our rice paper is crafted from <span className="text-slate-800 font-bold">Chak-hao Angouba</span> (sweet white rice), a glutinous variety known as the "pride of Manipuri people" for its exceptional taste, aroma, and traditional medicinal uses in maternal health and healing.
                </p>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Product Card: Rice Paper (Left column on large screens) */}
                <div className="lg:col-span-5">
                    <div className="bg-background-light shadow-clay rounded-[2.5rem] p-8 flex flex-col transition-all duration-300 hover:shadow-clay-lg hover:-translate-y-2 border border-white/50 group h-full">
                    <div className="shadow-clay-inset rounded-[2rem] overflow-hidden mb-8 aspect-[3/4] p-4 bg-background-light relative h-full">
                        <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative">
                        <img 
                            src="https://raw.githubusercontent.com/h4444n55555/images/refs/heads/main/rice.jpeg"
                            alt="Premium Rice Paper"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-slate-900/5 mix-blend-multiply rounded-[1.5rem] pointer-events-none"></div>
                        </div>
                    </div>
                    <div className="flex-grow space-y-4">
                        <h3 className="text-2xl font-bold text-slate-800">Premium Rice Paper</h3>
                        <p className="text-text-muted text-sm leading-relaxed">
                        A unique, natural foundation for your culinary creations.
                        </p>
                    </div>
                    </div>
                </div>

                {/* Features / Value Props (Right column) */}
                <div className="lg:col-span-7 space-y-8">
                     <div className="bg-background-light shadow-clay rounded-[3rem] p-8 md:p-12 border border-white/50">
                        <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">verified</span>
                            Core Value Proposition
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            <div className="p-6 rounded-2xl bg-background-light shadow-clay-inset border border-white/50">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="material-symbols-outlined text-green-600">eco</span>
                                    <h4 className="font-bold text-slate-800">Eco-Friendly</h4>
                                </div>
                                <p className="text-sm text-text-muted leading-relaxed">
                                    100% biodegradable and produced through a carbon-neutral process.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-background-light shadow-clay-inset border border-white/50">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="material-symbols-outlined text-amber-600">diamond</span>
                                    <h4 className="font-bold text-slate-800">Premium Quality</h4>
                                </div>
                                <p className="text-sm text-text-muted leading-relaxed">
                                    Durable, versatile, and free of artificial additives.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-background-light shadow-clay-inset border border-white/50">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="material-symbols-outlined text-red-500">health_and_safety</span>
                                    <h4 className="font-bold text-slate-800">Healthy & Safe</h4>
                                </div>
                                <p className="text-sm text-text-muted leading-relaxed">
                                    Naturally gluten-free and allergen-friendly, offering a "worry-free choice" for consumers.
                                </p>
                            </div>

                             <div className="p-6 rounded-2xl bg-background-light shadow-clay-inset border border-white/50">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="material-symbols-outlined text-purple-600">temple_buddhist</span>
                                    <h4 className="font-bold text-slate-800">Authentic Experience</h4>
                                </div>
                                <p className="text-sm text-text-muted leading-relaxed">
                                    Providing a "Taste of Asia in Every Bite."
                                </p>
                            </div>
                            
                            <div className="md:col-span-2 p-6 rounded-2xl bg-blue-50/50 border border-blue-100 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="material-symbols-outlined text-blue-600">inventory_2</span>
                                    <h4 className="font-bold text-slate-800">Transparent Packaging (B2B)</h4>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Bulk orders available in transparent packaging for easy inspection, storage, and commercial use.
                                </p>
                            </div>

                        </div>
                     </div>
                </div>

             </div>
        </section>

      </main>
    </div>
  );
};

export default ProductsPage;