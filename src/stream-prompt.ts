let session: any;

const queue: {
  prompt: string;
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}[] = [];

let isProcessing = false;

const processQueue = async () => {
  if (isProcessing || queue.length === 0) return;
  isProcessing = true;
  const { prompt, resolve, reject } = queue.shift()!;
  try {
    if (!session) {
      session = await window.ai.createTextSession();
    }
    const stream = await session.promptStreaming(prompt);
    resolve(stream as ReadableStream);
  } catch (error) {
    reject(error);
  } finally {
    isProcessing = false;
    processQueue();
  }
};

/**
 * If another prompt is running, it will be queued.
 * @param prompt - The prompt to send to the local LLM
 * @returns A stream of tokens from the LLM. You can use for await to get the stream.
 */
export const streamPrompt = (prompt: string) => {
  return new Promise((resolve, reject) => {
    queue.push({ prompt, resolve, reject });
    processQueue();
  });
};
