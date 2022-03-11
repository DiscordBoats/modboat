import { Schema, model, Document } from "mongoose";

interface GuildDocument extends Document {
    Guild: string;
    ModChannel: string;
    LogChannel: string;
    AltsChannel: string;
    Automodnword: boolean;
    Automodlinks: boolean;
    Automodads: boolean;
    Automodiploggers: boolean;
    Automodmassmention: boolean;
    Massmentionrate: number;
    Masscapsrate: number;
    Altaccountdays: number;
    Alttype: string;
    Automodmasscaps: boolean;
    Automodipv4: boolean;
    Automodipv6: boolean;
    Automodalts: boolean;
    Automodscams: boolean;
    Prefix: string;
    MuteRole: string;
    Autorole: boolean;
    Autoroles: string[];
    Moderatorrole: boolean;
    Moderatorroles: string[];
    Managerrole: boolean;
    Managerroles: string[];
};



const GuildSchema = new Schema({
    Guild: { type: String },
    ModChannel: { type: String, default: null },
    LogChannel: { type: String, default: null },
    AltsChannel: { type: String, default: null },
    UnverifiedRole: { type: String, default: null },
    Automodnword: { type: Boolean, default: false },
    Automodlinks: { type: Boolean, default: false },
    Automodads: { type: Boolean, default: false },
    Automodiploggers: { type: Boolean, default: false },
    Automodmassmention: { type: Boolean, default: false },
    Massmentionrate: { type: Number, default: 10 },
    Masscapsrate: { type: Number, default: 10 },
    Altaccountdays: { type: Number, default: 10 },
    Alttype: { type: String, default: 'kick' },
    Automodmasscaps: { type: Boolean, default: false },
    Automodipv4: { type: Boolean, default: false },
    Automodipv6: { type: Boolean, default: false },
    Automodalts: { type: Boolean, default: false },
    Automodscams: { type: Boolean, default: false },
    Prefix: { type: String, default: process.env.Prefix },
    MuteRole: { type: String, default: null },
    Autorole: { type: Boolean, default: false },
    Autoroles: { type: Array, default: [] },
    Moderatorrole: { type: Boolean, default: false },
    Moderatorroles: { type: Array, default: [] },
    Managerrole: { type: Boolean, default: false },
    Managerroles: { type: Array, default: [] }
}, { versionKey: false });

export = model<GuildDocument>("settings", GuildSchema);