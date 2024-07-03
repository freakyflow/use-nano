# Use Nano
Convenience wrapper for Gemini Nano running in Chrome preview builds with AI features switched on.

Optimized for instant and high-frequency inference. Currently, window.ai does not allow queueing and will cancel any ongoing request when a new request comes in. This package implements a queue that waits for the current request to finish before starting a new one. You can also clear the queue if you want to cancel all current and pending inference requests.

- Streaming response from the model
- Queueing of prompts 
- Automatic canceling
- `useNano` hook for React that immediately submits a prompt and streams the output
- Type declarations for Chrome's new `window.ai` object

# Installation

Make sure you're running Chrome Dev or Chrome Canary with AI features enabled. 

```bash
npm install https://github.com/freakyflow/use-nano
```

# Usage

Install the package. 

## Using the `useNano` hook
Creating a simple, instant inference UI:

```jsx
"use client";

import { useNano } from "@/lib/use-nano/use-nano";
import { useState } from "react";

export default function TestPage() {
  const [input, setInput] = useState("Who are you?");
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

### Clear the queue with the hook

```js
const output = useNano("Who are you?", { clearQueue: true });
```

## Stream

```js
promptQueue.enqueue("Who are you?", response => console.log(response));
```

## Clear queue

```js
promptQueue.clear();
```