import { Bot } from "grammy";

class BotRegistry {
  private bots = new Map<string, Bot>();

  public addBot(botId: string, bot: Bot) {
    this.bots.set(botId, bot);
  }

  public getBot(botId: string): Bot | undefined {
    return this.bots.get(botId);
  }

  public removeBot(botId: string) {
    this.bots.delete(botId);
  }

  public hasBot(botId: string): boolean {
    return this.bots.has(botId);
  }
}

export const botRegistry = new BotRegistry();
