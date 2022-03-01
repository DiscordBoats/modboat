import { ButtonInteraction, GuildChannel, Interaction, Message, MessageActionRow, MessageButton, User } from "discord.js";
import { Event } from "../../Event";
import fetch from "cross-fetch";
import sourcebin from "sourcebin_js";

export default class Button extends Event {
    constructor(client) {
        super(client, {
            name: "interactionCreate",
            once: false,
        });
    };
    async run(b: ButtonInteraction): Promise<void> {
        
    }

    private async deleteInteraction (b: ButtonInteraction): Promise<void> {
        await fetch(`https://discord.com/api/v9/webhooks/${b.applicationId}/${b.token}/messages/@original`, {
            method: "DELETE",
        }).catch((e) => {return;})
    }
}



