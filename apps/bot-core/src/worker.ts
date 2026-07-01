import { Worker, Queue } from "bullmq";
import { Bot as DBBot } from "@uzforge/shared";
import { botRegistry } from "./registry";
import { initializeBotFromTemplate } from "./templates";

// REDIS_URL ni BullMQ plain connection options ga parse qiluvchi helper.
// BullMQ'ga IORedis instance emas, plain object berish kerak — monorepo da
// ioredis versiyalari har xil bo'lganda tip konflikti bo'lmasin deb.
function parseRedisUrl(url: string): {
  host: string;
  port: number;
  password?: string;
  maxRetriesPerRequest: null;
} {
  try {
    const parsed = new URL(url);
    return {
      host: parsed.hostname || "127.0.0.1",
      port: parsed.port ? Number(parsed.port) : 6379,
      password: parsed.password || undefined,
      maxRetriesPerRequest: null,
    };
  } catch {
    return {
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: Number(process.env.REDIS_PORT || 6379),
      password: process.env.REDIS_PASSWORD || undefined,
      maxRetriesPerRequest: null,
    };
  }
}

// BullMQ uchun plain connection options — IORedis instance emas
const redisConnection = parseRedisUrl(
  process.env.REDIS_URL || "redis://127.0.0.1:6379"
);

// Bot deploy queue
export const botDeployQueue = new Queue("bot-deploy", {
  connection: redisConnection,
});

// Broadcast queue (kelajakda ishlatish uchun)
export const broadcastQueue = new Queue("broadcast", {
  connection: redisConnection,
});

// Deposit expiry queue (pending depositlarni muddati o'tgach expired qilish)
export const depositExpiryQueue = new Queue("deposit-expiry", {
  connection: redisConnection,
});

// Bot deploy worker
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
      const bot = initializeBotFromTemplate(botData);

      const webhookUrl = `${process.env.WEBHOOK_BASE_URL}/webhook/${botData._id.toString()}`;
      await bot.api.setWebhook(webhookUrl);

      botRegistry.addBot(botData._id.toString(), bot);

      botData.status = "running";
      await botData.save();

      console.log(`[Worker] Bot muvaffaqiyatli ishga tushdi: @${botData.botUsername}`);
    } catch (err) {
      console.error(`[Worker] Bot deployda xato:`, err);
      botData.status = "error";
      await botData.save();
      throw err;
    }
  },
  { connection: redisConnection }
);

// Deposit expiry worker — muddati o'tgan pending depositlarni avtomatik yopish
export const depositExpiryWorker = new Worker(
  "deposit-expiry",
  async (job) => {
    const { depositId } = job.data;
    // Bu yerda PendingDeposit.findByIdAndUpdate qilinadi
    console.log(`[DepositExpiryWorker] Deposit muddati o'tdi: ${depositId}`);
  },
  { connection: redisConnection }
);

deployWorker.on("completed", (job) => {
  console.log(`[deployWorker] Job completed: ${job.id}`);
});

deployWorker.on("failed", (job, err) => {
  console.error(`[deployWorker] Job failed: ${job?.id}`, err.message);
});

depositExpiryWorker.on("failed", (job, err) => {
  console.error(`[depositExpiryWorker] Job failed: ${job?.id}`, err.message);
});
