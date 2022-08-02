import { Router } from "express";
import { register } from "prom-client";

const router = Router();

router.get("/metrics", async (_req, res) => {
  try {
    const data = await register.metrics();
    res.set("Content-Type", register.contentType);
    res.end(data);
  } catch (err) {
    if (err instanceof Error) {
      const body = err.stack?.toString() || err.toString();
      res.status(500).end(body);
      return;
    }
    res.status(500).end(`${err}`);
  }
});

export default router;
