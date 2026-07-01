import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { webhookCallback } from "grammy";
import { bot } from "./bot";
import { botRegistry } from "./registry";
import { startListenerBot } from "./listener";
import "./worker"; // worker ishga tushishi uchun

dotenv.config({ path: path.join(__dirname, "../../../.env") });

const fastify = Fastify({ logger: true });

fastify.get("/health", async () => {
  return { status: "ok" };
});

const miniappPath = path.join(__dirname, "../../../apps/miniapp/dist");
if (fs.existsSync(miniappPath)) {
  fastify.register(fastifyStatic, {
    root: miniappPath,
    prefix: "/",
  });
  fastify.log.info(`Serving miniapp from ${miniappPath}`);
} else {
  fastify.log.warn(`Miniapp dist not found at ${miniappPath}`);
  fastify.get("/", async () => {
    return { 
      status: "UzForge Bot Core API is running", 
      error: "Miniapp dist not found",
      __dirname,
      miniappPath
    };
  });
}

// Dinamik webhook router
fastify.post("/webhook/:botId", async (request, reply) => {
  const { botId } = request.params as { botId: string };
  const subBot = botRegistry.getBot(botId);

  if (!subBot) {
    fastify.log.warn(`Webhook keldi, lekin bot topilmadi: ${botId}`);
    return reply.status(404).send("Bot not found in registry");
  }

  // Yana grammy orqali requestni davom ettirish
  return webhookCallback(subBot, "fastify")(request, reply);
});

const start = async () => {
  // 1. HTTP serverni DARHOL ishga tushiramiz - Railway healthcheck shu yerga qo'shiladi
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
    await fastify.listen({ port, host: '0.0.0.0' });
    fastify.log.info(`Server is running on port ${port}`);
  } catch (err) {
    fastify.log.error("Failed to start HTTP server:", err);
    process.exit(1);
  }

  // 2. MongoDB ga ulanish (server allaqachon ishlamoqda, healthcheck o'tadi)
  try {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/uzforge";
    await mongoose.connect(uri);
    fastify.log.info("Connected to MongoDB");
  } catch (err) {
    fastify.log.error("MongoDB connection failed (non-fatal):", err);
    // MongoDB ishlamasa ham server yiqilmasin!
    return;
  }

  // 3. Botlarni ishga tushirish
  if (process.env.BOT_TOKEN && process.env.BOT_TOKEN !== "test_token") {
    try {
      await bot.api.deleteWebhook({ drop_pending_updates: true });
      fastify.log.info("Webhook dropped for main bot, starting long polling...");
    } catch (e) {
      fastify.log.warn("Failed to drop webhook, maybe it was not set.");
    }

    const startMainBotPolling = async () => {
      try {
        await bot.start({
          onStart: (botInfo) => fastify.log.info(`Bot @${botInfo.username} started`)
        });
      } catch (err) {
        fastify.log.error(`Grammy Polling Conflict: ${err}. Retrying in 5s...`);
        setTimeout(startMainBotPolling, 5000);
      }
    };

    startMainBotPolling();
    startListenerBot();
  } else {
    fastify.log.warn("BOT_TOKEN is not set properly, bot will not start");
  }
};

start();
