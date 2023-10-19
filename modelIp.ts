import mongoose, { Schema, Document } from "mongoose";

export interface IPInfoType extends Document {
  ip: string;
  info: object;
  createdAt: Date;
}

const IPInfoSchema: Schema = new Schema({
  ip: String,
  info: Object,
  createdAt: { type: Date, default: Date.now, expires: 60 },
});

export default mongoose.model<IPInfoType>("IPInfoObject", IPInfoSchema);
