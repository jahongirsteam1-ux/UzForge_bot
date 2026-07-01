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
      bot.start({
        onStart: (botInfo) => {
          fastify.log.info(`Bot @${botInfo.username} started`);
        }
      });
      // Listener botni ishga tushirish
      startListenerBot();
    } else {
      fastify.log.warn("BOT_TOKEN is not set properly, bot will not start");
    }

    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    fastify.log.info("Server is running on port 3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
