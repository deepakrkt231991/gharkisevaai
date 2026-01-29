import AdsenseBanner from './adsense-banner';

export const StickyBannerAd = () => {
    return (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md z-40 px-4 pointer-events-none">
             <div className="bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-lg pointer-events-auto">
                 <AdsenseBanner adSlot="2001427785" />
             </div>
        </div>
    );
};
