import { Schema, model, Document } from "mongoose";


interface CasesDocument extends Document {
    Guild: String;
    User: String;
    Reason: String;
    Case: Number;
    MessageId: String;
}

const CasesSchema = new Schema({
    Guild: String,
    User: String,
    Reason: { type: String, default: 'No reason provided'},
    Case: Number,
    MessageId: String
}, { versionKey: false })

export = model<CasesDocument>("cases", CasesSchema);