type StreamCallback = (chunk: string) => void;

class PromptQueue {
  private queue: Array<{ 
    sessionId: string;
    prompt: string; 
    streamCallback: StreamCallback;
    completeCallback: (result: string) => void 
  }> = [];
  private isProcessing = false;
  private session: any = null;
  private currentSessionId: string | null = null;

  async init() {
    const canCreate = await window.ai.canCreateTextSession();
    if (canCreate === "readily" || canCreate === "after-download") {
      this.session = await window.ai.createTextSession();
    } else {
      throw new Error("Unable to create text session");
    }
  }

  async enqueue(sessionId: string, prompt: string, streamCallback: StreamCallback): Promise<string> {
    // If there's an ongoing request for this session, remove it from the queue
    this.queue = this.queue.filter(item => item.sessionId !== sessionId);
    
    // If the current processing item is for this session, it will be aborted in the next loop iteration

    return new Promise((resolve) => {
      this.queue.push({ 
        sessionId,
        prompt, 
        streamCallback,
        completeCallback: resolve 
      });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;

    const { sessionId, prompt, streamCallback, completeCallback } = this.queue.shift()!;

    if (!this.session) {
      await this.init();
    }

    this.currentSessionId = sessionId;

    try {
      const stream = this.session.promptStreaming(prompt);
      let result = '';
      let previousLength = 0;

      for await (const chunk of stream) {
        // Check if this session has been superseded by a new request
        if (this.currentSessionId !== sessionId) {
          console.log(`Session ${sessionId} aborted`);
          break;
        }

        const newContent = chunk.slice(previousLength);
        result += newContent;
        streamCallback(result);
        previousLength = chunk.length;
      }

      if (this.currentSessionId === sessionId) {
        completeCallback(result);
      }
    } catch (error) {
      console.error('Error processing prompt:', error);
      if (this.currentSessionId === sessionId) {
        completeCallback('');
      }
    }

    this.isProcessing = false;
    this.currentSessionId = null;
    this.processQueue();  // Process next item in the queue
  }

  destroy() {
    if (this.session) {
      this.session.destroy();
      this.session = null;
    }
  }
}

export const promptQueue = new PromptQueue();