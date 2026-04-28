import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export interface IDocumentVersion {
  url: string;
  public_id: string;
  version: number;
  uploadedBy: mongoose.Types.ObjectId;
  uploadedAt: Date;
  remarks?: string;
}

export interface IDocument extends MongooseDocument {
  clientId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  subcategory?: string;
  month: string; // YYYY-MM
  status: 'pending' | 'reviewed' | 'approved';
  file: {
    url: string;
    public_id: string;
  };
  version: number;
  uploadedBy: mongoose.Types.ObjectId;
  history: IDocumentVersion[];
  createdAt: Date;
  updatedAt: Date;
}

const DocumentVersionSchema = new Schema({
  url: { type: String, required: true },
  public_id: { type: String, required: true },
  version: { type: Number, required: true },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  uploadedAt: { type: Date, default: Date.now },
  remarks: { type: String },
}, { _id: false });

const DocumentSchema: Schema = new Schema({
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategory: { type: String },
  month: { type: String, required: true },
  status: { type: String, enum: ['pending', 'reviewed', 'approved'], default: 'pending' },
  file: {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  version: { type: Number, default: 1 },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  history: [DocumentVersionSchema],
}, { 
  timestamps: true,
  strictPopulate: false,
  strict: false 
});

// Performance indexes only — uniqueness is enforced at the application level
// (upload route: findOne({ clientId, categoryId, subcategory, month }) → upsert)
DocumentSchema.index({ clientId: 1, month: -1 });
DocumentSchema.index({ categoryId: 1 });
DocumentSchema.index({ clientId: 1, month: 1, categoryId: 1, subcategory: 1 });

const DocModel = mongoose.models.Document || mongoose.model<IDocument>('Document', DocumentSchema);

// One-time cleanup: drop the stale unique index that blocks multiple uploads per month.
// The old schema had a unique index on { clientId, month, type } which no longer exists
// in the schema but is still in MongoDB — it blocks any second document per client/month.
DocModel.collection.dropIndex('clientId_1_month_1_type_1').catch(() => {
  // Index doesn't exist (already dropped or was never created) — safe to ignore
});

export default DocModel;

