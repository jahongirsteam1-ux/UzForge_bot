import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  userId: number;
  type: "deposit" | "bot_purchase" | "referral_bonus" | "subscription" | "withdrawal";
  amount: number;
  provider: "payme" | "click" | "humo" | "stars" | "internal";
  status: "pending" | "success" | "failed" | "cancelled";
  externalId?: string;
  receiptImage?: string;
  relatedBotId?: string;
  createdAt: Date;
}

const TransactionSchema: Schema = new Schema({
  userId: { type: Number, required: true },
  type: { type: String, enum: ["deposit", "bot_purchase", "referral_bonus", "subscription", "withdrawal"], required: true },
  amount: { type: Number, required: true },
  provider: { type: String, enum: ["payme", "click", "humo", "stars", "internal"], required: true },
  status: { type: String, enum: ["pending", "success", "failed", "cancelled"], default: "pending" },
  externalId: { type: String, required: false },
  receiptImage: { type: String, required: false },
  relatedBotId: { type: String, required: false },
  createdAt: { type: Date, default: Date.now }
});

export const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);
