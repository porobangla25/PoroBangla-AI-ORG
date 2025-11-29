import React, { useState, useRef } from 'react';
import { Download, Copy, Check } from 'lucide-react';
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

    // Advanced Text Processor: Handles Inline Code, Inline Math and Bold
    const processText = (text: string): React.ReactNode => {
        // 1. Split by Inline Code first: `...`
        const codeParts = text.split(/(`[^`]+`)/g);

        return codeParts.map((part, index) => {
            // Check if it's inline code
            if (part.startsWith('`') && part.endsWith('`')) {
                const codeContent = part.slice(1, -1);
                return (
                    <code key={`c-${index}`} className="font-mono text-sm bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded mx-1 box-decoration-clone border border-gray-200">
                        {codeContent}
                    </code>
                );
            }

            // 2. Split by Inline Math: \( ... \)
            const mathParts = part.split(/(\\\(.*?\\\))/g);
            
            return (
                <span key={`seg-${index}`}>
                    {mathParts.map((mPart, mIdx) => {
                        // Check if it's inline math
                        if (mPart.startsWith('\\(') && mPart.endsWith('\\)')) {
                            const math = mPart.slice(2, -2);
                            try {
                                 const html = katex.renderToString(math, {
                                     throwOnError: false,
                                     displayMode: false
                                 });
                                 return <span key={`m-${mIdx}`} dangerouslySetInnerHTML={{__html: html}} className="mx-1" />;
                            } catch (e) {
                                 return <span key={`m-${mIdx}`} className="text-red-500">{mPart}</span>;
                            }
                        } else {
                            // 3. Handle Bold inside text parts: **...**
                            const boldParts = mPart.split(/(\*\*.*?\*\*)/g);
                            return (
                                <span key={`t-${mIdx}`}>
                                    {boldParts.map((bPart, bIdx) => {
                                        if (bPart.startsWith('**') && bPart.endsWith('**')) {
                                            return <span key={`b-${bIdx}`} className="font-bold text-indigo-900 bg-yellow-100 px-1 rounded-sm">{bPart.slice(2, -2)}</span>;
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

    const renderTable = (rows: string[], keyPrefix: number | string) => {
        if (rows.length < 2) return null;

        const headerRow = rows[0];
        const bodyRows = rows.slice(2); // Skip header and separator

        const safeParseRow = (rowStr: string) => {
            let content = rowStr.trim();
            if (content.startsWith('|')) content = content.substring(1);
            if (content.endsWith('|')) content = content.substring(0, content.length - 1);
            return content.split('|').map(c => c.trim());
        };

        const headers = safeParseRow(headerRow);

        return (
            <div key={`table-${keyPrefix}`} className="overflow-x-auto my-6 animate-fade-in">
                <table className="min-w-full border-collapse bg-white/40 backdrop-blur-sm rounded-lg overflow-hidden shadow-sm border border-gray-200">
                    <thead>
                        <tr className="bg-lumina-primary/10 border-b-2 border-lumina-primary/30">
                            {headers.map((h, idx) => (
                                <th key={`th-${idx}`} className="px-4 py-3 text-left font-bold text-gray-800 border-r border-gray-300/50 last:border-r-0 font-sans text-sm tracking-wide uppercase">
                                    {processText(h)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {bodyRows.map((row, rIdx) => {
                            const cells = safeParseRow(row);
                            return (
                                <tr key={`tr-${rIdx}`} className="border-b border-gray-300/50 hover:bg-white/60 transition-colors last:border-b-0">
                                    {cells.map((c, cIdx) => (
                                        <td key={`td-${cIdx}`} className="px-4 py-3 text-gray-800 border-r border-gray-300/50 last:border-r-0 font-hand text-lg">
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

    // Parser for display with support for Block Math and Tables
    const renderMarkdown = (text: string) => {
        const lines = text.split('\n');
        const elements: React.ReactNode[] = [];
        let inMathBlock = false;
        let mathBuffer = '';
        
        let inTableBlock = false;
        let tableBuffer: string[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();

            // --- Math Block Handling ---
            if (inMathBlock) {
                if (trimmed === '\\]') {
                    inMathBlock = false;
                    try {
                        const html = katex.renderToString(mathBuffer, {
                            throwOnError: false,
                            displayMode: true
                        });
                        elements.push(<div key={`math-${i}`} className="my-4 text-center text-lg overflow-x-auto" dangerouslySetInnerHTML={{__html: html}} />);
                    } catch {
                        elements.push(<pre key={`math-${i}`} className="text-red-500 text-sm">{mathBuffer}</pre>);
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
                    elements.push(<div key={`math-${i}`} className="my-4 text-center text-lg overflow-x-auto" dangerouslySetInnerHTML={{__html: html}} />);
                 } catch {
                     elements.push(<p key={i}>{line}</p>);
                 }
                 continue;
            }

            // --- Table Handling ---
            const isTableLine = trimmed.startsWith('|');

            if (inTableBlock) {
                if (isTableLine) {
                    tableBuffer.push(trimmed);
                    continue;
                } else {
                    // Table ended
                    inTableBlock = false;
                    elements.push(renderTable(tableBuffer, i));
                    tableBuffer = [];
                    // Fall through to process the current line
                }
            } else {
                // Check if this looks like the start of a table
                // Must start with pipe and next line must be separator
                if (isTableLine) {
                    const nextLine = lines[i + 1]?.trim();
                    if (nextLine && nextLine.startsWith('|') && nextLine.includes('-')) {
                        inTableBlock = true;
                        tableBuffer.push(trimmed);
                        continue;
                    }
                }
            }

            // --- Standard Markdown Handling ---
            
            // Headers
            if (line.startsWith('# ')) {
                elements.push(<h1 key={i} className="text-3xl font-serif font-bold text-gray-900 mt-6 mb-4 border-b-2 border-lumina-line pb-2">{processText(line.replace('# ', ''))}</h1>);
                continue;
            }
            if (line.startsWith('## ')) {
                elements.push(<h2 key={i} className="text-2xl font-serif font-bold text-lumina-primary mt-5 mb-3">{processText(line.replace('## ', ''))}</h2>);
                continue;
            }
            if (line.startsWith('### ')) {
                elements.push(<h3 key={i} className="text-xl font-serif font-semibold text-gray-800 mt-4 mb-2">{processText(line.replace('### ', ''))}</h3>);
                continue;
            }
            // Bullets
            if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                elements.push(
                    <div key={i} className="flex items-start ml-4 mb-2">
                        <span className="text-lumina-secondary mr-2 mt-1.5">•</span>
                        <div className="font-hand text-xl text-gray-800 leading-relaxed">{processText(line.replace(/^[\-\*] /, ''))}</div>
                    </div>
                );
                continue;
            }
            // Numbered Lists
            if (/^\d+\./.test(line.trim())) {
                 elements.push(
                    <div key={i} className="flex items-start ml-4 mb-2">
                        <span className="font-bold text-lumina-primary mr-2 font-hand text-xl">{line.split('.')[0]}.</span>
                        <div className="font-hand text-xl text-gray-800 leading-relaxed">{processText(line.replace(/^\d+\. /, ''))}</div>
                    </div>
                );
                continue;
            }
            // Empty lines
            if (line.trim() === '') {
                elements.push(<div key={i} className="h-4"></div>);
                continue;
            }
            // Standard Paragraph
            elements.push(<div key={i} className="font-hand text-xl text-gray-800 leading-relaxed mb-2">{processText(line)}</div>);
        }

        // Render any pending buffers
        if (inMathBlock) {
             elements.push(<pre key="pending-math" className="text-gray-400 font-mono text-sm whitespace-pre-wrap ml-4">\[{'\n'}{mathBuffer}</pre>);
        }
        if (inTableBlock && tableBuffer.length > 0) {
             elements.push(renderTable(tableBuffer, 'end'));
        }

        return elements;
    };

    return (
        <div className="relative w-full max-w-4xl mx-auto h-[85vh] animate-slide-up flex flex-col">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-4 px-4">
                <button 
                    onClick={onBack}
                    className="text-gray-300 hover:text-white transition flex items-center gap-2 group"
                >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Generator
                </button>
                <div className="flex gap-3">
                    <button 
                        onClick={handleCopy}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition border border-white/10 flex items-center gap-2"
                        title="Copy to Clipboard"
                    >
                        {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
                        <span className="text-sm font-medium">{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                    {/* Placeholder for future PDF download feature */}
                    <button className="p-2 rounded-full bg-lumina-primary hover:bg-lumina-secondary text-white transition shadow-lg shadow-purple-500/50">
                        <Download size={20} />
                    </button>
                </div>
            </div>

            {/* Realistic Notebook Container */}
            <div className="relative flex-1 bg-lumina-paper rounded-r-2xl rounded-l-sm shadow-2xl overflow-hidden flex flex-col transform transition-all duration-500 hover:scale-[1.005]">
                {/* Binding Effect */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-800 via-black to-gray-800 z-20 flex flex-col justify-evenly py-4">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="w-full h-3 bg-gray-700 border-t border-b border-gray-600"></div>
                    ))}
                </div>
                
                {/* Paper Texture & Lines */}
                <div 
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto pl-16 pr-8 py-10 relative scroll-smooth"
                    style={{
                        backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px)',
                        backgroundSize: '100% 2.5rem',
                        lineHeight: '2.5rem'
                    }}
                >
                    {/* Red Margin Line */}
                    <div className="absolute top-0 bottom-0 left-12 w-0.5 bg-red-300 z-10 h-full"></div>

                    {/* Content */}
                    <div className="relative z-10 min-h-full">
                         {/* Date Header */}
                        <div className="absolute top-[-1.5rem] right-0 font-hand text-gray-500 text-lg">
                            {new Date().toLocaleDateString()}
                        </div>
                        
                        {renderMarkdown(content)}
                    </div>
                </div>
            </div>
            
            <div className="text-center mt-4 text-gray-400 text-sm">
                Notes generated successfully.
            </div>
        </div>
    );
};

export default Notebook;