import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  telegramId: number;
  username?: string;
  firstName: string;
  balance: number;
  totalDeposited: number;
  referralCode: string;
  referredBy?: number;
  referralEarnings: number;
  referralCount: number;
  tier: "free" | "pro" | "business";
  language: "uz" | "ru" | "en";
  createdAt: Date;
  lastActiveAt: Date;
  isBlocked: boolean;
}

const UserSchema: Schema = new Schema({
  telegramId: { type: Number, required: true, unique: true },
  username: { type: String, required: false },
  firstName: { type: String, required: true },
  balance: { type: Number, default: 0 },
  totalDeposited: { type: Number, default: 0 },
  referralCode: { type: String, required: true, unique: true },
  referredBy: { type: Number, required: false },
  referralEarnings: { type: Number, default: 0 },
  referralCount: { type: Number, default: 0 },
  tier: { type: String, enum: ["free", "pro", "business"], default: "free" },
  language: { type: String, enum: ["uz", "ru", "en"], default: "uz" },
  createdAt: { type: Date, default: Date.now },
  lastActiveAt: { type: Date, default: Date.now },
  isBlocked: { type: Boolean, default: false }
});

export const User = mongoose.model<IUser>('User', UserSchema);
