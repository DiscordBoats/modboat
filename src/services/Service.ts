import { Discord } from "../structures/Client";
import { Permission } from "./Permission";
import { Logger } from "./Logger";
import fetch from "cross-fetch";

export class Service {
    public permission: Permission;
    public logger: Logger;


    constructor (client: Discord) {
        this.permission = new Permission();
        this.logger = new Logger(client);
    };

    public async timeout(guildid?: string, userid?: string): Promise<any> {
        const x = new Date(Date.now() + 828000000).toISOString();
        await fetch(`https://discord.com/api/guilds/${guildid}/members/${userid}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bot ${process.env.Token}`
            },
            body: JSON.stringify({
                communication_disabled_until: x
            })
        })
    }

    public async timein(guildid?: string, userid?: string): Promise<any> {
       // const x = new Date(Date.now() + 1000).toISOString();
        await fetch(`https://discord.com/api/guilds/${guildid}/members/${userid}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bot ${process.env.Token}`
            },
            body: JSON.stringify({
                communication_disabled_until: null
            })
        })
    }
};