import React, { useState } from 'react';
import MotionBackground from './components/MotionBackground';
import Notebook from './components/Notebook';
import { generateNotes } from './services/geminiService';
import { NoteRequest, AppState } from './types';
import { Sparkles, ArrowRight, Loader2, Search, GraduationCap, Zap, ArrowLeft, Layers, Globe, Command } from 'lucide-react';

// --- Subcomponents for App Structure ---

const HeroSection = ({ onStart }: { onStart: () => void }) => (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center px-6 animate-fade-in-up">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-[0_0_15px_-3px_rgba(255,255,255,0.05)] backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-teal-400 animate-pulse"></span>
            <span className="text-xs font-medium text-gray-300 tracking-wide uppercase">AI 2.0 Now Live</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 relative z-10">
            Intelligent Notes <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-white">
                Reimagined.
            </span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 font-light leading-relaxed tracking-wide">
            Transform complex topics into perfectly structured, academic-grade study materials instantly. 
            The new standard for modern learning.
        </p>

        {/* CTA Button */}
        <button 
            onClick={onStart}
            className="group relative px-10 py-4 rounded-full bg-white text-black font-semibold text-base transition-all duration-300 hover:scale-[1.02] shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_-5px_rgba(255,255,255,0.4)]"
        >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-200 via-white to-pink-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg"></div>
            <span className="relative z-10 flex items-center gap-2">
                Generate Notes <ArrowRight size={18} className="text-gray-900 group-hover:translate-x-1 transition-transform"/>
            </span>
        </button>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 w-full max-w-5xl">
            {[
                { icon: <Layers className="text-violet-400" />, title: "Structured Depth", desc: "Auto-organized hierarchy" },
                { icon: <Globe className="text-teal-400" />, title: "Polyglot Core", desc: "Native English & Bengali" },
                { icon: <Command className="text-pink-400" />, title: "Smart Context", desc: "Adaptive grade levels" }
            ].map((feature, idx) => (
                <div key={idx} className="group p-6 rounded-2xl bg-lumina-surface/40 border border-lumina-border hover:border-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-lumina-surface/60 cursor-default">
                    <div className="mb-4 w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                    </div>
                    <h3 className="text-base font-semibold text-gray-200 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-500">{feature.desc}</p>
                </div>
            ))}
        </div>
    </div>
);

