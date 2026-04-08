export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '不允許的方法' });
  }

  // ★★★ 請替換成您最新的 GAS 網址 ★★★
  const GAS_URL = 'https://script.google.com/macros/s/AKfycbxvn2KhszNFtcEAczf11vGCb7fRN7RJGHMWvRIr9mP6rgo6-_9tEHs754Bwci77DdKj/exec';
  const API_KEY = 'AMORE_SECURE_KEY_2026';

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const phone = body.phone;

    if (!phone) {
      return res.status(400).json({ status: "error", message: "請輸入手機號碼" });
    }

    const googleResponse = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ phone: phone, apiKey: API_KEY })
    });

    const data = await googleResponse.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ status: "error", message: "伺服器連線異常" });
  }
}
