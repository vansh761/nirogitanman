# API Reference

## `apps/web`

### `POST /api/ai-chat`
Streams a Groq-generated reply for the Niro AI widget.

**Request body**
```json
{ "messages": [{ "role": "user", "content": "What should I eat for better digestion?" }] }
```
- `messages` — last 20 turns are kept server-side; each message capped at
  4000 characters.

**Response**
`text/plain` stream of the assistant's reply, chunked as it's generated.

**Errors**
- `400` — missing `messages`
- `503` — `GROQ_API_KEY` not configured on the server
- `500` — unexpected failure

System prompt (`src/lib/groq.ts`) restricts the model to educational
Ayurveda/wellness guidance and instructs it to defer to real doctors for
anything urgent or diagnostic — it is never allowed to name a specific
disease or dosage.

All four routes below write to Postgres and were tested end-to-end
(booking → DB row; contact → DB row; newsletter → DB row; payment →
order → verify → appointment confirmed).

### `POST /api/appointments`
Creates (or reuses) a user + patient record by email, then inserts an
`appointments` row with status `PENDING`.

### `POST /api/contact`
Inserts a `contact_messages` row, visible on the dashboard's Messages page.

### `POST /api/newsletter`
Inserts into `newsletter_subscribers` (idempotent — repeat emails are a no-op).

### `POST /api/payments/create-order`
Creates a pending payment row and either a real Razorpay order (if
`RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET` are set) or a demo-mode response.

**Request:** `{ "appointmentId": "apt-..." }`
**Response (configured):** `{ demo: false, orderId, amount, currency, keyId, appointmentId }`
**Response (demo mode):** `{ demo: true, amount, currency, appointmentId }`

### `POST /api/payments/verify`
Verifies the Razorpay signature (HMAC-SHA256 of `orderId|paymentId` using
the secret) and, on success, marks the payment `SUCCESS` and the linked
appointment `CONFIRMED`. In demo mode, skips signature verification and
marks success directly — same end state, no live gateway required.

**Request (real):** `{ appointmentId, razorpay_order_id, razorpay_payment_id, razorpay_signature }`
**Request (demo):** `{ appointmentId, demo: true }`

_Previously planned, now implemented — kept here for history:_ appointments,
contact, and newsletter routes below were TODOs in an earlier draft of this
doc and are now real, tested endpoints (see above).

## `apps/dashboard`

### `GET|POST /api/auth/[...nextauth]`
NextAuth v5 route handler — credentials sign-in, JWT session, `role` claim
attached in the `jwt`/`session` callbacks (`src/lib/auth.ts`).

### Middleware
`src/middleware.ts` runs on every `/dashboard/*` request:
1. No session → redirect to `/login?from=<path>`.
2. Session but `canAccess(role, pathname)` is false → redirect to
   `/dashboard/forbidden`.
3. Otherwise → request proceeds.

`canAccess` and the role→route matrix live in `src/lib/rbac.ts`.
