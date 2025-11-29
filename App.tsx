import React, { useState } from 'react';
import MotionBackground from './components/MotionBackground';
import Notebook from './components/Notebook';
import { generateNotes } from './services/geminiService';
import { NoteRequest, AppState } from './types';
import { Sparkles, BookOpen, BrainCircuit, Globe, ArrowRight, Loader2, PenTool } from 'lucide-react';

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

    const inputClasses = "w-full bg-black/20 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lumina-primary focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed";

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 animate-slide-up">
            <div className="w-full max-w-xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden transition-all duration-500">
                {/* Decorative blob inside card */}
                <div className={`absolute -top-20 -right-20 w-40 h-40 bg-lumina-secondary blur-3xl opacity-20 transition-all duration-1000 ${isLoading ? 'scale-150 opacity-40 animate-pulse' : ''}`}></div>

                <div className="relative z-10">
                    <button 
                        onClick={!isLoading ? onBack : undefined} 
                        className={`text-sm text-gray-400 hover:text-white mb-6 flex items-center gap-1 transition ${isLoading ? 'opacity-0 cursor-default pointer-events-none' : 'opacity-100'}`}
                    >
                        ← Back Home
                    </button>
                    
                    <h2 className="text-3xl font-bold mb-2">Configure Your Notes</h2>
                    <p className="text-gray-400 mb-8">Tell AI what you need to study today.</p>

                    <form onSubmit={handleSubmit} className="space-y-6 relative">
                        {/* Wrapper for Inputs to apply blur/disable visually */}
                        <div className={`space-y-6 transition-all duration-700 ${isLoading ? 'opacity-30 blur-sm pointer-events-none grayscale' : 'opacity-100'}`}>
                            <div className="space-y-2 group">
                                <label className="text-sm font-medium text-gray-300 ml-1">Topic / Subject</label>
                                <input 
                                    type="text" 
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="e.g., Photosynthesis, The French Revolution"
                                    className={inputClasses}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Grade Level</label>
                                    <select 
                                        value={grade}
                                        onChange={(e) => setGrade(e.target.value)}
                                        className={`${inputClasses} appearance-none cursor-pointer`}
                                        required
                                        disabled={isLoading}
                                    >
                                        <option value="" disabled>Select Grade</option>
                                        <option value="5th Grade">5th Grade</option>
                                        <option value="8th Grade">8th Grade</option>
                                        <option value="10th Grade (High School)">10th Grade</option>
                                        <option value="12th Grade (Senior High)">12th Grade</option>
                                        <option value="Undergraduate">Undergraduate</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Language</label>
                                    <div className={`grid grid-cols-2 gap-2 bg-black/20 p-1 rounded-xl border border-white/10`}>
                                        <button
                                            type="button"
                                            onClick={() => setLanguage('English')}
                                            disabled={isLoading}
                                            className={`rounded-lg text-sm font-medium transition-all duration-300 py-3 ${language === 'English' ? 'bg-lumina-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                        >
                                            English
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setLanguage('Bengali')}
                                            disabled={isLoading}
                                            className={`rounded-lg text-sm font-medium transition-all duration-300 py-3 ${language === 'Bengali' ? 'bg-lumina-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                        >
                                            Bengali
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Visual Loading Indicator Overlay */}
                        {isLoading && (
                            <div className="absolute inset-0 top-0 flex items-center justify-center z-20 animate-fade-in">
                                <div className="flex flex-col items-center p-6 rounded-2xl">
                                    <div className="relative mb-4">
                                        <div className="absolute inset-0 bg-lumina-accent blur-xl opacity-40 animate-pulse"></div>
                                        <div className="relative bg-white/10 p-4 rounded-full border border-white/20 shadow-2xl backdrop-blur-md">
                                            <PenTool className="text-white animate-bounce" size={32} />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-1 animate-pulse">Drafting Notes...</h3>
                                    <p className="text-sm text-gray-300">Consulting the library of knowledge</p>
                                </div>
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className={`w-full mt-8 bg-gradient-to-r from-lumina-primary to-lumina-secondary text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-500 flex items-center justify-center gap-2 relative overflow-hidden
                            ${isLoading 
                                ? 'animate-pulse-glow shadow-purple-500/50 cursor-wait opacity-100 scale-[1.02]' 
                                : 'shadow-purple-900/40 hover:shadow-purple-900/60 hover:scale-[1.02] hover:-translate-y-0.5'
                            }`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" /> 
                                    <span className="animate-pulse">Generating Magic...</span>
                                </>
                            ) : (
                                <><Sparkles size={20} /> Generate Notes</>
                            )}
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