import { useEffect, useState } from "react";
import { promptQueue } from "./prompt-queue";

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
            promptQueue.enqueue(prompt, t => { 
                setOutput(t)
            })            
        }
        go()
    }, [prompt])


    return output;
};