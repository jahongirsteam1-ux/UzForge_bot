import { Bot, InlineKeyboard } from "grammy";
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

  const keyboard = new InlineKeyboard()
    .text("🤖 Bot yaratish", "create_bot")
    .text("📦 Botlarim", "my_bots").row()
    .text("🎁 Referal", "referral")
    .text("💳 Hisob to'ldirish", "deposit").row()
    .webApp("🌐 Mini App'ni ochish", process.env.WEBHOOK_BASE_URL || "https://example.com").row()
    .text("📚 Qo'llanma", "help")
    .text("✉️ Murojaat", "support").row()
    .text("🛒 Shablonlar do'koni", "store")
    .text("📊 Statistika", "stats").row()
    .text("📲 Shaxsiy kabinet", "profile");

  await ctx.reply(`Assalomu alaykum, ${firstName}! UzForge bot yaratish platformasiga xush kelibsiz.`, {
    reply_markup: keyboard
  });
});

bot.on("callback_query:data", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply("Bu bo'lim tez orada ishga tushadi!");
});
