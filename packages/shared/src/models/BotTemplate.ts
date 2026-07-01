import mongoose, { Schema, Document } from 'mongoose';

export interface IBotTemplate extends Document {
  key: string;
  name: string;
  emoji: string;
  description: string;
  category: "media" | "ecommerce" | "finance" | "marketing" | "utility";
  price: number;
  isPremium: boolean;
  configSchema: any;
  defaultFlow: any;
  codeTemplatePath: string;
  isActive: boolean;
}

const BotTemplateSchema: Schema = new Schema({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  emoji: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ["media", "ecommerce", "finance", "marketing", "utility"], required: true },
  price: { type: Number, default: 0 },
  isPremium: { type: Boolean, default: false },
  configSchema: { type: Schema.Types.Mixed, default: {} },
  defaultFlow: { type: Schema.Types.Mixed, default: {} },
  codeTemplatePath: { type: String, required: true },
  isActive: { type: Boolean, default: true }
});

export const BotTemplate = mongoose.model<IBotTemplate>('BotTemplate', BotTemplateSchema);
