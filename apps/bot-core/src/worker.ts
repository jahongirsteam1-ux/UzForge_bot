import { Worker } from "bullmq";
import { Bot as DBBot } from "@uzforge/shared";
import IORedis from "ioredis";
import { botRegistry } from "./registry";
import { initializeBotFromTemplate } from "./templates";

const connection = new IORedis(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
  maxRetriesPerRequest: null,
});

export const deployWorker = new Worker(
  "bot-deploy",
  async (job) => {
    const { botId } = job.data;
    console.log(`[Worker] Bot deploy qilinmoqda: ${botId}`);

    const botData = await DBBot.findById(botId);
    if (!botData) {
      throw new Error(`Bot bazadan topilmadi: ${botId}`);
    }

    try {
      // Shablon asosida grammY bot instance yaratish
      const bot = initializeBotFromTemplate(botData);

      // Webhook ulanishini o'rnatish
      const webhookUrl = `${process.env.WEBHOOK_BASE_URL}/webhook/${botData._id.toString()}`;
      await bot.api.setWebhook(webhookUrl);
      
      // Registry ga qo'shish
      botRegistry.addBot(botData._id.toString(), bot);

      botData.status = "running";
      await botData.save();

      console.log(`[Worker] Bot muvaffaqiyatli ishga tushdi: @${botData.botUsername}`);
    } catch (err) {
      console.error(`[Worker] Bot deployda xato:`, err);
      botData.status = "error";
      await botData.save();
      throw err; // retry uchun xatoni qaytarish
    }
  },
  { connection }
);

deployWorker.on("completed", (job) => {
  console.log(`Job completed: ${job.id}`);
});

deployWorker.on("failed", (job, err) => {
  console.error(`Job failed: ${job?.id} with error:`, err);
});
