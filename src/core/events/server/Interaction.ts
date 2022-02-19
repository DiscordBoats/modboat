import { Interaction } from "discord.js";
import { Event } from "../../Event";

export default class Slash extends Event {
    constructor (client) {
        super(client, {
            name: "interactionCreate",
            once: false
        });
    };

    run (i: Interaction) {

        if (!i.isCommand()) {
            return;
        };

        if (i.channel?.type === "DM") {
            return;
        };

        const command = this.client.slashes.get(i.commandName);

        if (command) {
            command.interact(i);  
        };
    };
};