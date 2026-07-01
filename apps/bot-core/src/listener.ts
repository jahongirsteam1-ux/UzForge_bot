import { Bot } from "grammy";
import { PendingDeposit, User, Transaction } from "@uzforge/shared";
import { bot as mainBot } from "./bot";

export const startListenerBot = () => {
    const LISTENER_TOKEN = process.env.LISTENER_BOT_TOKEN;
    if (!LISTENER_TOKEN || LISTENER_TOKEN === "test_token") return;
    
    const listenerBot = new Bot(LISTENER_TOKEN);

    listenerBot.on("channel_post:text", async (ctx) => {
        const text = ctx.channelPost.text;
        
        // Qidirish uchun oddiy regex.
        // Misol: "Humo *1234 dan 5347 so'm kirim qilindi"
        const match = text.replace(/,/g, "").match(/(\d+)\s*(?:so'?m|uzs)/i);
        if (match) {
            const amount = parseInt(match[1]);
            
            // Faqat reserved holatdagini atomik tarzda yangilaymiz
            const deposit = await PendingDeposit.findOneAndUpdate(
                { uniqueAmount: amount, status: "reserved" },
                { status: "success", matchedRawMessage: text }
            );

            if (deposit) {
                // Balansni baseAmount summasiga oshiramiz
                const user = await User.findOneAndUpdate(
                    { telegramId: deposit.userId },
                    { $inc: { balance: deposit.baseAmount, totalDeposited: deposit.baseAmount } },
                    { new: true }
                );

                await Transaction.create({
                    userId: deposit.userId,
                    type: "deposit",
                    amount: deposit.baseAmount,
                    provider: "internal",
                    status: "success"
                });

                try {
                    await mainBot.api.sendMessage(
                        deposit.userId, 
                        `✅ Hisobingiz muvaffaqiyatli ${deposit.baseAmount} so'mga to'ldirildi!\nJoriy balansingiz: ${user?.balance} so'm.`
                    );
                } catch (e) {
                    console.error("Foydalanuvchiga xabar yuborishda xato", e);
                }
            }
        }
    });

    listenerBot.start({
        onStart: (botInfo) => {
            console.log(`Listener Bot @${botInfo.username} started`);
        }
    });
};
