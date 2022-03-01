import { Client, Collection } from "discord.js";
import { API } from "./API";
import { Command } from "../core/Command";
import { Database } from "./database/Database";
import { Service } from "../services/Service";
import settings from "../settings/settings.json";
import fetch from "cross-fetch";


export class Discord extends Client {
    public commands: Collection<string, Command>;
    public slashes: Collection<string, any>;
    public database: Database;
    public request: API;
    public readonly color: colors;  
    public service: Service;
    public settings: any;
    public fetch: typeof fetch;
    constructor () {
        super({
            intents: [
                "GUILDS",
                "GUILD_MESSAGES",
                "GUILD_MEMBERS",
            ],
            partials: [
                "CHANNEL",
                "GUILD_MEMBER",
                "MESSAGE",
                "USER"
            ],
            allowedMentions: {
                parse: [
                    "everyone"
                ]
            }
        });

        this.setMaxListeners(30);

        this.commands = new Collection();
        this.slashes = new Collection();
        this.database = new Database(this);
        this.request = new API(this);
        this.service = new Service(this);
        this.color = colors as any;
        this.settings = settings;
        this.fetch = fetch;
    };
};

export enum colors {
    regular = '@3553599',
    blue = '#7FB3D5',
    pink = '#FADBD8',
    red = '#EC7063',
    green = '#ABEBC6',
    yellow = '#F9E79F',
}