import React, { useRef, useState } from 'react';
import { Copy, Check, ArrowLeft, ChevronRight, Terminal, Download } from 'lucide-react';
import katex from 'katex';

interface NotebookProps {
    content: string;
    topic: string;
    onBack: () => void;
}

const Notebook: React.FC<NotebookProps> = ({ content, topic, onBack }) => {
    const [copied, setCopied] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        window.print();
    };

    // --- Helper: Inline Text Processing ---
    const processText = (text: string): React.ReactNode => {
        const codeParts = text.split(/(`[^`]+`)/g);

        return codeParts.map((part, index) => {
            if (part.startsWith('`') && part.endsWith('`')) {
                const codeContent = part.slice(1, -1);
                return (
                    <code key={`c-${index}`} className="font-mono text-[0.85em] bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded border border-gray-200 mx-0.5 align-baseline print:bg-transparent print:border-gray-300">
                        {codeContent}
                    </code>
                );
            }

            const mathParts = part.split(/(\\\(.*?\\\))/g);
            return (
                <span key={`seg-${index}`}>
                    {mathParts.map((mPart, mIdx) => {
                        if (mPart.startsWith('\\(') && mPart.endsWith('\\)')) {
                            const math = mPart.slice(2, -2);
                            try {
                                 const html = katex.renderToString(math, {
                                     throwOnError: false,
                                     displayMode: false
                                 });
                                 return <span key={`m-${mIdx}`} dangerouslySetInnerHTML={{__html: html}} className="mx-0.5 inline-block text-black" />;
                            } catch (e) {
                                 return <span key={`m-${mIdx}`} className="text-red-500 text-sm font-mono">{mPart}</span>;
                            }
                        } else {
                            const boldParts = mPart.split(/(\*\*.*?\*\*)/g);
                            return (
                                <span key={`t-${mIdx}`}>
                                    {boldParts.map((bPart, bIdx) => {
                                        if (bPart.startsWith('**') && bPart.endsWith('**')) {
                                            return <span key={`b-${bIdx}`} className="font-bold text-gray-900">{bPart.slice(2, -2)}</span>;
                                        }
                                        return bPart;
                                    })}
                                </span>
                            );
                        }
                    })}
                </span>
            );
        });
    };

    // --- Helper: Table Rendering ---
    const renderTable = (rows: string[], keyPrefix: number | string) => {
        if (rows.length < 2) return null;

        const headerRow = rows[0];
        const bodyRows = rows.slice(2);

        const safeParseRow = (rowStr: string) => {
            let content = rowStr.trim();
            if (content.startsWith('|')) content = content.substring(1);
            if (content.endsWith('|')) content = content.substring(0, content.length - 1);
            return content.split('|').map(c => c.trim());
        };

        const headers = safeParseRow(headerRow);

        return (
            <div key={`table-${keyPrefix}`} className="overflow-hidden my-8 border border-gray-200 rounded-lg shadow-sm bg-white break-inside-avoid print:border-gray-300 print:shadow-none">
                <table className="min-w-full divide-y divide-gray-200 print:divide-gray-300">
                    <thead className="bg-gray-50 print:bg-gray-100">
                        <tr>
                            {headers.map((h, idx) => (
                                <th key={`th-${idx}`} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 print:text-black">
                                    {processText(h)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white print:divide-gray-200">
                        {bodyRows.map((row, rIdx) => {
                            const cells = safeParseRow(row);
                            return (
                                <tr key={`tr-${rIdx}`} className="hover:bg-gray-50/50 transition-colors print:hover:bg-transparent">
                                    {cells.map((c, cIdx) => (
                                        <td key={`td-${cIdx}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 leading-relaxed print:text-black">
                                            {processText(c)}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    // --- Main Markdown Parser ---
    const renderMarkdown = (text: string) => {
        const lines = text.split('\n');
        const elements: React.ReactNode[] = [];
        
        let inMathBlock = false;
        let mathBuffer = '';
        
        let inTableBlock = false;
        let tableBuffer: string[] = [];

        let inCodeBlock = false;
        let codeBuffer = '';
        let codeLanguage = '';

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();

            if (trimmed.startsWith('```')) {
                if (inCodeBlock) {
                    inCodeBlock = false;
                    elements.push(
                        <div key={`code-${i}`} className="my-8 rounded-lg overflow-hidden bg-[#18181b] border border-gray-800 shadow-sm break-inside-avoid print:bg-white print:border-gray-300 print:text-black">
                            <div className="flex items-center justify-between px-4 py-2 bg-[#27272a] border-b border-gray-800 print:bg-gray-100 print:border-gray-300">
                                <div className="flex gap-1.5 print:hidden">
                                    <div className="w-2.5 h-2.5 rounded-full bg-gray-600"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-gray-600"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-gray-600"></div>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-medium text-gray-400 print:text-gray-600">
                                    <Terminal size={10} />
                                    <span className="uppercase tracking-wider">{codeLanguage || 'CODE'}</span>
                                </div>
                            </div>
                            <div className="p-4 overflow-x-auto">
                                <pre className="font-mono text-xs md:text-sm leading-relaxed text-gray-300 print:text-black print:whitespace-pre-wrap">
                                    <code>{codeBuffer}</code>
                                </pre>
                            </div>
                        </div>
                    );
                    codeBuffer = '';
                    codeLanguage = '';
                } else {
                    inCodeBlock = true;
                    codeLanguage = trimmed.replace('```', '').trim();
                }
                continue;
            }

            if (inCodeBlock) {
                codeBuffer += line + '\n';
                continue;
            }

            if (inMathBlock) {
                if (trimmed === '\\]') {
                    inMathBlock = false;
                    try {
                        const html = katex.renderToString(mathBuffer, {
                            throwOnError: false,
                            displayMode: true
                        });
                        elements.push(
                            <div key={`math-${i}`} className="my-8 py-6 px-4 bg-gray-50/50 rounded-lg border border-gray-100 flex justify-center overflow-x-auto text-black break-inside-avoid print:bg-transparent print:border-none print:py-2">
                                <div dangerouslySetInnerHTML={{__html: html}} />
                            </div>
                        );
                    } catch {
                        elements.push(<pre key={`math-${i}`} className="text-red-500 text-sm p-4">{mathBuffer}</pre>);
                    }
                } else {
                    mathBuffer += line + '\n';
                }
                continue;
            }

            if (trimmed === '\\[') {
                inMathBlock = true;
                mathBuffer = '';
                continue;
            }
            
            if (trimmed.startsWith('\\[') && trimmed.endsWith('\\]')) {
                 const math = trimmed.slice(2, -2);
                 try {
                    const html = katex.renderToString(math, {
                        throwOnError: false,
                        displayMode: true
                    });
                    elements.push(
                        <div key={`math-${i}`} className="my-8 py-6 px-4 bg-gray-50/50 rounded-lg border border-gray-100 flex justify-center overflow-x-auto text-black break-inside-avoid print:bg-transparent print:border-none print:py-2">
                            <div dangerouslySetInnerHTML={{__html: html}} />
                        </div>
                    );
                 } catch {
                     elements.push(<p key={i} className="text-red-500">{line}</p>);
                 }
                 continue;
            }

            const isTableLine = trimmed.startsWith('|');
            if (inTableBlock) {
                if (isTableLine) {
                    tableBuffer.push(trimmed);
                    continue;
                } else {
                    inTableBlock = false;
                    elements.push(renderTable(tableBuffer, i));
                    tableBuffer = [];
                }
            } else {
                if (isTableLine) {
                    const nextLine = lines[i + 1]?.trim();
                    if (nextLine && nextLine.startsWith('|') && nextLine.includes('-')) {
                        inTableBlock = true;
                        tableBuffer.push(trimmed);
                        continue;
                    }
                }
            }

            if (line.startsWith('# ')) {
                elements.push(
                    <h1 key={i} className="text-3xl font-bold text-gray-900 mt-12 mb-6 tracking-tight break-after-avoid">
                        {processText(line.replace('# ', ''))}
                    </h1>
                );
                continue;
            }
            if (line.startsWith('## ')) {
                elements.push(
                    <h2 key={i} className="text-xl font-bold text-gray-800 mt-10 mb-4 pb-2 border-b border-gray-100 break-after-avoid print:border-gray-300">
                        {processText(line.replace('## ', ''))}
                    </h2>
                );
                continue;
            }
            if (line.startsWith('### ')) {
                elements.push(
                    <h3 key={i} className="text-lg font-semibold text-gray-800 mt-6 mb-3 break-after-avoid">
                        {processText(line.replace('### ', ''))}
                    </h3>
                );
                continue;
            }

            if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                elements.push(
                    <div key={i} className="flex items-start pl-1 mb-2">
                        <div className="min-w-[20px] pt-2.5 pr-2 flex justify-center">
                             <div className="w-1 h-1 rounded-full bg-gray-400 print:bg-black"></div>
                        </div>
                        <div className="text-gray-600 text-[1rem] leading-relaxed print:text-black">{processText(line.replace(/^[\-\*] /, ''))}</div>
                    </div>
                );
                continue;
            }

            if (/^\d+\./.test(line.trim())) {
                 elements.push(
                    <div key={i} className="flex items-start pl-1 mb-2">
                        <span className="font-medium text-gray-400 min-w-[24px] pt-0.5 text-sm print:text-black">{line.split('.')[0]}.</span>
                        <div className="text-gray-600 text-[1rem] leading-relaxed print:text-black">{processText(line.replace(/^\d+\. /, ''))}</div>
                    </div>
                );
                continue;
            }
            
             if (line.trim().startsWith('> ')) {
                elements.push(
                    <blockquote key={i} className="border-l-2 border-gray-200 pl-6 py-2 my-6 text-gray-500 italic print:border-gray-400 print:text-gray-700">
                        {processText(line.replace(/^> /, ''))}
                    </blockquote>
                );
                continue;
            }

            if (line.trim() === '') {
                elements.push(<div key={i} className="h-4"></div>);
                continue;
            }

            elements.push(<p key={i} className="text-[1rem] text-gray-600 leading-8 mb-4 print:text-black">{processText(line)}</p>);
        }

        if (inMathBlock) elements.push(<pre key="pending-math" className="text-gray-400 text-sm ml-4">\[{'\n'}{mathBuffer}</pre>);
        if (inTableBlock && tableBuffer.length > 0) elements.push(renderTable(tableBuffer, 'end'));
        if (inCodeBlock && codeBuffer.length > 0) elements.push(<pre key="pending-code" className="bg-gray-800 text-white p-4 rounded">{codeBuffer}</pre>);

        return elements;
    };

    return (
        <div className="w-full max-w-4xl mx-auto h-[92vh] flex flex-col relative z-20 animate-fade-in-up px-0 md:px-0 print:h-auto print:block">
            
            {/* Document Container */}
            <div className="flex-1 bg-[#fafaf9] rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col ring-1 ring-white/10 relative print:shadow-none print:ring-0 print:rounded-none print:bg-white print:overflow-visible print:h-auto">
                
                {/* --- Floating Nav (Hidden in Print) --- */}
                <div className="px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100 flex justify-between items-center z-30 sticky top-0 print:hidden">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={onBack}
                            className="p-2 -ml-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-400 font-medium hidden sm:inline">Notes</span>
                            <ChevronRight size={14} className="text-gray-300 hidden sm:inline" />
                            <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 font-medium text-xs border border-gray-200 truncate max-w-[150px]">
                                {topic}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button 
                            onClick={handleCopy}
                            className="p-2 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all"
                            title="Copy to Clipboard"
                        >
                            {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                        </button>
                        <button 
                            onClick={handleDownload}
                            className="p-2 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all"
                            title="Download PDF"
                        >
                            <Download size={18} />
                        </button>
                    </div>
                </div>

                {/* --- Content Area --- */}
                <div 
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto bg-[#fafaf9] custom-scrollbar print:overflow-visible print:h-auto print:bg-white"
                >
                    <div className="max-w-[720px] mx-auto px-8 py-12 md:px-12 md:py-16 print:px-0 print:py-0 print:max-w-none">
                        
                        {/* Document Header */}
                        <div className="mb-12 text-center border-b border-gray-200 pb-8 print:border-gray-300 print:mb-8 print:text-left">
                            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4 leading-tight capitalize print:text-4xl">
                                {topic}
                            </h1>
                            <p className="text-gray-500 font-medium text-sm print:text-gray-600">
                                Generated by Lumina Intelligence
                            </p>
                        </div>
                        
                        {/* Markdown Content */}
                        <div className="min-h-[200px] text-gray-800 print:text-black">
                            {renderMarkdown(content)}
                        </div>

                        {/* Footer (Screen) */}
                        <div className="mt-24 pt-8 border-t border-gray-100 flex flex-col items-center justify-center gap-4 opacity-40 hover:opacity-100 transition-opacity print:hidden">
                             <div className="text-[10px] font-medium text-gray-400 tracking-widest uppercase">
                                 Lumina AI Research
                             </div>
                        </div>

                        {/* Footer (Print Only) */}
                        <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center">
                            <p className="text-xs text-gray-500">Created with Lumina Notes</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Ambient Background Glow for Note View */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-white opacity-[0.02] blur-3xl pointer-events-none -z-10 print:hidden"></div>
        </div>
    );
};

export default Notebook;