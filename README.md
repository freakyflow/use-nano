# Use Nano
Convenience wrapper for Gemini Nano running in Chrome preview builds with AI features switched on.

Optimized for instant and high-frequency inference.

- Type declarations for the  `window.ai` object
- Streaming response from the model
- Queueing of prompts 
- Automatic canceling
- `useNano` hook for React that immediately submits a prompt and streams the output

# Usage

Install the package. 

## Using the `useNano` hook
Creating a simple, instant inference UI:

```jsx
"use client";

import { useNano } from "@/lib/use-nano/use-nano";
import { useState } from "react";

export default function TestPage() {
  const [input, setInput] = useState("");
  const output = useNano(input);
  return (
    <div>
      <input value={input} 
      onChange={(e) => setInput(e.target.value)} />
      <div>{output}</div>
    </div>
  );
}
```

## Obtain a response stream 

```js
const stream = streamPrompt("Who are you?");
for await (const chunk of stream as any) {
  console.log(chunk);
}
```
