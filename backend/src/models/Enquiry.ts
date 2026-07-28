import mongoose, { Schema, Document } from "mongoose";

export interface IEnquiry extends Document {
  name: string;
  email: string;
  phone: string;
  message: string;
  whatsappNumber?: string;
  country?: string;
  planningDate?: string;
  flexibleDates?: boolean;
  adults?: number;
  children?: number;
  duration?: string;
  preferredContact?: string;
  interestedIn?: string[];
  preferredAccommodation?: string;
  howFound?: string;
  createdAt: Date;
}

const EnquirySchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  whatsappNumber: { type: String },
  country: { type: String },
  planningDate: { type: String },
  flexibleDates: { type: Boolean },
  adults: { type: Number },
  children: { type: Number },
  duration: { type: String },
  preferredContact: { type: String },
  interestedIn: { type: [String] },
  preferredAccommodation: { type: String },
  howFound: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IEnquiry>("Enquiry", EnquirySchema);
