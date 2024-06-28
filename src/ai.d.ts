
declare global {
    interface Window {
      ai: AI;
    }
  
    interface Worker {
      ai: AI;
    }
  
    interface AI {
      canCreateTextSession(): Promise<AIModelAvailability>;
      createTextSession(options?: AITextSessionOptions): Promise<AITextSession>;
      defaultTextSessionOptions(): Promise<AITextSessionOptions>;
    }
  
    interface AITextSession {
      prompt(input: string): Promise<string>;
      promptStreaming(input: string): ReadableStream;
      destroy(): void;
    //   clone(): AITextSession; // Not yet implemented
    }
  
    interface AITextSessionOptions {
      topK?: number;
      temperature?: number;
    }
  
    type AIModelAvailability = 'readily' | 'after-download' | 'no';
  }
  
  export {}; 