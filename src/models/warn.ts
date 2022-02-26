import { Schema, model, Document } from "mongoose";

interface WarnDocument extends Document {
    User: String;
    Guild: String;
    Reason: String;
    WarnNum: String;
    MessageId: String;
    ChannelId: String;
}

const WarnSchema = new Schema({
    Guild: String,
    User: String,
    Reason: { type: String, default: 'No reason provided'},
    WarnNum: { type: String },
    MessageId: { type: String },
    ChannelId: { type: String }
})

export = model<WarnDocument>("warnings", WarnSchema);