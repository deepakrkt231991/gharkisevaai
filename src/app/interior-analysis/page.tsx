import { BottomNavBar } from '@/components/bottom-nav-bar';

export default function InteriorAnalysisPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <main className="flex-1 p-6 pb-24">
        <div className="max-w-md mx-auto space-y-6">
          
          <div className="bg-blue-600 rounded-3xl p-6 text-white text-center shadow-lg">
            <h1 className="text-xl font-black italic">GHARKISEVA AI</h1>
            <p className="text-xs opacity-90 mt-1">📍 Mumbai Active</p>
          </div>

          <div className="bg-white border-4 border-dashed border-blue-200 rounded-[40px] p-10 text-center shadow-sm">
            <div className="w-16 h-16 bg-blue-50 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">📸</div>
            <h2 className="text-lg font-bold text-slate-800">Upload Photo</h2>
            <p className="text-[10px] text-slate-500 mt-2 uppercase font-bold tracking-widest">Walls • Floors • Analysis</p>
          </div>

          <div className="bg-white rounded-[30px] p-6 shadow-md border border-slate-100 space-y-4">
            <h3 className="text-sm font-black text-slate-700 border-b pb-2">AI STATUS: READY ✅</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our AI is ready to detect seepage, cracks, and suggest realistic repair costs in Mumbai.
            </p>
          </div>
          
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNavBar />
      </div>
    </div>
  );
}
