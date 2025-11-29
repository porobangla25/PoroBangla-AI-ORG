export interface NoteRequest {
    topic: string;
    grade: string;
    language: 'English' | 'Bengali';
}

export interface NoteResponse {
    title: string;
    content: string; // Markdown formatted string
}

export enum AppState {
    HOME = 'HOME',
    GENERATING = 'GENERATING',
    RESULT = 'RESULT',
    ERROR = 'ERROR'
}
