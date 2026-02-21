import dynamic from 'next/dynamic';

// BottomNavBar को dynamic तरीके से लोड करो (SSR बंद)
const BottomNavBar = dynamic(
  () => import('@/components/bottom-nav-bar'),
  { ssr: false }  // ← ये लाइन बहुत जरूरी! Vercel/static export के लिए
);

export default function InteriorAnalysisPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 p-6">
        <h1 className="text-4xl font-bold text-center mb-10 text-blue-800">
          AI Interior Analysis – Mumbai Ready
        </h1>

        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-10 text-center">
          <div className="text-7xl mb-6">📸</div>
          <h2 className="text-2xl font-semibold mb-4">Upload Room/Wall Photo</h2>
          <p className="text-gray-600 mb-8">
            AI will detect seepage, cracks, paint estimate & more (Andheri Service Active)
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full text-lg">
            Choose Photo
          </button>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNavBar />
      </div>
    </div>
  );
}