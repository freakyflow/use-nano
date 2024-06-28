import Queue from 'queue';

type StreamCallback = (chunk: string) => void;

class PromptQueue {
    private q = new Queue({ results: [], autostart: true, concurrency: 1 });
    private session: any = null;

    private static instance: PromptQueue;
    static getInstance() {
        if (!PromptQueue.instance) {
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
                streamCallback(chunk);
            }
            if (cb) {
                cb(undefined, result);
            }
        });
    }

    async clear() {
        this.q.end();
    }
}

export const promptQueue = PromptQueue.getInstance();