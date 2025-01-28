import { Schema , model } from "mongoose";

const prescriptionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    prescriptionUrl: { type: String, required: true }
}, { timestamps: true });

export default model("Prescription", prescriptionSchema);