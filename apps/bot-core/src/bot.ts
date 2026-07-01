import { Bot, Keyboard } from "grammy";
import { User } from "@uzforge/shared";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../../.env") });

const token = process.env.BOT_TOKEN || "test_token";
export const bot = new Bot(token);

bot.command("start", async (ctx) => {
  if (!ctx.from) return;
  const { id: telegramId, username, first_name: firstName } = ctx.from;
  const startPayload = ctx.match;

  let user = await User.findOne({ telegramId });
  if (!user) {
    let referredBy: number | undefined;
    if (startPayload && !isNaN(Number(startPayload))) {
      referredBy = Number(startPayload);
    }

    user = new User({
      telegramId,
      username,
      firstName,
      referralCode: telegramId.toString(),
      referredBy
    });
    await user.save();
  } else {
    user.lastActiveAt = new Date();
    await user.save();
  }

  const keyboard = new Keyboard()
    .text("🤖 Bot yaratish")
    .text("📦 Botlarim").row()
    .text("🎁 Referal")
    .text("💳 Hisob to'ldirish").row()
    .webApp("🌐 Mini App'ni ochish", process.env.WEBHOOK_BASE_URL || "https://example.com").row()
    .text("📚 Qo'llanma")
    .text("✉️ Murojaat").row()
    .text("🛒 Shablonlar do'koni")
    .text("📊 Statistika").row()
    .text("📲 Shaxsiy kabinet")
    .resized();

  await ctx.reply(`Assalomu alaykum, ${firstName}! UzForge bot yaratish platformasiga xush kelibsiz.`, {
    reply_markup: keyboard
  });
});

bot.on("message:text", async (ctx) => {
  const text = ctx.message.text;
  if (["🤖 Bot yaratish", "📦 Botlarim", "🎁 Referal", "💳 Hisob to'ldirish", "📚 Qo'llanma", "✉️ Murojaat", "🛒 Shablonlar do'koni", "📊 Statistika", "📲 Shaxsiy kabinet"].includes(text)) {
    await ctx.reply("Bu bo'lim tez orada ishga tushadi!");
  }
});
