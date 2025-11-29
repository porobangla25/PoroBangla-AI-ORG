import React, { useState } from 'react';
import MotionBackground from './components/MotionBackground';
import Notebook from './components/Notebook';
import { generateNotes } from './services/geminiService';
import { NoteRequest, AppState } from './types';
import { Sparkles, BookOpen, BrainCircuit, Globe, ArrowRight, Loader2, PenTool, Search, GraduationCap, Zap, ArrowLeft } from 'lucide-react';

// --- Subcomponents for App Structure ---

const HeroSection = ({ onStart }: { onStart: () => void }) => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 animate-slide-up">
        <div className="mb-6 relative">
            <div className="absolute inset-0 bg-lumina-primary blur-3xl opacity-30 rounded-full animate-pulse"></div>
            <h1 className="relative text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-lumina-paper to-gray-400 mb-2 tracking-tight">
                Lumina Notes
            </h1>
            <span className="absolute -top-4 -right-8 bg-lumina-secondary text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                AI Powered
            </span>
        </div>
        
        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mb-12 font-light leading-relaxed">
            Transform any topic into <span className="text-lumina-accent font-semibold">beautifully handwritten</span>, structured study notes instantly.
        </p>

        <button 
            onClick={onStart}
            className="group relative px-8 py-4 bg-white text-lumina-dark font-bold text-lg rounded-full shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.7)] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
        >
            <span className="relative z-10 flex items-center gap-2">
                Create Notes Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-lumina-primary via-lumina-secondary to-lumina-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        </button>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 w-full max-w-5xl">
            {[
                { icon: <BookOpen className="text-lumina-primary" />, title: "Structured Learning", desc: "Perfectly organized content with headings and bullets." },
                { icon: <Globe className="text-lumina-accent" />, title: "Multi-Language", desc: "Support for English and Bengali with native nuances." },
                { icon: <BrainCircuit className="text-lumina-secondary" />, title: "Smart Summaries", desc: "Complex topics simplified for your grade level." }
            ].map((feature, idx) => (
                <div key={idx} className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-colors cursor-default">
                    <div className="mb-4 bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center mx-auto">
                        {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.desc}</p>
                </div>
            ))}
        </div>
        
        {/* Upcoming Features Ticker */}
        <div className="mt-20 w-full overflow-hidden border-t border-white/5 pt-8">
            <p className="text-sm text-gray-500 uppercase tracking-widest mb-4">Coming Soon</p>
            <div className="flex justify-center gap-8 text-gray-400 text-sm font-medium">
                <span className="flex items-center gap-2"><Sparkles size={14}/> PDF Export</span>
                <span className="flex items-center gap-2"><Sparkles size={14}/> Quiz Generator</span>
                <span className="flex items-center gap-2"><Sparkles size={14}/> Flashcards</span>
            </div>
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
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-10 animate-slide-up relative z-10">
            {/* Main Card Container with Glow Effect */}
            <div className="relative w-full max-w-lg group">
                {/* Ambient Glow Gradient behind card */}
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500 rounded-[2rem] opacity-30 blur-2xl group-hover:opacity-50 transition duration-1000"></div>
                
                <div className="relative bg-[#0F1115]/80 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl overflow-hidden ring-1 ring-white/5">
                    
                    {/* Subtle Interior Lighting */}
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>

                    {/* Header */}
                    <div className="flex flex-col items-center mb-8 relative z-10">
                         <button 
                            onClick={!isLoading ? onBack : undefined} 
                            className={`absolute left-0 top-1 p-2 -ml-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5 ${isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 mb-4 transform rotate-3">
                            <Sparkles className="text-white" size={24} />
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">Generate Notes</h2>
                        <p className="text-gray-400 text-sm mt-2">AI-powered study material creator</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        {/* Wrapper for Inputs */}
                        <div className={`space-y-5 transition-all duration-500 ${isLoading ? 'opacity-20 blur-[2px] pointer-events-none grayscale' : ''}`}>
                            
                            {/* Topic Input */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Topic / Subject</label>
                                <div className="relative group/input">
                                    <div className="absolute left-4 top-3.5 text-gray-500 group-focus-within/input:text-purple-400 transition-colors">
                                        <Search size={18} />
                                    </div>
                                    <input 
                                        type="text" 
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="What do you want to learn?"
                                        className="w-full bg-black/30 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-black/50 focus:ring-2 focus:ring-purple-500/20 transition-all shadow-inner"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Standard / Level Input */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Level / Standard</label>
                                <div className="relative group/input">
                                    <div className="absolute left-4 top-3.5 text-gray-500 group-focus-within/input:text-pink-400 transition-colors">
                                        <GraduationCap size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        list="grade-levels"
                                        value={grade}
                                        onChange={(e) => setGrade(e.target.value)}
                                        placeholder="e.g. Class 12, UPSC, MBA..."
                                        className="w-full bg-black/30 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-pink-500/50 focus:bg-black/50 focus:ring-2 focus:ring-pink-500/20 transition-all shadow-inner"
                                        required
                                        disabled={isLoading}
                                    />
                                    <datalist id="grade-levels">
                                        <option value="Class 10" />
                                        <option value="Class 12 (Science)" />
                                        <option value="Undergraduate (B.Tech/B.Sc)" />
                                        <option value="Postgraduate (MBA/M.Tech)" />
                                        <option value="UPSC / Civil Services" />
                                        <option value="JEE / NEET Preparation" />
                                        <option value="Professional Certification" />
                                        <option value="Beginner" />
                                        <option value="Advanced / PhD" />
                                    </datalist>
                                </div>
                                {/* Suggestions Chips */}
                                <div className="flex flex-wrap gap-2 mt-2 px-1">
                                    {suggestedGrades.map((g) => (
                                        <button
                                            key={g}
                                            type="button"
                                            onClick={() => setGrade(g)}
                                            className="text-[10px] font-medium px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white transition-all cursor-pointer"
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Language Toggle */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Language</label>
                                <div className="bg-black/30 p-1.5 rounded-xl border border-white/10 flex relative">
                                    {/* Sliding Background */}
                                    <div 
                                        className={`absolute h-[calc(100%-0.75rem)] w-[calc(50%-0.375rem)] bg-gray-700/50 rounded-lg transition-all duration-300 ease-out shadow-sm border border-white/10 ${language === 'Bengali' ? 'translate-x-full' : 'translate-x-0'}`} 
                                    ></div>
                                    
                                    <button
                                        type="button"
                                        onClick={() => setLanguage('English')}
                                        className={`relative flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors z-10 flex items-center justify-center gap-2 ${language === 'English' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                    >
                                        <span className="text-xs opacity-70">A</span> English
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setLanguage('Bengali')}
                                        className={`relative flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors z-10 flex items-center justify-center gap-2 ${language === 'Bengali' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                    >
                                        <span className="text-xs opacity-70">অ</span> Bengali
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Loading Indicator Overlay */}
                        {isLoading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 animate-fade-in">
                                <div className="relative w-16 h-16 mb-4">
                                    <div className="absolute inset-0 bg-purple-500 rounded-full blur-xl opacity-40 animate-pulse"></div>
                                    <div className="relative bg-[#0F1115] p-4 rounded-full border border-white/10 shadow-2xl flex items-center justify-center">
                                        <Loader2 className="text-purple-400 animate-spin" size={24} />
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-white tracking-wide animate-pulse">Crafting Notes...</h3>
                                <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Please Wait</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className={`w-full group relative overflow-hidden rounded-xl p-px transition-all duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.5)] hover:-translate-y-0.5'}`}
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 rounded-xl"></span>
                            <div className="relative bg-gradient-to-r from-pink-600 to-purple-700 text-white h-full w-full rounded-xl px-4 py-4 flex items-center justify-center gap-2 font-bold tracking-wide">
                                <Zap size={18} className={`${isLoading ? 'hidden' : 'fill-current'}`} />
                                <span>{isLoading ? 'Generating...' : 'Generate Notes'}</span>
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
            alert("Oops! Something went wrong. Please check your API key or try again.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen text-white font-sans selection:bg-lumina-primary selection:text-white">
            <MotionBackground />
            
            {/* Header / Nav (Minimal) */}
            <nav className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight cursor-pointer group" onClick={() => !isLoading && setAppState(AppState.HOME)}>
                    <div className="w-8 h-8 bg-gradient-to-tr from-lumina-primary to-lumina-secondary rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:rotate-12 transition-transform">
                        <span className="text-white">L</span>
                    </div>
                    <span>Lumina</span>
                </div>
                {!process.env.API_KEY && (
                    <div className="bg-red-500/20 text-red-200 px-4 py-1 rounded-full text-xs border border-red-500/30">
                        API Key Missing
                    </div>
                )}
            </nav>

            <main className="relative z-10 pt-20 pb-10">
                {appState === AppState.HOME && (
                    <HeroSection onStart={() => setAppState(AppState.GENERATING)} />
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
                        topic={noteRequest?.topic || 'Notes'} 
                        onBack={() => setAppState(AppState.GENERATING)}
                    />
                )}
            </main>
        </div>
    );
};

export default App;