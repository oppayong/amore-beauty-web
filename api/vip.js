export default async function handler(req, res) {
  // 只允許 POST 請求
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '不允許的方法' });
  }

  // ★ 1. 將您的 GAS 網址藏在這裡 (請換成您等一下新部署的 GAS 網址)
  const GAS_URL = 'https://script.google.com/macros/s/您的新網址/exec';
  // ★ 2. 您的專屬通關密語 (F12 絕對看不到)
  const API_KEY = 'AMORE_SECURE_KEY_2026';

  try {
    // 取得前端傳來的手機號碼
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const phone = body.phone;

    if (!phone) {
      return res.status(400).json({ status: "error", message: "請輸入手機號碼" });
    }

    // 由 Vercel 的伺服器代替前端，向 Google 試算表發送請求
    const googleResponse = await fetch(GAS_URL, {
      method: 'POST',
      // 使用 text/plain 避開 CORS 阻擋
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({ 
        phone: phone, 
        apiKey: API_KEY 
      })
    });

    // 拿到 Google 回傳的資料
    const data = await googleResponse.json();

    // 將資料轉交給前端網頁
    return res.status(200).json(data);

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ status: "error", message: "伺服器連線異常" });
  }
}
