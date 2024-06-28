import { useEffect, useState } from "react";
import Queue from 'queue';

/**
 * 
 * @param prompt - The prompt to send to the local LLM
 * @returns Output from the LLM as tokens are generated. The output is the entire LLM response.
 * 
 * Usage:
 * 
 * ```tsx
 * const MyComponent = () => {
 * const [input, setInput] = useState("")
 * const output = useNano(input)
 * return (
 * <div>
 *  <input value={input} onChange={(e) => setInput(e.target.value)} />
 *  <div>{output}</div>
 * </div>
 * )
 * }
 * ```
 */
export const useNano = (prompt: string) => {
    const [output, setOutput] = useState("")

    useEffect(() => {
        const go = async () => {
            const session = await window.ai.createTextSession();
            const stream = session.promptStreaming(prompt);
            for await (const chunk of stream as any) {
                setOutput(chunk);
            }
        }
        go()
    }, [prompt])


    return output;
};


type StreamCallback = (chunk: string) => void;

class PromptQueue {
    private q = new Queue({ results: [], autostart: true, concurrency: 1 });
    private session: any = null;

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

export const promptQueue = new PromptQueue();