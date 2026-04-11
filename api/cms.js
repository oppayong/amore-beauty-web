export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: '不允許的方法' });

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbxvn2KhszNFtcEAczf11vGCb7fRN7RJGHMWvRIr9mP6rgo6-_9tEHs754Bwci77DdKj/exec';
  const API_KEY = 'AMORE_SECURE_KEY_2026';

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    body.apiKey = API_KEY; 

    const googleResponse = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body)
    });

    const data = await googleResponse.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ status: "error", message: "伺服器連線異常" });
  }
}
