# Dashboard Service

Node.js backend that powers a personalized crypto dashboard. It ingests live market data, fetches curated news, generates AI-based insights or memes, and stores end-user preferences so a frontend can render dynamic dashboards. The service exposes both REST and WebSocket interfaces and is built with Express, Socket.IO, Axios, and Mongoose.

## Features
- **User profile CRUD** - persist investor preferences via MongoDB so AI and content responses can be contextualized.
- **AI insights** - wrap Google Gemini through `@google/genai` to generate tailored guidance or meme prompts.
- **News aggregation** - fetch and normalize CryptoPanic articles for downstream consumption.
- **Crypto market data** - hydrate dashboards with CoinGecko spot prices through both REST (`/api/crypto`) and a streaming Socket.IO channel.
- **Meme discovery** - search meme/GIF APIs directly or derive prompts from the latest news cycle.
- **CORS-friendly gateway** - single server that enables both REST endpoints and WebSocket events for any frontend origin during development.

## Architecture
```
server.js
|- routes/ (REST surface mounted at /api)
|  |- userDataRoutes.js -> wires controllers
|- controllers/ (request validation/orchestration)
|  |- userDataController.js  -> CRUD + query helpers
|  |- aiController.js        -> Gemini-backed responses
|  |- newsController.js      -> CryptoPanic fetcher
|  |- memeController.js      -> Meme discovery
|  |- cryptoController.js    -> CoinGecko proxy
|- services/ (API integrations & utilities)
|  |- aiService.js           -> Gemini helper + prompt builder
|  |- cryptoService.js       -> CoinGecko wrapper
|  |- memeService.js         -> Meme API client
|  |- newsService.js         -> CryptoPanic client
|- sockets/cryptoSocket.js   -> `prices` Socket.IO namespace
|- models/UserData.js        -> Mongoose schema
```

`server.js` configures Express middleware (body parsing, CORS), mounts `/api` routes, registers error handling, and instantiates Socket.IO on the same HTTP server. The socket layer polls CoinGecko every `INTERVAL_MS` (default `120s`) for whichever symbol list the client last provided and emits updates via the `prices` channel.

## Prerequisites
- Node.js 20+ and npm
- Running MongoDB instance reachable through `DB_URI`
- API credentials:
  - Google Gemini (`GEMINI_API_KEY`)
  - CryptoPanic (`CRYPTOPANIC_API_KEY`)
  - Meme / GIF provider (`MEME_API_KEY`)
  - CoinGecko (`COINGECKO_API_KEY`)

## Environment Variables
Create a `.env` at the repo root (never commit production secrets). Example:

```dotenv
PORT=5002
DB_URI=mongodb://localhost:27017/dashboard-service
CLIENT_ORIGIN=http://localhost:4200
GEMINI_API_KEY=your-google-gemini-key
AI_MODEL=gemini-2.5-flash
CRYPTOPANIC_API_KEY=your-cryptopanic-token
CRYPTOPANIC_BASE_URL=https://cryptopanic.com/api/v1/posts/
MEME_API_KEY=your-meme-api-key
MEME_API_BASE_URL=https://api.apileague.com/search-gifs
COINGECKO_API_KEY=your-coingecko-key
COINGECKO_API_BASE_URL=https://api.coingecko.com/api/v3/simple/price
```

> **Note:** `server.js` currently expects MongoDB to be connected before CRUD routes are hit. Add `mongoose.connect(process.env.DB_URI)` somewhere during bootstrap or ensure another module initializes the connection.

## Installation & Local Development
```bash
npm install
# Optionally add nodemon for auto-reload (already listed as dependency)
npx nodemon server.js   # or: node server.js
```

The server logs `Server listening on port <PORT>` once ready. REST endpoints default to `http://localhost:5002/api/...`.

## API Reference

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/userdata` | Create a profile (`name`, `email`, optional `assets`, `investorType`, `contentType[]`). |
| `GET`  | `/api/userdata` | List all stored user documents. |
| `GET`  | `/api/userdata/:id` | Fetch a profile by Mongo `_id`. |
| `GET`  | `/api/userdata/email/:email` | Fetch a profile by email. |
| `PUT`  | `/api/userdata/:id` | Update profile fields. |
| `DELETE` | `/api/userdata/:id` | Remove a profile. |
| `POST` | `/api/ai` | Send `{ "prompt": "..." }` and receive AI-generated text. |
| `POST` | `/api/aiInsights` | Body combines user preferences + optional overrides; endpoint pulls CryptoPanic news and returns AI-crafted insights. |
| `GET`  | `/api/news` | Normalized CryptoPanic feed. |
| `POST` | `/api/meme` | Provide `{ "title": "bear market" }` to fetch a matching meme URL. |
| `POST` | `/api/memeAI` | Provide user context; service will build a prompt from live news, get AI keywords, then fetch a meme URL. |
| `GET`  | `/api/crypto` | Proxy to CoinGecko, returning `usd` quotes and 24h change for IDs defined in `cryptoService`. |

### Sample: create a user profile
```bash
curl -X POST http://localhost:5002/api/userdata \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Casey",
    "email": "casey@example.com",
    "assets": ["btc", "eth"],
    "investorType": "long_term",
    "contentType": ["insights", "memes"]
  }'
```

### Sample: request insights
```bash
curl -X POST http://localhost:5002/api/aiInsights \
  -H "Content-Type: application/json" \
  -d '{ "assets": ["btc"], "riskTolerance": "medium" }'
```
The controller will pull latest CryptoPanic posts, enrich the prompt with your payload, and return Gemini text.

## WebSocket Stream
- Endpoint: `ws://localhost:5002` (Socket.IO)
- Client event: `set_crypto_ids` -> body can be `["bitcoin","ethereum"]` or `"bitcoin,ethereum"`
- Server emits:
  - `prices` - payload straight from CoinGecko (`{ bitcoin: { usd: 42000, usd_24h_change: -1.2 }, ... }`)
  - `prices_error` - indicates validation or fetch failures

```js
import { io } from "socket.io-client";
const socket = io("http://localhost:5002");
socket.emit("set_crypto_ids", ["bitcoin", "solana"]);
socket.on("prices", (data) => console.log(data));
socket.on("prices_error", (err) => console.error(err));
```

## Testing
There are no automated tests yet (`npm test` exits intentionally). For now rely on manual calls (cURL, Postman, or the included `client.html`) and consider adding integration tests around the REST controllers when time permits.

## Troubleshooting
- **401/403 from external APIs** - verify each provider key is present and has remaining quota.
- **Mongo validation errors** - make sure `name` and `email` are provided and unique.
- **Socket emits nothing** - you must emit `set_crypto_ids` at least once; also ensure CoinGecko rate limits are not exceeded.
- **CORS issues** - override `CLIENT_ORIGIN` in `.env` with your frontend URL when moving past local development.

## Next Steps
1. Add a startup script (`npm run start`) and wire up the missing `mongoose.connect`.
2. Implement request validation (e.g., Zod/Joi) before controllers hit external APIs.
3. Add caching for CryptoPanic responses when their rate limit becomes restrictive.
