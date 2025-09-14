export default async function handler(req, res) {
  const { code, state } = req.query;

  if (!code) {
    return res.status(400).send("Нет кода авторизации");
  }

  // при желании: проверяй state
  // if (state !== process.env.OAUTH_STATE) return res.status(400).send("bad state");

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: process.env.YOOMONEY_CLIENT_ID,
    client_secret: process.env.YOOMONEY_CLIENT_SECRET,
    redirect_uri: process.env.YOOMONEY_REDIRECT_URI,
  });

  try {
    const r = await fetch("https://yoomoney.ru/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const json = await r.json();

    if (!r.ok || !json.access_token) {
      return res
        .status(400)
        .send(`Ошибка получения токена: ${json.error || "unknown"}`);
    }

    // В проде токен не логируем. Можно показать только «хвост»,
    // а сам токен сохранять в своём бекенде/хранилище.
    const tail = json.access_token.slice(-4);
    return res.status(200).send(`Готово! Токен получен (…${tail}).`);
  } catch (e) {
    return res.status(500).send("Server error");
  }
}
