import { BottomNavBar } from '@/components/bottom-nav-bar';

export default function InteriorAnalysisPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-24">
      <main className="flex-1 p-6">
        <div className="max-w-md mx-auto space-y-6">
          {/* Mumbai Badge */}
          <div className="bg-green-100 border border-green-200 rounded-2xl p-4 text-center">
            <p className="text-green-800 font-bold text-sm">📍 Mumbai Active: Andheri Painters Ready</p>
          </div>

          {/* Upload Box */}
          <div className="bg-white border-2 border-dashed border-blue-400 rounded-[40px] p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-blue-50 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">📸</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Upload Photo</h2>
            <p className="text-xs text-slate-500 mt-2">AI will analyze walls, floor, and items for realistic fixes.</p>
          </div>

          {/* Feature List */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">AI Scan Features:</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-slate-600">✅ Wall Seepage Detection</li>
              <li className="flex items-center gap-2 text-sm text-slate-600">✅ Flooring Material Analysis</li>
              <li className="flex items-center gap-2 text-sm text-slate-600">✅ Realistic Repair Estimates</li>
            </ul>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNavBar />
      </div>
    </div>
  );
}
