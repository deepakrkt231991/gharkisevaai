"use client";
import { QRCodeSVG } from 'qrcode.react';

export function ShareKit() {
  // आपकी असली वेबसाइट का लिंक
  const appUrl = "https://gharkisevaai.vercel.app"; 

  return (
    <div className="bg-gradient-to-br from-slate-900 to-black p-8 rounded-[3rem] border border-white/10 shadow-2xl max-w-sm mx-auto">
      <div className="flex flex-col items-center text-center space-y-6">
        
        {/* QR Code Section */}
        <div className="bg-white p-4 rounded-[2.5rem] shadow-[0_0_50px_rgba(59,130,246,0.5)]">
          <QRCodeSVG 
            value={appUrl} 
            size={200} 
            level="H" 
            includeMargin={true}
            imageSettings={{
              src: "/logo.png", // अगर लोगो है तो, वरना इसे हटा दें
              x: undefined,
              y: undefined,
              height: 40,
              width: 40,
              excavate: true,
            }}
          />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-black italic text-white tracking-tighter uppercase">SCAN TO OPEN APP</h2>
          <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em]">Open in Chrome or Mobile Browser</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-3 w-full">
          <button 
            onClick={() => window.open(`https://wa.me/?text=Ghar Ki Sevaai: Book Workers and AI Interior Analysis here: ${appUrl}`)}
            className="bg-[#25D366] text-white rounded-2xl h-14 font-black uppercase text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
          >
            Share on WhatsApp
          </button>
          
          <button 
            onClick={() => {
              navigator.clipboard.writeText(appUrl);
              alert("Link Copied! Now share it anywhere.");
            }}
            className="bg-white text-black rounded-2xl h-14 font-black uppercase text-xs shadow-lg active:scale-95 transition-all"
          >
            Copy App Link
          </button>
        </div>

        <p className="text-[9px] text-slate-500 font-bold uppercase">
          Build for India 🇮🇳 | Home Services AI
        </p>
      </div>
    </div>
  );
}
