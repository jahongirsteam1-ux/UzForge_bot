import { Bot, Context } from "grammy";
import { IBot } from "@uzforge/shared";

export const createKinoBot = (botData: IBot): Bot => {
  const bot = new Bot(botData.botToken);
  
  // Custom configdan olingan kanal ID
  const channelId = botData.config?.channelId;

  bot.command("start", async (ctx) => {
    await ctx.reply("Kino botga xush kelibsiz! Kodni yuboring:");
  });

  bot.on("message:text", async (ctx) => {
    const code = ctx.message.text;
    // Bu yerda aslida kinolar bazasidan qidiriladi.
    // Hozirgi MVP versiyada statik javob.
    await ctx.reply(`Siz ${code} kodli kinoni qidirdingiz. Kanalga obuna bo'lishni unutmang!`);
  });

  // Global xato ushlagich - bitta botdagi xato butun tizimni qulatmog'i kerak
  bot.catch((err) => {
    console.error(`KinoBot error (${botData._id}):`, err);
  });

  return bot;
};
