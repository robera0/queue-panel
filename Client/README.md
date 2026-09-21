# Queue Room

A live dashboard for `queue_backend` (Flask + Asterisk AMI). Polls
`/api/queues` every 4s and lets a supervisor pause/resume agents.

## Setup

```bash
npm install
cp .env.example .env   # point at your Flask app if not on localhost:5000
npm run dev
```

Run `queue_backend`'s `app.py` alongside it (`python app.py`, default
port 5000). CORS is already open on the backend via `flask_cors`.

## API contract this frontend assumes

From `app.py` / `ami.py` as written today:

- `GET /api/queues` → `{ status, data: { [queueName]: Queue } }`
- `POST /api/agent/pause` → body `{ interface, queue, reason, paused }`
- `POST /api/call/hangup` → body `{ channel }` — **not wired up yet**:
  `ami.py`'s `QueueEntry` parsing doesn't capture a channel per caller,
  so there's no ID to hang up on. Add `'Channel'` to the fields pulled
  off `QueueEntry` events in `ami.py`, expose it as `caller.channel` in
  `get_queue_data()`, and add a `channel` field to the `Caller` type
  here — then a hangup button can call `hangupCall()` from
  `src/api/client.ts`.

There's no push/websocket channel in the backend, so this frontend
polls rather than subscribes.

## File map

- `src/api/client.ts` — fetch wrapper for the three endpoints
- `src/types/queue.ts` — types mirrored from `ami.py`'s JSON shape
- `src/hooks/useQueues.ts` — polling + loading/error state
- `src/components/` — `Header`, `QueueCard`, `AgentRow`, `CallerRow`
- `src/App.tsx` — layout + pause/resume wiring
