"use client";
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

export function ShareKit() {
  // 1. आपकी वेबसाइट का असली लिंक
  const webUrl = "https://gharkisevaai.vercel.app";
  
  // 2. आपके APK का लिंक (यह तभी काम करेगा जब आप gharkiseva.apk को public फोल्डर में डालेंगे)
  const apkDownloadUrl = "https://gharkisevaai.vercel.app/gharkiseva.apk"; 

  const handleWhatsAppShare = () => {
    const message = `Ghar Ki Sevaai AI: घर की मरम्मत और इंटीरियर एनालिसिस के लिए बेस्ट ऐप। अभी चेक करें: ${webUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(webUrl);
    alert("Link Copied! 🚀");
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-black to-blue-950 p-8 rounded-[3rem] border border-white/10 shadow-2xl max-w-sm mx-auto text-white">
      <div className="flex flex-col items-center text-center space-y-6">
        
        {/* Glowing QR Section */}
        <div className="bg-white p-5 rounded-[2.5rem] shadow-[0_0_50px_rgba(59,130,246,0.4)] transition-transform hover:scale-105">
          <QRCodeSVG 
            value={webUrl} 
            size={200} 
            level="H" 
            includeMargin={false}
          />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none">
            Ghar Ki Sevaai <span className="text-blue-500">AI</span>
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
            Scan to Open in Chrome 🌐
          </p>
        </div>

        {/* Multi-Action Buttons */}
        <div className="flex flex-col gap-3 w-full">
          
          {/* APK Download Button */}
          <button 
            onClick={() => window.open(apkDownloadUrl, '_blank')}
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl h-14 font-black uppercase text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
          >
            <span className="text-lg">📥</span> Download Android App (APK)
          </button>

          <div className="grid grid-cols-2 gap-2">
            {/* WhatsApp Button */}
            <button 
              onClick={handleWhatsAppShare}
              className="bg-[#25D366] text-white rounded-2xl h-12 font-black uppercase text-[10px] flex items-center justify-center gap-1 shadow-md active:scale-95 transition-all"
            >
              WhatsApp
            </button>
            
            {/* Copy Link Button */}
            <button 
              onClick={copyToClipboard}
              className="bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-2xl h-12 font-black uppercase text-[10px] shadow-md active:scale-95 transition-all"
            >
              Copy Link
            </button>
          </div>
        </div>

        <div className="pt-2">
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
            Open in Browser for AI Analysis 🏠
          </p>
          <p className="text-[8px] text-blue-400/50 mt-1 uppercase">Made for India 🇮🇳</p>
        </div>
      </div>
    </div>
  );
}