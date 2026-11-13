import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    if (req.method === "GET") {
      // ดึงยอดชามปัจจุบัน (ถ้ายังไม่เคยมีให้เริ่มที่ 0)
      const count = (await redis.get("bowl_count")) || 0;
      return res.status(200).json({ count });
    }

    if (req.method === "POST") {
      // บวกยอดชามเพิ่มทีละ 1 แบบถาวร
      const newCount = await redis.incr("bowl_count");
      return res.status(200).json({ count: newCount });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
