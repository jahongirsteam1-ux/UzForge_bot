import mongoose, { Schema, Document } from 'mongoose';

export interface IPendingDeposit extends Document {
  userId: number;
  baseAmount: number;
  uniqueAmount: number;
  status: "reserved" | "success" | "expired";
  matchedRawMessage?: string;
  createdAt: Date;
  expiresAt: Date;
}

const PendingDepositSchema: Schema = new Schema({
  userId: { type: Number, required: true },
  baseAmount: { type: Number, required: true },
  uniqueAmount: { type: Number, required: true },
  status: { type: String, enum: ["reserved", "success", "expired"], default: "reserved" },
  matchedRawMessage: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
});

// Index: { uniqueAmount: 1, status: 1 } — faqat "reserved" holatidagilar orasida unique bo'lishi shart
// We simulate partial unique index using a unique index on uniqueAmount when status is reserved.
PendingDepositSchema.index(
  { uniqueAmount: 1 }, 
  { unique: true, partialFilterExpression: { status: "reserved" } }
);

export const PendingDeposit = mongoose.model<IPendingDeposit>('PendingDeposit', PendingDepositSchema);
