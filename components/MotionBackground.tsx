import React from 'react';

const MotionBackground: React.FC = () => {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-lumina-dark">
            {/* Animated Gradient Orbs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-lumina-primary rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-lumina-secondary rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-lumina-accent rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            
            {/* Grid Overlay for Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            
            {/* Moving Gradient Mesh */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black opacity-60"></div>
        </div>
    );
};

export default MotionBackground;
