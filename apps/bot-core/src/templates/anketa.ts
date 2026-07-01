import { Bot } from "grammy";
import { IBot } from "@uzforge/shared";

export const createAnketaBot = (botData: IBot): Bot => {
  const bot = new Bot(botData.botToken);

  bot.command("start", async (ctx) => {
    await ctx.reply("Anketani to'ldirish uchun ismingizni kiriting:");
  });

  bot.on("message:text", async (ctx) => {
    await ctx.reply("Javobingiz qabul qilindi! Adminlarimiz siz bilan bog'lanishadi.");
  });

  bot.catch((err) => {
    console.error(`AnketaBot error (${botData._id}):`, err);
  });

  return bot;
};
