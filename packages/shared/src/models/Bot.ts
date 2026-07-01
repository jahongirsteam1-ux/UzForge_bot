import mongoose, { Schema, Document } from 'mongoose';

export interface IBot extends Document {
  ownerId: number;
  templateKey: string;
  botToken: string;
  botUsername: string;
  status: "pending" | "deploying" | "running" | "stopped" | "error" | "expired";
  config: any;
  flow: any;
  stats: {
    totalUsers: number;
    messagesProcessedToday: number;
    lastPing: Date;
    uptime: number;
  };
  subscriptionExpiresAt?: Date;
  webhookUrl: string;
  createdAt: Date;
}

const BotSchema: Schema = new Schema({
  ownerId: { type: Number, required: true }, // refers to users.telegramId
  templateKey: { type: String, required: true },
  botToken: { type: String, required: true },
  botUsername: { type: String, required: true },
  status: { type: String, enum: ["pending", "deploying", "running", "stopped", "error", "expired"], default: "pending" },
  config: { type: Schema.Types.Mixed, default: {} },
  flow: { type: Schema.Types.Mixed, default: {} },
  stats: {
    totalUsers: { type: Number, default: 0 },
    messagesProcessedToday: { type: Number, default: 0 },
    lastPing: { type: Date, default: Date.now },
    uptime: { type: Number, default: 0 }
  },
  subscriptionExpiresAt: { type: Date, required: false },
  webhookUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Bot = mongoose.model<IBot>('Bot', BotSchema);
