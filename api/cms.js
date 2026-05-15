export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: '不允許的方法' });

 const GAS_URL = process.env.GAS_URL;
  const API_KEY = process.env.API_KEY;

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
