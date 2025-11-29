import React from 'react';

const MotionBackground: React.FC = () => {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-lumina-bg print:hidden">
            {/* Ambient Aurora Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] bg-violet-900/20 rounded-full blur-[120px] animate-aurora mix-blend-screen"></div>
            <div className="absolute top-[20%] right-[-20%] w-[60vw] h-[60vw] bg-fuchsia-900/10 rounded-full blur-[100px] animate-aurora animation-delay-2000 mix-blend-screen"></div>
            <div className="absolute bottom-[-20%] left-[20%] w-[70vw] h-[70vw] bg-teal-900/10 rounded-full blur-[120px] animate-aurora animation-delay-4000 mix-blend-screen"></div>
            
            {/* Subtle Grain Texture for material feel */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ 
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
            }}></div>
            
            {/* Vignette */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-lumina-bg/90"></div>
        </div>
    );
};

export default MotionBackground;