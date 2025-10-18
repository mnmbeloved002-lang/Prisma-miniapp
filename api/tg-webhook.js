export default async function handler(req, res) {
  // healthcheck: GET без секрета
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, endpoint: '/api/tg-webhook', method: 'GET' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'method_not_allowed' })
  }

  const got = req.headers['x-telegram-bot-api-secret-token']
  const expected = process.env.TG_WEBHOOK_SECRET

  if (expected && got !== expected) {
    console.log('Secret mismatch', { got })
    return res.status(401).json({ ok: false, error: 'unauthorized' })
  }

  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const raw = Buffer.concat(chunks).toString('utf8')

  console.log('Incoming Telegram update:', raw)
  return res.status(200).json({ ok: true })
}