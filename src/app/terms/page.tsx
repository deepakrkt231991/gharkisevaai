import React, { Suspense } from 'react';
import ExploreClient from './ExploreClient'; // अगर आपके पास क्लाइंट कंपोनेंट अलग है

// यह मुख्य पेज है
export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div className="p-10 text-center">Loading Explore...</div>}>
        {/* यहाँ आपका एक्सप्लोर का कंटेंट आएगा */}
        <section className="p-4">
          <h1 className="text-xl font-bold">Services Explore</h1>
          <p>अपनी पसंद की सेवा चुनें</p>
        </section>
      </Suspense>
    </div>
  );
}