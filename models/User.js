import { Schema , model } from "mongoose";

const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String },
    phoneNumber: { type: String },
    // referenceId: { type: String, required: true },
    // storePartnerReferenceId: { type: String, ref: "StorePartner" },
    // earnings: { type: Number, default: 0 },
    role: { type: String, enum: ["user", "admin"],  required: true },
    address: { type: String },
    // bdeId: { type: Schema.Types.ObjectId, required: true }
}, { timestamps: true });

export default model("User", userSchema);

