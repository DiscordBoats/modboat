import { Schema, Document, model } from "mongoose";

interface TagDocument extends Document {
    Guild: string;
    Command: string;
    Response: string;
};

const TagSchema = new Schema({
    Guild: String,
    Command: String,
    Response: String
}, { versionKey: false });

export = model<TagDocument>("tags", TagSchema);