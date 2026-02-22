"use client";
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

const WhatsAppIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2"><title>WhatsApp</title><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52s-.67-.816-.923-1.123c-.253-.307-.508-.262-.67.025-.164.288-.67 1.164-.67 1.164s-.67.149-1.645.923c-.976.775-1.045 1.502-1.045 1.502s.508 1.645 1.645 2.52c1.138.875 2.596 1.943 3.846 1.943.347 0 .82-.025 1.123-.307.303-.282.67-1.164.67-1.164s-.05-.099-.124-.198c-.074-.099-.297-.149-.297-.149zM12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18.5c-4.687 0-8.5-3.813-8.5-8.5s3.813-8.5 8.5-8.5 8.5 3.813 8.5 8.5-3.813 8.5-8.5 8.5z" fill="currentColor"/></svg>
);

export function ShareKit() {
  const { toast } = useToast();
  const appUrl = "https://gharkisevaai.vercel.app";

  const handleWhatsAppShare = () => {
    const message = `Ghar Ki Seva AI: घर की मरम्मत और इंटीरियर एनालिसिस के लिए बेस्ट ऐप। अभी चेक करें: ${appUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(appUrl);
    toast({
      title: "Link Copied! 🚀",
      description: "You can now share the app link anywhere.",
    });
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-black to-blue-950 p-8 rounded-[3rem] border border-white/10 shadow-2xl max-w-sm mx-auto text-white">
      <div className="flex flex-col items-center text-center space-y-6">
        
        <div className="bg-white p-4 rounded-[2.5rem] shadow-[0_0_50px_rgba(59,130,246,0.5)]">
          <QRCodeSVG
            value={appUrl}
            size={200}
            level="H"
            includeMargin={true}
            imageSettings={{
              src: "/logo.png",
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

        <div className="flex flex-col gap-3 w-full">
          <Button 
            onClick={handleWhatsAppShare}
            className="bg-[#25D366] hover:bg-[#25D366]/90 text-white rounded-xl h-14 font-bold uppercase text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
          >
            <WhatsAppIcon />
            Share on WhatsApp
          </Button>
          
          <Button 
            onClick={copyToClipboard}
            variant="secondary"
            className="bg-white/10 text-white rounded-xl h-14 font-bold uppercase text-sm shadow-md active:scale-95 transition-all"
          >
            Copy App Link
          </Button>
        </div>

        <p className="text-[9px] text-slate-500 font-bold uppercase pt-2">
          Made for India 🇮🇳 | Home Services AI
        </p>
      </div>
    </div>
  );
}
