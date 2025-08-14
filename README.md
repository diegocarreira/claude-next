## Claude Next (Claude chat UI in Next.js)


A lightweight, local-first A.I. chat UI for Anthropic Claude API built with Next.js (App Router) and React. 

No backend required: enter your Anthropic API key in the browser and start chatting. Responses support Markdown rendering.

Designed for personal use, if you are subscriber of Anthropic API-only and want to take advantage of a chat interface. You paste your own API key locally.

### Features

- **Model selection**: Pick from multiple Claude models via a dropdown.
- **System prompt editing**: Toggle a panel to set conversation-wide instructions.
- **Multi-conversation**: Sidebar with conversation list; click to switch; start a new chat.
- **Local persistence**: API key, conversations, selected model, and system prompt are saved in `localStorage`.
- **Markdown responses**: Assistant messages render via `react-markdown`.
- **Keyboard shortcuts**: Enter to send; Shift+Enter for a new line.
- **Clear chat**: One-click clear with confirmation.
- **Typing indicator**: Simple non-streaming loading state.

### Security notice (read first)

- **Browser-only API calls**: This UI uses `@anthropic-ai/sdk` with `dangerouslyAllowBrowser: true` and stores your API key in your browser's `localStorage`.

### Per-user API key (intended use)

This app is intended for personal use: you use your own Anthropic API key in your own browser. The key is stored locally in your browser's storage.

- This is fine for local/self-hosted use.
- Do not paste your key into untrusted public sites.
- If you plan to go live for many users, strongly consider moving API calls server-side (proxy endpoint) and keeping the key on the server.

### Requirements

- Node.js 20+ (recommended) or 18.18+
- npm 10+ (or yarn/pnpm/bun)

### Quick start

```bash
npm install
npm run dev
# open http://localhost:3000
```

### Using the app

1. Open the app and click **Settings** to enter your Anthropic API key. It is saved locally in your browser.
2. Optionally click **System** to edit the system prompt that guides the conversation.
3. Choose a model from the dropdown.
4. Type a message and press Enter to send (Shift+Enter adds a new line).
5. Use **Clear Chat** to reset the conversation (with confirmation).

### How it works

- The main UI lives in `src/app/page.tsx`.
- Calls Anthropic Messages API via `@anthropic-ai/sdk`:
  - Passes your conversation history, selected model, system prompt, and `max_tokens`.
  - Responses are shown in the chat and rendered as Markdown.
- Persists these keys in `localStorage`:
  - `claude-api-key`
  - `claude-conversations` (array of conversation objects)
  - `claude-selected-model`
  - `claude-system-message`

### Configuration & customization

- **Models**: Update the models list in `src/claude-models.json` to add/remove models or change the available options.

```json
// src/claude-models.json
[
  { "id": "claude-sonnet-4-20250514", "name": "Claude Sonnet 4" },
  { "id": "claude-3-7-sonnet-20250219", "name": "Claude 3.7 Sonnet" },
  // Add your preferred models here
]
```

- **Default system message**: Change the initial value of `systemMessage` in `src/app/page.tsx`.
- **Token limits and parameters**: Adjust `max_tokens` and other call parameters in the Anthropic client call.
- **Streaming**: Currently responses are non-streaming. You can upgrade to streaming by switching to a streaming API call and rendering tokens incrementally.

### Project structure

- `src/app/page.tsx` – Chat UI and client-side logic
- `src/app/layout.tsx` – App layout
- `src/app/globals.css` – Global styles (Tailwind CSS v4)
- `public/` – Static assets
- `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs` – Build and tooling

### Tech stack

- Next.js 15 (App Router), React 19
- Tailwind CSS v4
- `@anthropic-ai/sdk`
- `react-markdown`

### Deploying

- You can deploy to any static/SSR platform that supports Next.js.
- For BYO-in-browser deployments: prefer local/self-hosted or trusted-audience environments and apply the mitigations above.
- For public, multi-tenant deployments: use a server/edge proxy and keep `ANTHROPIC_API_KEY` on the server. Remove `dangerouslyAllowBrowser` and read the key from server environment variables; add server-side rate limiting and abuse protections.

### Troubleshooting

- "Please enter your API key first": Open **Settings** and paste your key.
- Messages not saving: Ensure your browser allows `localStorage`. Clear site data and try again.
- API errors: Verify your key, model availability, and network connectivity.

### License

No license file is included. If you plan to open-source or distribute this project, add a license of your choice.
