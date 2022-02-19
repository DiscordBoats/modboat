import { Schema, model, Document } from "mongoose";

interface WarnDocument extends Document {
    User: String;
    Guild: String;
    Reason: String;
    WarnNum: Number
}

const WarnSchema = new Schema({
    Guild: String,
    User: String,
    Reason: { type: String, default: 'No reason provided'},
    WarnNum: { type: Number, default: 0 }
})

export = model<WarnDocument>("warnings", WarnSchema);