const fs = require('fs');
let c = fs.readFileSync('app/product/[id]/page.tsx', 'utf8');

// The corrupted lines use \r\n (CRLF)
const badSection = '                  >\r\n                  <div className="flex-1 h-px bg-zinc-100" />\r\n               </div>\r\n               <div className="grid grid-cols-3 gap-3">\r\n                  {["None", "Front", "Dual Side"].map((opt) => (\r\n                     <button key={opt} onClick={() => setImprint(opt)} className={`h-12 border rounded-lg text-[9px] font-semibold uppercase tracking-[0.2em] transition-all ${imprint === opt ? \'bg-[#1a4d2e] text-white border-[#1a4d2e] shadow-lg shadow-emerald-900/10\' : \'bg-white text-zinc-400 border-zinc-200 hover:border-zinc-400\'}`}>{opt}</button>\r\n                  ))}';

if (!c.includes(badSection)) {
  console.log('Section not found — checking raw content...');
  // Show actual content around line 338
  const lines = c.split('\n');
  console.log('Lines 337-345:');
  for (let i = 337; i <= 345; i++) console.log(i + ':', JSON.stringify(lines[i]));
  process.exit(1);
}

const goodSection = `                  >
                     <Image src={getSmartSrc(img)} alt={\`Unit Variant \${i + 1}\`} fill className="object-contain" unoptimized={true} />
                  </button>
                ))}
             </div>
          </div>

          {/* Column B: Configuration and Details */}
          <div className="space-y-12">
            <div className="space-y-4">
               <h1 className="text-2xl md:text-4xl font-semibold tracking-tight uppercase leading-[1.05] text-zinc-900">{product.name}</h1>
               <div className="flex items-center gap-5">
                 <span className="text-3xl font-semibold text-emerald-600 tracking-tighter">{formatPrice(product.price)}</span>
                 <div className="h-5 w-px bg-zinc-200" />
                 <span className="text-[9px] font-semibold text-zinc-400 uppercase tracking-[0.25em] bg-zinc-100 px-3 py-1 rounded-full">Verified Industrial Stock</span>
               </div>
            </div>

            <div className={\`p-5 rounded-xl border flex items-center gap-4 transition-all \${isMoqViolated ? 'bg-red-50/50 border-red-100' : 'bg-emerald-50/30 border-emerald-100'}\`}>
               <ShieldCheck className={\`w-5 h-5 \${isMoqViolated ? 'text-red-600' : 'text-emerald-600'}\`} />
               <span className={\`text-[10px] font-semibold uppercase tracking-[0.15em] \${isMoqViolated ? 'text-red-800' : 'text-emerald-800'}\`}>MOQ Protocol: 150 Pieces Required for production</span>
            </div>

            {/* Imprint Configuration */}
            <div className="space-y-6">
               <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Imprint Location</h3>
                  <div className="flex-1 h-px bg-zinc-100" />
               </div>
               <div className="grid grid-cols-3 gap-3">
                  {["None", "Front", "Dual Side"].map((opt) => (
                     <button key={opt} onClick={() => setImprint(opt)} className={\`h-12 border rounded-lg text-[9px] font-semibold uppercase tracking-[0.2em] transition-all \${imprint === opt ? 'bg-[#1a4d2e] text-white border-[#1a4d2e]' : 'bg-white text-zinc-400 border-zinc-200 hover:border-zinc-400'}\`}>{opt}</button>
                  ))}`;

c = c.replace(badSection, goodSection);
fs.writeFileSync('app/product/[id]/page.tsx', c);
console.log('SUCCESS: Product page patched!');
