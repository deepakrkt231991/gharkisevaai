
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
        <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="90" cy="90" r="90" fill="url(#paint0_linear_1_2)"/>
            <circle cx="90" cy="90" r="80" fill="white"/>
            <path d="M90 156.429C126.6 156.429 156.429 126.6 156.429 90C156.429 53.4 126.6 23.5714 90 23.5714C53.4 23.5714 23.5714 53.4 23.5714 90C23.5714 126.6 53.4 156.429 90 156.429Z" fill="url(#paint1_linear_1_2)"/>
            <path d="M141.671 78.4114L130.413 67.1537L120.932 76.635L118.847 74.5502L132.498 60.9L136.671 65.0732L141.671 78.4114Z" fill="url(#paint2_linear_1_2)"/>
            <path d="M38.3285 78.4114L49.5862 67.1537L59.0675 76.635L61.1523 74.5502L47.5011 60.9L43.328 65.0732L38.3285 78.4114Z" fill="url(#paint3_linear_1_2)"/>
            <path d="M136.671 65.0734L118.847 74.5504L90.2143 49.5002L61.1523 74.5504L43.328 65.0734L90.2143 23.5716L136.671 65.0734Z" fill="url(#paint4_linear_1_2)"/>
            <path d="M120.932 76.6352L130.413 67.1539L124.965 67.1539L116.762 75.3565L120.932 76.6352Z" fill="white"/>
            <path d="M59.0676 76.6352L49.5863 67.1539L55.0343 67.1539L63.2371 75.3565L59.0676 76.6352Z" fill="white"/>
            <path d="M118.847 74.5502L116.762 75.3565L90.2143 52.364L63.2371 75.3565L61.1523 74.5502L90.2143 49.5001L118.847 74.5502Z" fill="white"/>
            <path d="M128.571 137.143V85.7143H51.4284V137.143H128.571Z" fill="url(#paint5_linear_1_2)"/>
            <path d="M96.4285 96.4286H115.714V115.714H96.4285V96.4286Z" fill="white"/>
            <path d="M64.2857 96.4286H83.5714V115.714H64.2857V96.4286Z" fill="white"/>
            <path d="M102.857 128.571H77.1428C74.002 128.571 71.4285 125.998 71.4285 122.857V113.571C71.4285 110.43 74.002 107.857 77.1428 107.857H102.857C105.998 107.857 108.571 110.43 108.571 113.571V122.857C108.571 125.998 105.998 128.571 102.857 128.571Z" fill="url(#paint6_linear_1_2)"/>
            <path d="M83.5714 107.857C83.5714 104.282 86.4528 101.429 90 101.429C93.5472 101.429 96.4286 104.282 96.4286 107.857" stroke="url(#paint7_linear_1_2)" strokeWidth="4"/>
            <text fill="url(#paint8_linear_1_2)" xmlSpace="preserve" style={{whiteSpace: "pre"}} fontFamily="Manrope" fontSize="24" fontWeight="800" letterSpacing="0em"><tspan x="28.1875" y="152.895">Ghar Ki Seva</tspan></text>
            <defs>
                <linearGradient id="paint0_linear_1_2" x1="0" y1="0" x2="180" y2="180" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00D4D4"/>
                    <stop offset="1" stopColor="#006970"/>
                </linearGradient>
                <linearGradient id="paint1_linear_1_2" x1="23.5714" y1="23.5714" x2="156.429" y2="156.429" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00A0A0"/>
                    <stop offset="1" stopColor="#005F63"/>
                </linearGradient>
                <linearGradient id="paint2_linear_1_2" x1="118.847" y1="60.9" x2="141.671" y2="78.4114" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00D4D4"/>
                    <stop offset="1" stopColor="#006970"/>
                </linearGradient>
                <linearGradient id="paint3_linear_1_2" x1="38.3285" y1="60.9" x2="61.1523" y2="78.4114" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00D4D4"/>
                    <stop offset="1" stopColor="#006970"/>
                </linearGradient>
                <linearGradient id="paint4_linear_1_2" x1="43.328" y1="23.5716" x2="136.671" y2="74.5504" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00D4D4"/>
                    <stop offset="1" stopColor="#006970"/>
                </linearGradient>
                <linearGradient id="paint5_linear_1_2" x1="51.4284" y1="85.7143" x2="128.571" y2="137.143" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#008B8B"/>
                    <stop offset="1" stopColor="#005F63"/>
                </linearGradient>
                <linearGradient id="paint6_linear_1_2" x1="71.4285" y1="107.857" x2="108.571" y2="128.571" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00D4D4"/>
                    <stop offset="1" stopColor="#006970"/>
                </linearGradient>
                <linearGradient id="paint7_linear_1_2" x1="83.5714" y1="101.429" x2="96.4286" y2="107.857" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00D4D4"/>
                    <stop offset="1" stopColor="#006970"/>
                </linearGradient>
                <linearGradient id="paint8_linear_1_2" x1="28.1875" y1="140" x2="151.78" y2="152.895" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#008B8B"/>
                    <stop offset="1" stopColor="#005F63"/>
                </linearGradient>
            </defs>
        </svg>
    </div>
  );
}
