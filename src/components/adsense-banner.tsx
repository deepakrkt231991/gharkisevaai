'use client';
import { useEffect } from 'react';

type AdsenseBannerProps = {
    adSlot: string;
    adFormat?: string;
    className?: string;
};

const AdsenseBanner = ({ adSlot, adFormat = 'auto', className }: AdsenseBannerProps) => {
    useEffect(() => {
        try {
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } catch (err) {
            console.error('Adsense Error:', err);
        }
    }, [adSlot]); // Re-run when adSlot changes

    return (
        <div className={className}>
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-4493898466896244"
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-full-width-responsive="true"
            ></ins>
        </div>
    );
};
export default AdsenseBanner;