const GeneratorForm = ({ 
    onSubmit, 
    onBack, 
    isLoading 
}: { 
    onSubmit: (req: NoteRequest) => void; 
    onBack: () => void;
    isLoading: boolean;
}) => {
    const [topic, setTopic] = useState('');
    const [grade, setGrade] = useState('');
    const [language, setLanguage] = useState<'English' | 'Bengali'>('English');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (topic && grade && !isLoading) {
            onSubmit({ topic, grade, language });
        }
    };

    const suggestedGrades = ["Class 12", "Undergraduate", "UPSC", "Professional"];

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 animate-fade-in-up z-20">
            {/* Glass Panel Container */}
            <div className="relative w-full max-w-[520px]">
                
                {/* Back Button */}
                {!isLoading && (
                    <button 
                        onClick={onBack}
                        className="absolute -left-16 top-0 hidden md:flex p-3 rounded-full text-gray-500 hover:text-white hover:bg-white/5 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                )}

                <div className="bg-[#0F1115]/60 backdrop-blur-2xl border border-white/10 rounded-[24px] p-8 md:p-10 shadow-2xl ring-1 ring-white/5 relative overflow-hidden">
                    
                    {/* Header */}
                    <div className="mb-10 text-center relative z-10">
                        <div className="w-12 h-12 mx-auto bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-xl flex items-center justify-center border border-white/10 mb-4 shadow-[0_0_20px_-5px_rgba(168,85,247,0.3)]">
                            <Sparkles className="text-violet-300" size={20} />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Configure Session</h2>
                        <p className="text-gray-500 text-sm mt-2">Define parameters for your generated notes.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                        {/* Wrapper for Inputs */}
                        <div className={`space-y-6 transition-all duration-500 ${isLoading ? 'opacity-20 blur-sm pointer-events-none' : ''}`}>
                            
                            {/* Topic Input */}
                            <div className="space-y-2 group">
                                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest pl-1">Topic</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-violet-400 transition-colors">
                                        <Search size={16} />
                                    </div>
                                    <input 
                                        type="text" 
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="e.g. Quantum Mechanics"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 focus:ring-4 focus:ring-violet-500/10 transition-all"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Standard / Level Input */}
                            <div className="space-y-2 group">
                                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest pl-1">Complexity</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-pink-400 transition-colors">
                                        <GraduationCap size={16} />
                                    </div>
                                    <input
                                        type="text"
                                        list="grade-levels"
                                        value={grade}
                                        onChange={(e) => setGrade(e.target.value)}
                                        placeholder="e.g. Undergraduate, Beginner..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-pink-500/50 focus:bg-white/10 focus:ring-4 focus:ring-pink-500/10 transition-all"
                                        required
                                        disabled={isLoading}
                                    />
                                    <datalist id="grade-levels">
                                        <option value="Class 12" />
                                        <option value="Undergraduate" />
                                        <option value="Postgraduate" />
                                        <option value="UPSC" />
                                        <option value="Professional" />
                                    </datalist>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {suggestedGrades.map((g) => (
                                        <button
                                            key={g}
                                            type="button"
                                            onClick={() => setGrade(g)}
                                            className="text-[10px] font-medium px-2 py-1 rounded-md bg-white/5 border border-white/5 text-gray-500 hover:text-gray-300 hover:bg-white/10 transition-all"
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Language Toggle */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest pl-1">Language</label>
                                <div className="bg-black/40 p-1 rounded-xl border border-white/10 flex relative">
                                    <div 
                                        className={`absolute h-[calc(100%-0.5rem)] w-[calc(50%-0.25rem)] top-1 bg-gray-700/80 rounded-lg shadow-sm transition-all duration-300 ease-out border border-white/10 ${language === 'Bengali' ? 'left-[calc(50%+0.125rem)]' : 'left-1'}`} 
                                    ></div>
                                    
                                    <button
                                        type="button"
                                        onClick={() => setLanguage('English')}
                                        className={`relative flex-1 py-2 text-xs font-medium rounded-lg transition-colors z-10 ${language === 'English' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                    >
                                        English
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setLanguage('Bengali')}
                                        className={`relative flex-1 py-2 text-xs font-medium rounded-lg transition-colors z-10 ${language === 'Bengali' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                    >
                                        Bengali
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Loading Overlay */}
                        {isLoading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-30 animate-fade-in-up">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-violet-500/30 blur-2xl rounded-full"></div>
                                    <div className="bg-black/80 p-4 rounded-2xl border border-white/10 shadow-xl relative backdrop-blur-md">
                                        <Loader2 className="text-violet-400 animate-spin" size={24} />
                                    </div>
                                </div>
                                <div className="mt-4 text-center">
                                    <h3 className="text-sm font-semibold text-white tracking-wide">Synthesizing Notes</h3>
                                    <p className="text-xs text-gray-500 mt-1">This may take a moment</p>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className={`w-full relative overflow-hidden rounded-xl group transition-all duration-300 ${isLoading ? 'opacity-0 cursor-default' : 'hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.4)]'}`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 transition-transform duration-500 group-hover:scale-105"></div>
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            
                            <div className="relative px-6 py-4 flex items-center justify-center gap-2 text-white font-semibold text-sm tracking-wide">
                                <Zap size={16} className="fill-white/90" />
                                <span>Generate Notes</span>
                            </div>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// --- Main App Component ---

const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState>(AppState.HOME);
    const [noteRequest, setNoteRequest] = useState<NoteRequest | null>(null);
    const [generatedContent, setGeneratedContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const handleStart = () => {
        setAppState(AppState.GENERATING);
    };

    const handleGenerate = async (request: NoteRequest) => {
        setNoteRequest(request);
        setIsLoading(true);
        
        try {
            const content = await generateNotes(request);
            setGeneratedContent(content);
            setAppState(AppState.RESULT);
        } catch (error) {
            alert("Connection interrupted. Please verify API key.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen text-gray-200 font-sans selection:bg-violet-500/30 selection:text-violet-200 overflow-x-hidden">
            <MotionBackground />
            
            {/* Minimal Nav */}
            <nav className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-40 pointer-events-none print:hidden">
                <div 
                    className={`flex items-center gap-3 pointer-events-auto transition-all duration-300 ${appState !== AppState.HOME ? 'opacity-100' : 'opacity-100'}`}
                    onClick={() => !isLoading && setAppState(AppState.HOME)}
                >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20 cursor-pointer hover:opacity-90 transition-opacity">
                        <span className="font-bold text-white text-lg">L</span>
                    </div>
                    <span className="font-medium text-white/90 tracking-tight text-lg cursor-pointer hidden md:block">Lumina</span>
                </div>
            </nav>

            <main className="relative z-10 pt-20 pb-10 min-h-screen flex flex-col">
                {appState === AppState.HOME && (
                    <HeroSection onStart={handleStart} />
                )}

                {appState === AppState.GENERATING && (
                    <GeneratorForm 
                        onSubmit={handleGenerate} 
                        onBack={() => setAppState(AppState.HOME)}
                        isLoading={isLoading} 
                    />
                )}

                {appState === AppState.RESULT && (
                    <Notebook 
                        content={generatedContent} 
                        topic={noteRequest?.topic || 'Untitled'} 
                        onBack={() => setAppState(AppState.GENERATING)}
                    />
                )}
            </main>
        </div>
    );
};

export default App;