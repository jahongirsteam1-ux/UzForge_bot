import { Bot as GrammyBot, Keyboard } from "grammy";
import { User, Bot as DBBot } from "@uzforge/shared";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../../.env") });

const token = process.env.BOT_TOKEN || "test_token";
export const bot = new GrammyBot(token);

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
  const telegramId = ctx.from?.id;
  if (!telegramId) return;

  const user = await User.findOne({ telegramId });
  if (!user) return;

  switch (text) {
    case "🤖 Bot yaratish":
      await ctx.reply("Yangi bot yaratish uchun pastdagi <b>🌐 Mini App'ni ochish</b> tugmasini bosing yoki tayyor shablonlardan birini tanlang.", { parse_mode: "HTML" });
      break;

    case "📦 Botlarim": {
      const bots = await DBBot.find({ ownerId: telegramId });
      if (bots.length === 0) {
        await ctx.reply("Sizda hozircha faol botlar yo'q. Yangi bot yaratish uchun <b>🤖 Bot yaratish</b> bo'limiga o'ting.", { parse_mode: "HTML" });
      } else {
        let msg = "<b>Sizning botlaringiz:</b>\n\n";
        bots.forEach((b: any, i: number) => {
          msg += `${i + 1}. @${b.botUsername} - Status: <b>${b.status}</b>\n`;
        });
        await ctx.reply(msg, { parse_mode: "HTML" });
      }
      break;
    }

    case "🎁 Referal": {
      const botInfo = await ctx.api.getMe();
      const refLink = `https://t.me/${botInfo.username}?start=${telegramId}`;
      await ctx.reply(`<b>🎁 Referal dasturi!</b>\n\nQuyidagi havola orqali do'stlaringizni taklif qiling va har bir do'stingiz uchun bonus oling!\n\nSizning havolangiz:\n${refLink}\n\n👥 Taklif qilinganlar: <b>${user.referralCount}</b> ta\n💰 Ishlangan daromad: <b>${user.referralEarnings}</b> so'm`, { parse_mode: "HTML" });
      break;
    }

    case "💳 Hisob to'ldirish":
      await ctx.reply("<b>💳 Hisobni to'ldirish:</b>\n\nTo'lovni amalga oshirish uchun Mini App ga kiring yoki to'g'ridan to'g'ri plastik karta orqali to'lang (Hozircha test rejimida).", { parse_mode: "HTML" });
      break;

    case "📚 Qo'llanma":
      await ctx.reply("<b>📚 UzForge Qo'llanmasi</b>\n\nUzForge - bu Telegram botlarni dasturlashsiz (kod yozmasdan) yaratish imkonini beruvchi platforma. Barcha sozlamalar qulay Mini App orqali boshqariladi.", { parse_mode: "HTML" });
      break;

    case "✉️ Murojaat":
      await ctx.reply("<b>✉️ Murojaat uchun:</b>\n\nSavol yoki takliflaringiz bo'lsa adminga murojaat qiling: @admin", { parse_mode: "HTML" });
      break;

    case "🛒 Shablonlar do'koni":
      await ctx.reply("<b>🛒 Shablonlar do'koni</b>\n\nTurli xil yo'nalishdagi tayyor bot shablonlarini Mini App orqali xarid qilishingiz yoki tekinga o'rnatishingiz mumkin.", { parse_mode: "HTML" });
      break;

    case "📊 Statistika": {
      const totalUsers = await User.countDocuments();
      const totalBots = await DBBot.countDocuments();
      await ctx.reply(`<b>📊 UzForge Umumiy Statistikasi:</b>\n\n👥 Jami foydalanuvchilar: <b>${totalUsers}</b> ta\n🤖 Jami botlar: <b>${totalBots}</b> ta`, { parse_mode: "HTML" });
      break;
    }

    case "📲 Shaxsiy kabinet":
      await ctx.reply(`<b>📲 Shaxsiy kabinetingiz:</b>\n\n👤 Ism: <b>${user.firstName}</b>\n💰 Balans: <b>${user.balance}</b> so'm\n💳 Jami to'ldirilgan: <b>${user.totalDeposited}</b> so'm\n🌟 Status: <b>${user.tier.toUpperCase()}</b>`, { parse_mode: "HTML" });
      break;
  }
});
