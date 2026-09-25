# PPPP API

This repository includes a Nova Tutor-compatible API with support for multiple AI providers: LiteLLM, Gemini, and Groq.

## Run the LiteLLM gateway

```bash
./start.sh
```

The gateway listens on port `4000` using `config.yaml`.

## Run the API

In a second terminal:

```bash
npm install
cp .env.example .env
npm start
```

The API listens on port `3000` by default.

## Environment Configuration

Update `.env` with your API keys:

```env
# LiteLLM Configuration
AI_URL=http://localhost:4000/v1/chat/completions
AI_MODEL=swarm-coder
AI_API_KEY=your_litellm_key

# Gemini API
GEMINI_API_KEY=your_gemini_api_key

# Groq API
GROQ_API_KEY=your_groq_api_key
```

## Endpoints

### Health check

```text
GET /api/health
```

Returns available providers:
```json
{
  "ok": true,
  "service": "pppp-api",
  "providers": {
    "litellm": true,
    "gemini": true,
    "groq": true
  }
}
```

### Chat

```text
POST /api/chat
Content-Type: application/json
```

Request body:

```json
{
  "message": "Explain Newton's laws from zero",
  "subject": "Physics & Cosmos",
  "provider": "gemini",
  "history": [
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Namaste!"}
  ]
}
```

**Provider options:** `litellm` (default), `gemini`, `groq`

Response:

```json
{
  "reply": "Your answer here",
  "provider": "gemini"
}
```

## Provider Details

- **LiteLLM** (Default): Routes through local gateway on port 4000
- **Gemini**: Uses Google's Gemini Pro model via API
- **Groq**: Uses Groq's Mixtral 8x7B model via API

The API keeps provider credentials server-side and does not expose keys. Do not commit `.env` or API keys.
