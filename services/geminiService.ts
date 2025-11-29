import { GoogleGenAI } from "@google/genai";
import { NoteRequest } from '../types';

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API Key is missing");
    }
    return new GoogleGenAI({ apiKey });
};

export const generateNotes = async (request: NoteRequest): Promise<string> => {
    const ai = getClient();
    
    // Using gemini-2.5-flash which supports search and is efficient for text generation
    const modelId = 'gemini-2.5-flash';

    const prompt = `
You are an expert teacher and note-maker. Whenever a user gives you:
– a Topic (e.g. “${request.topic}”)
– a Standard/Class (e.g. ${request.grade})
– a Language (e.g. ${request.language}) —

you must generate comprehensive, high-quality academic notes, as if a highly experienced teacher prepared them. Use the following rules:

1. Use Reliable, Up-to-Date Information:
Before writing the notes, perform a web search (using the attached tool) to fetch accurate, up-to-date definitions, theories, examples, facts. Use those sources to inform explanations.

2. Structured Layout & Formatting (in Markdown):
- Use hierarchical headings: #, ##, ###, etc.
- Provide a table of contents at the top (optional but preferred).
- Present definitions, concept explanations, derivations, examples, common mistakes / misconceptions, summary, questions for practice.
- Use LaTeX for all mathematical expressions or chemical formulas. 
  - **IMPORTANT RENDERING RULE:** All LaTeX math must be black. Never use white.
  - Always wrap LaTeX content in \\color{black}{...}.
  - Inline math: \\( \\color{black}{a^2 + b^2 = c^2} \\) 
  - Block equations: \\[ \\color{black}{PV = nRT} \\]
- Use code blocks for all code examples (with appropriate language tags).
- Use tables for comparisons, advantages/disadvantages, differences (where relevant).
- Use callout boxes (via bold labels like **Definition:**, **Important:**, **Tip for Exams:**, **💡 Key Idea:**) to highlight key ideas or warnings.

3. Tone & Style:
- Write as a patient and clear teacher explaining to students.
- Use simple, understandable language.
- Maintain academic seriousness — avoid slang or overly casual tone.
- Provide both conceptual understanding and exam-ready clarity.

4. Depth & Completeness:
- Cover all subtopics relevant to the given topic.
- Include real-world examples or applications when relevant.
- Include sample problems (with solutions) if applicable, and practice questions for the student.

5. NO References, Sources, or Links:
- Use internal knowledge and the search tool for accuracy, BUT...
- **DO NOT** include any "References", "Sources", "Citations", "Further Reading" or similar sections in the final output.
- **DO NOT** include URLs or external links.
- The final output must look like a completely self-contained handwritten notebook.

6. Output Constraints:
- Output should be valid Markdown only (no HTML).
- If the user requested a language other than English, write the entire notes in that language.
- Do not mention this prompt or the instructions themselves in the final output.

7. Optional Enhancements (if applicable):
- Add a summary bullet-list at the end.
- Add “Common Mistakes / Pitfalls” section.
- Add “Exam Tips / Quick Revision” section.

BEGIN NOTES for the given user input (Topic: ${request.topic}, Class: ${request.grade}, Language: ${request.language}).
    `;

    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: {
                temperature: 0.5,
                topK: 40,
                maxOutputTokens: 8192,
                tools: [{ googleSearch: {} }], // Enable Google Search grounding
            }
        });

        const text = response.text || "Failed to generate notes. Please try again.";

        // Logic to append sources has been removed as per instructions.
        
        return text;
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
};