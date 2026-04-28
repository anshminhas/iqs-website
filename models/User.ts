import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'super_admin' | 'admin' | 'client';
  clientId?: mongoose.Types.ObjectId;
  assignedClients?: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['super_admin', 'admin', 'client'], required: true },
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: false },
  assignedClients: [{ type: Schema.Types.ObjectId, ref: 'Client' }],
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
