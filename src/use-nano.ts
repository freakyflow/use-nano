import { useEffect, useState } from "react";

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