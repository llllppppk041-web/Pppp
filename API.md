# PPPP API

This repository now includes the Nova Tutor-compatible API from `Nova-tutor`.

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

## Endpoints

### Health check

```text
GET /api/health
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
  "history": [
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Namaste!"}
  ]
}
```

Response:

```json
{"reply":"Your answer here"}
```

The API keeps provider credentials server-side and forwards requests to the local LiteLLM gateway by default. Do not commit `.env` or API keys.
