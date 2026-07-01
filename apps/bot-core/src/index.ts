import Fastify from "fastify";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";
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

// Dinamik webhook router
fastify.post("/webhook/:botId", async (request, reply) => {
  const { botId } = request.params as { botId: string };
  
  // Asosiy bot uchun webhook
  if (botId === "main") {
    return webhookCallback(bot, "fastify")(request, reply);
  }

  const subBot = botRegistry.getBot(botId);

  if (!subBot) {
    fastify.log.warn(`Webhook keldi, lekin bot topilmadi: ${botId}`);
    return reply.status(404).send("Bot not found in registry");
  }

  // Yana grammy orqali requestni davom ettirish
  return webhookCallback(subBot, "fastify")(request, reply);
});

const start = async () => {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/uzforge";
    await mongoose.connect(uri);
    fastify.log.info("Connected to MongoDB");

    if (process.env.BOT_TOKEN && process.env.BOT_TOKEN !== "test_token") {
      const webhookDomain = process.env.WEBHOOK_BASE_URL;
      if (webhookDomain) {
        const webhookUrl = `${webhookDomain}/webhook/main`;
        try {
          await bot.api.setWebhook(webhookUrl, { drop_pending_updates: true });
          fastify.log.info(`Webhook set for main bot: ${webhookUrl}`);
        } catch (err) {
          fastify.log.error(`Failed to set webhook: ${err}`);
        }
      } else {
        fastify.log.warn("WEBHOOK_BASE_URL is missing! Bot cannot receive updates.");
      }
      // Listener botni ishga tushirish
      startListenerBot();
    } else {
      fastify.log.warn("BOT_TOKEN is not set properly, bot will not start");
    }

    const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
    await fastify.listen({ port, host: '0.0.0.0' });
    fastify.log.info(`Server is running on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
