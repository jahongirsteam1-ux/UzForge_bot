import { Bot, InlineKeyboard } from "grammy";
import { IBot } from "@uzforge/shared";

export const createMahsulotBot = (botData: IBot): Bot => {
  const bot = new Bot(botData.botToken);

  bot.command("start", async (ctx) => {
    const keyboard = new InlineKeyboard().text("Katalog", "catalog");
    await ctx.reply("Bizning do'konga xush kelibsiz!", { reply_markup: keyboard });
  });

  bot.on("callback_query:data", async (ctx) => {
    if (ctx.callbackQuery.data === "catalog") {
      await ctx.reply("Mahsulotlar katalogi tez orada qo'shiladi.");
    }
    await ctx.answerCallbackQuery();
  });

  bot.catch((err) => {
    console.error(`MahsulotBot error (${botData._id}):`, err);
  });

  return bot;
};
