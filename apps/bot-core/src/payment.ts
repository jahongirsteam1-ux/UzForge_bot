import { PendingDeposit } from "@uzforge/shared";

export const createDepositRequest = async (userId: number, baseAmount: number) => {
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 daqiqa

  let uniqueAmount = 0;
  let success = false;
  let attempts = 0;

  while (!success && attempts < 20) {
    const randomAdd = Math.floor(Math.random() * 999) + 1; // 1-999
    uniqueAmount = baseAmount + randomAdd;

    try {
      const deposit = new PendingDeposit({
        userId,
        baseAmount,
        uniqueAmount,
        status: "reserved",
        expiresAt
      });
      await deposit.save();
      success = true;
    } catch (err: any) {
      if (err.code === 11000) { // Unique index xatosi
        attempts++;
      } else {
        throw err;
      }
    }
  }

  if (!success) {
    throw new Error("Tizim band, birozdan keyin urinib ko'ring.");
  }

  // BullMQ delay job bu yerda qo'shilishi kerak (5 daqiqadan keyin expired qilish uchun)
  // Hozirgi MVP da cron orqali yoki shunchaki mongoDB TTL orqali qilsa ham bo'ladi.

  return { baseAmount, uniqueAmount, expiresAt };
};
