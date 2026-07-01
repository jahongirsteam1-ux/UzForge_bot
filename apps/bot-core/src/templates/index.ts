import { Bot } from "grammy";
import { IBot } from "@uzforge/shared";
import { createKinoBot } from "./kino";
import { createMahsulotBot } from "./mahsulot";
import { createAnketaBot } from "./anketa";

export const initializeBotFromTemplate = (botData: IBot): Bot => {
  switch (botData.templateKey) {
    case "kino_bot":
      return createKinoBot(botData);
    case "mahsulot_bot":
      return createMahsulotBot(botData);
    case "anketa_bot":
      return createAnketaBot(botData);
    default:
      throw new Error(`Template topilmadi: ${botData.templateKey}`);
  }
};
