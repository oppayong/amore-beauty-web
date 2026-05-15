export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: '不允許的方法' });

  // 這裡已經改成讀取 Vercel 隱藏保險箱的設定了
  const GAS_URL = process.env.GAS_URL;
  const API_KEY = process.env.API_KEY;

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    // 👇👇👇 ★ 新增的末四碼驗證防護 ★ 👇👇👇
    if (body.action === "checkBalance") {
      // 確保將手機號碼中的空白或橫線過濾掉，以防客人輸入 0912-345-678
      const cleanPhone = (body.phone || "").replace(/[- ]/g, "");
      const pin = body.pin || "";
      
      // 如果輸入的密碼 不是 手機號碼的最後4個字
      if (pin !== cleanPhone.slice(-4)) {
        return res.status(400).json({ status: "error", message: "❌ 密碼錯誤", found: false });
      }
    }
    // 👆👆👆 驗證防護結束 👆👆👆

    // 驗證通過，才會把保險箱鑰匙加上去，送給 Google 後台
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
