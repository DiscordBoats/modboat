import { Schema, model, Document } from "mongoose";

interface GuildDocument extends Document {
    Guild: string;
    ModChannel: string;
    LogChannel: string;
    Automodnword: boolean;
    Automodlinks: boolean;
    Automodads: boolean;
    Automodiploggers: boolean;
    Automodmassmention: boolean;
    Massmentionrate: number;
    Masscapsrate: number;
    Automodmasscaps: boolean;
    Automodipv4: boolean;
    Automodipv6: boolean;
    Prefix: string;
    MuteRole: string;
    Autorole: boolean;
    Autoroles: string[];
};



const GuildSchema = new Schema({
    Guild: { type: String },
    ModChannel: { type: String, default: null },
    LogChannel: { type: String, default: null },
    UnverifiedRole: { type: String, default: null },
    Automodnword: { type: Boolean, default: false },
    Automodlinks: { type: Boolean, default: false },
    Automodads: { type: Boolean, default: false },
    Automodiploggers: { type: Boolean, default: false },
    Automodmassmention: { type: Boolean, default: false },
    Massmentionrate: { type: Number, default: 10 },
    Masscapsrate: { type: Number, default: 10 },
    Automodmasscaps: { type: Boolean, default: false },
    Automodipv4: { type: Boolean, default: false },
    Automodipv6: { type: Boolean, default: false },
    Prefix: { type: String, default: process.env.Prefix },
    MuteRole: { type: String, default: null },
    Autorole: { type: Boolean, default: false },
    Autoroles: { type: Array, default: [] }
});

export = model<GuildDocument>("settings", GuildSchema);