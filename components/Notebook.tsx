import React, { useState, useRef } from 'react';
import { Download, Copy, Check, ArrowLeft, FileText } from 'lucide-react';
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
                    <code key={`c-${index}`} className="font-mono text-[0.9em] bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded border border-gray-200 mx-0.5 align-middle">
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
                                 return <span key={`m-${mIdx}`} dangerouslySetInnerHTML={{__html: html}} className="mx-0.5 inline-block" />;
                            } catch (e) {
                                 return <span key={`m-${mIdx}`} className="text-red-500 text-sm font-mono">{mPart}</span>;
                            }
                        } else {
                            // 3. Handle Bold inside text parts: **...**
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
            <div key={`table-${keyPrefix}`} className="overflow-x-auto my-8 border border-gray-200 rounded-lg shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {headers.map((h, idx) => (
                                <th key={`th-${idx}`} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    {processText(h)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {bodyRows.map((row, rIdx) => {
                            const cells = safeParseRow(row);
                            return (
                                <tr key={`tr-${rIdx}`} className="hover:bg-gray-50 transition-colors">
                                    {cells.map((c, cIdx) => (
                                        <td key={`td-${cIdx}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
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
                        elements.push(
                            <div key={`math-${i}`} className="my-6 py-4 px-4 bg-gray-50 rounded-lg border border-gray-100 flex justify-center overflow-x-auto">
                                <div dangerouslySetInnerHTML={{__html: html}} />
                            </div>
                        );
                    } catch {
                        elements.push(<pre key={`math-${i}`} className="text-red-500 text-sm p-4 bg-red-50 rounded">{mathBuffer}</pre>);
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
                        <div key={`math-${i}`} className="my-6 py-4 px-4 bg-gray-50 rounded-lg border border-gray-100 flex justify-center overflow-x-auto">
                            <div dangerouslySetInnerHTML={{__html: html}} />
                        </div>
                    );
                 } catch {
                     elements.push(<p key={i} className="text-red-500">{line}</p>);
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
                    // Fall through to process the current line if it's not empty
                }
            } else {
                // Check if this looks like the start of a table
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
                elements.push(<h1 key={i} className="text-4xl font-extrabold text-gray-900 mt-10 mb-6 tracking-tight leading-tight">{processText(line.replace('# ', ''))}</h1>);
                continue;
            }
            if (line.startsWith('## ')) {
                elements.push(<h2 key={i} className="text-2xl font-bold text-gray-800 mt-8 mb-4 tracking-tight border-b border-gray-100 pb-2">{processText(line.replace('## ', ''))}</h2>);
                continue;
            }
            if (line.startsWith('### ')) {
                elements.push(<h3 key={i} className="text-xl font-bold text-gray-800 mt-6 mb-3">{processText(line.replace('### ', ''))}</h3>);
                continue;
            }
            // Bullets
            if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                elements.push(
                    <div key={i} className="flex items-start ml-2 mb-2 group">
                        <span className="text-purple-500 mr-3 mt-1.5">•</span>
                        <div className="text-gray-700 text-lg leading-relaxed">{processText(line.replace(/^[\-\*] /, ''))}</div>
                    </div>
                );
                continue;
            }
            // Numbered Lists
            if (/^\d+\./.test(line.trim())) {
                 elements.push(
                    <div key={i} className="flex items-start ml-2 mb-2">
                        <span className="font-semibold text-gray-900 mr-3 min-w-[1.5rem] mt-0.5">{line.split('.')[0]}.</span>
                        <div className="text-gray-700 text-lg leading-relaxed">{processText(line.replace(/^\d+\. /, ''))}</div>
                    </div>
                );
                continue;
            }
            // Blockquotes
             if (line.trim().startsWith('> ')) {
                elements.push(
                    <blockquote key={i} className="border-l-4 border-purple-500 bg-purple-50/50 pl-4 py-2 my-4 italic text-gray-700 rounded-r-lg">
                        {processText(line.replace(/^> /, ''))}
                    </blockquote>
                );
                continue;
            }

            // Empty lines
            if (line.trim() === '') {
                elements.push(<div key={i} className="h-4"></div>);
                continue;
            }
            // Standard Paragraph
            elements.push(<div key={i} className="text-lg text-gray-700 leading-relaxed mb-3">{processText(line)}</div>);
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
        <div className="w-full max-w-5xl mx-auto h-[88vh] animate-slide-up flex flex-col relative z-20">
            {/* Card Container */}
            <div className="flex-1 bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col ring-1 ring-white/10 relative">
                
                {/* Header Bar */}
                <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white/90 backdrop-blur-xl sticky top-0 z-30 shadow-sm">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={onBack}
                            className="p-2 -ml-2 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors flex items-center justify-center group"
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform"/>
                        </button>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Note Topic</span>
                            <h1 className="text-xl font-bold text-gray-900 leading-none truncate max-w-md">{topic}</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                         <button 
                            onClick={handleCopy}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                copied 
                                ? 'bg-green-50 text-green-700 border border-green-200' 
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200'
                            }`}
                        >
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                            <span>{copied ? 'Copied' : 'Copy'}</span>
                        </button>
                        
                        <button className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200 transition-colors" title="Download PDF">
                            <Download size={20} />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div 
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto bg-white"
                >
                    <div className="max-w-3xl mx-auto px-8 py-12 md:px-12 md:py-16">
                        {/* Decorative Top Icon */}
                        <div className="flex justify-center mb-10 opacity-10">
                            <FileText size={48} className="text-gray-900"/>
                        </div>
                        
                        {renderMarkdown(content)}

                        {/* End of Notes Marker */}
                        <div className="mt-16 pt-10 border-t border-gray-100 flex flex-col items-center gap-2 text-gray-300">
                             <div className="flex gap-2">
                                 <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                                 <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                                 <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                             </div>
                             <span className="text-xs font-medium tracking-widest uppercase mt-2">End of Notes</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* External Status */}
            <div className="text-center mt-3 text-white/40 text-xs font-medium tracking-wide">
                Generated by Lumina AI
            </div>
        </div>
    );
};

export default Notebook;