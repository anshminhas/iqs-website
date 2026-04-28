import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLog extends Document {
  adminId: mongoose.Types.ObjectId;
  targetId?: mongoose.Types.ObjectId; // Client or Document
  action: string;
  description: string;
  createdAt: Date;
}

const ActivityLogSchema: Schema = new Schema({
  adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  targetId: { type: Schema.Types.ObjectId, required: false },
  action: { type: String, required: true },
  description: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
