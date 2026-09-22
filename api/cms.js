export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: '不允許的方法' });

  // 🛡️ 1. 來源白名單防護網 (防禦同業惡意腳本)
  const referer = req.headers.referer || req.headers.origin || "";
  if (!referer.includes("amore-beauty-web.vercel.app") && !referer.includes("localhost")) {
    // 開發測試期間不會阻擋，上線後可將此防護啟動
    // return res.status(403).json({ status: "error", message: "Forbidden: 來源未授權" });
  }

  const GAS_URL = process.env.GAS_URL;
  const API_KEY = process.env.API_KEY;

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    // 🛡️ 2. API 動作白名單 (阻擋駭客嘗試未知的操作)
    const allowedActions = ["checkBalance", "getConfig", "trackClick", "getReportData", "saveConfig", "searchCustomer", "getDailyRecords"];
    if (!allowedActions.includes(body.action)) {
        return res.status(403).json({ status: "error", message: "Forbidden: 未授權的操作" });
    }

    // 🛡️ 3. VIP 密碼驗證 (無縫相容：同時支援明碼與亂碼 Token)
    if (body.action === "checkBalance") {
      let rawPhone = "";
      let rawPin = "";

      if (body.token) {
         // 解析亂碼模式
         const tokenStr = Buffer.from(body.token, 'base64').toString('utf-8');
         const parts = tokenStr.split("||");
         if (parts.length === 3 && parts[2] === "AmoreVIP") {
             rawPhone = parts[0];
             rawPin = parts[1];
         }
         delete body.token;
      } else {
         // 相容原本的明碼模式 (保證不影響現有功能)
         rawPhone = body.phone || "";
         rawPin = body.pin || "";
      }

      const cleanPhone = rawPhone.replace(/[- ]/g, "");
      if (rawPin !== cleanPhone.slice(-4)) {
        return res.status(400).json({ status: "error", message: "❌ 密碼錯誤", found: false });
      }
      
      body.phone = cleanPhone;
      delete body.pin; // 攔截密碼，不讓密碼傳遞到 Google 端
    }

    // 將 Vercel 保險箱的鑰匙掛上去
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
