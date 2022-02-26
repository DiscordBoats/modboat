import { ApplicationCommandData } from "discord.js";
import { Service } from "../services/Service";
import { Discord } from "../structures/Client";

export class Command {
    public client: Discord;
    public name: string;
    public description?: string;
    public service: Service;
    public slash?: ApplicationCommandData;

    constructor (client: Discord, opt: CommandOpt) {    
        this.client = client;
        this.name = opt.name;
        this.description = opt.description;
        this.slash = opt.slash;
        this.service = new Service(client);
    };

    run (message, args) {
        return;
    };

    interact (interaction) {
        return;
    };

    respondPerm (member, perm) {
        return {
            content: `> Missing Permission \`${perm}\`. :x:`
        };
    };
};

interface CommandOpt {
    name: string;
    description?: string;
    slash?: ApplicationCommandData;
    userPermission?: string[];
    botPermission?: string[];
};