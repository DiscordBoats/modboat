import { Interaction, Message } from "discord.js";
import { Command } from "../../Command";


export default class variable extends Command {
    constructor(client) {
        super(client, {
            name: "variables",
            description: "The available variables for the text",
            slash: {
                name: "variables",
                description: "The available variables for the text"
            }
        });
    };

    async run(message: Message) {

        try {

            return message.channel.send({
                embeds: [
                    {
                        title: "Variables",
                        url: "https://docs.antibot.xyz/text/_variables",
                        description: "These variables will be replaced in autors & tags.",
                        thumbnail: {
                            url: this.client.user.displayAvatarURL()
                        },
                        //@ts-ignore
                        color: this.client.color.red,
                        fields: [
                            {
                                "name": "User",
                                "value": "- `{user}` **-----** The user mention\n- `{user.name}` **-----** The name of the user\n- `{user.id}` **-----** The id of the user"
                            },
                            {
                                "name": "Server",
                                "value": "- `{server.name}` **-----** The name of the current server\n- `{server.id}` **-----** The id of the current server"
                            }
                        ]
                    }
                ]
            });

        } catch (err) {
            return;
        };
    };
};