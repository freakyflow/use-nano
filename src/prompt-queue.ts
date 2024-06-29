import Queue from 'queue';

type StreamCallback = (chunk: string) => void;

class PromptQueue {
    private q = new Queue({ results: [], autostart: true, concurrency: 1 });
    private session: any = null;
    private shouldCancel = false

    private static instance: PromptQueue;
    static getInstance() {
        if (!PromptQueue.instance) {
            console.log("usenano: New queue")
            PromptQueue.instance = new PromptQueue();
        }
        return PromptQueue.instance;
    }

    async init() {
        const canCreate = await window.ai.canCreateTextSession();
        if (canCreate === "readily" || canCreate === "after-download") {
            this.session = await window.ai.createTextSession();
        } else {
            throw new Error("Unable to create text session");
        }
    }



    async enqueue(
        prompt: string,
        streamCallback: StreamCallback
    ) {
        if (!this.session) {
            await this.init();
        }
        let result = "";
        this.q.push(async cb => {
            
            const stream = this.session.promptStreaming(prompt);
            for await (const chunk of stream as any) {
                if (this.shouldCancel) {
                    console.log("usenano: canceled"); // i don't think this work. This is a good use case for a bunch of tests.
                    if (cb) {
                        cb(new Error("Operation canceled"), result);
                    }
                    this.shouldCancel = false;
                    return;
                }
                console.log("usenano: streaming prompt: ", prompt.slice(0, 100), chunk.slice(0, 100))
                streamCallback(chunk);
            }
            if (cb) {
                cb(undefined, result);
            }
        });
    }

    async clear() {
        console.log("usenano: Clear queue")
        this.session.prompt(" ") // see if we can force a cancelation this way
        this.shouldCancel = true; // also tell for loops to exit 
        this.q.end();
    }
}

export const promptQueue = PromptQueue.getInstance();