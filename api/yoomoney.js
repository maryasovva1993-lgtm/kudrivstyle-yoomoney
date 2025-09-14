export default async function handler(req, res) {
  const { code, state } = req.query;

  if (!code) {
    return res.status(400).send("Нет кода авторизации");
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: process.env.YOOMONEY_CLIENT_ID,
    client_secret: process.env.YOOMONEY_CLIENT_SECRET,
    redirect_uri: process.env.YOOMONEY_REDIRECT_URI,
  });

  const r = await fetch("https://yoomoney.ru/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const json = await r.json();
  console.log("YOOMONEY TOKEN:", json);

  return res.status(200).send("Готово! Токен получен. Проверь логи Vercel.");
}
