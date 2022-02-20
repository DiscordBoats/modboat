import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import { Command } from "../../Command";

export default class Auto extends Command {
    constructor (client) {
        super(client, {
            name: "automod",
            description: "Automod command to enable and disable automod actions.",
            slash: {
                name: "automod",
                description: "Automod command to enable and disable automod actions.",
                options: [
                    {
                        type: "STRING",
                        name: "automod",
                        description: "The type of the automod",
                        required: true,
                        choices: [
                            {
                                name: "Ads",
                                value: "ads"
                            },
                            {
                                name: "Credit Cards",
                                value: "cc"
                            },
                            {
                                name: "IP Logger",
                                value: "iploggers"
                            },
                            {
                                name: "Ipv4",
                                value: "ipv4"
                            },
                            {
                                name: "Ipv6",
                                value: "ipv6"
                            },
                            {
                                name: "Mass Caps",
                                value: "masscaps"
                            },
                            {
                                name: "Mass Mentions",
                                value: "massmention"
                            },
                            {
                                name: "N Word",
                                value: "nword"
                            },
                            {
                                name: "Phone Numbers",
                                value: "phonenumbers"
                            },
                            {
                                name: "Social Security Number",
                                value: "ssn"
                            }
                        ]
                    },
                    {
                        type: "STRING",
                        name: "toggle",
                        description: "Enable | Disable",
                        required: true,
                        choices: [
                            {
                                name: "Enable",
                                value: "enable"
                            },
                            {
                                name: "Disable",
                                value: "disable"
                            }
                        ]
                    }
                ]
            }
        });
    };

    async run (message: Message, args: string[]) {

        if (!this.service.permission.checkMember(message, "MANAGE_GUILD", true)) {
            return;
        };

        const input = (args[0]) ? args[0].toLowerCase() : args[0];

        switch (input) {
            case "ads": {
                 work({
                         client: this.client,
                         struct: message,
                         args: args,
                         type: "Automodads",
                         onMessageType: "ads"
                     });
            };

            break;

            case "iploggers": {
                work({
                    client: this.client,
                    struct: message,
                    args: args,
                    type: "Automodiploggers",
                    onMessageType: "iploggers"
                });
            };

            break;

            case "ipv4": {
                work({
                    client: this.client,
                    struct: message,
                    args: args,
                    type: "Automodipv4",
                    onMessageType: "ipv4"
                });
            };

            break;

            case "ipv6": {
                work({
                    client: this.client,
                    struct: message,
                    args: args,
                    type: "Automodipv6",
                    onMessageType: "ipv6"
                });
            };

            break;

            case "links": {
                work({
                    client: this.client,
                    struct: message,
                    args: args,
                    type: "Automodlinks",
                    onMessageType: "links"
                });
            };

            break;

            case "masscaps": {
                work({
                    client: this.client,
                    struct: message,
                    args: args,
                    type: "Automodmasscaps",
                    onMessageType: "masscaps"
                });
            };

            break;

            case "massmention": {
                work({
                    client: this.client,
                    struct: message,
                    args: args,
                    type: "Automodmassmention",
                    onMessageType: "massmention"
                });
            };

            break;

            case "nword": {
                work({
                    client: this.client,
                    struct: message,
                    args: args,
                    type: "Automodnword",
                    onMessageType: "nword"
                });
            };

            break;

            case "alts": {
                work({
                    client: this.client,
                    struct: message,
                    args: args,
                    type: "Automodalts",
                    onMessageType: "alts"
                });
            };
            break;
            default: {
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                        .setURL('https://docs.antibot.xyz/anti-bot/automod')
                        .setTitle("Automod")
                        .setThumbnail(message.guild.iconURL({ dynamic: true }))
                        //@ts-ignore
                        .setColor(this.client.color.red)
                        .setDescription('Arguments: `ads` | `iploggers` | `ipv4` | `ipv6` | `links` | `masscaps` | `massmention` | `nword` | `alts`')
                        .addFields({
                            name: "Automod Subs",
                            value: "[`✅ enable`](https://docs.antibot.xyz/anti-bot/autmod)\n[`⛔ disable`](https://docs.antibot.xyz/anti-bot/automod)"
                        })
                    ]
                })
            } 
        };
    };
};

async function work (opt: WorkOption) {
    //const toggle = (opt.args[1]) ? opt.args[1].toLowerCase() : opt.args[1];
    let toggle = null;

    if (opt.args && typeof opt.args === "object") {
        
        if (opt.args[1]) {
            toggle = opt.args[1].toLowerCase();
        };
    };

    if (opt.args && typeof opt.args === "string") {
        toggle = opt.args;
    };

    const types = ["enable", "disable"]

    if (!toggle || !types.find((x) => x === toggle)) {
        return;
    };

    let toBoolean = false;

    if (toggle === "enable") {
        toBoolean = true;
    };

    if (toggle === "disable") {
        toBoolean = false;
    };

    await opt.client.database.update.automod(opt.struct.guild.id, opt.type, toBoolean);
    await sendMessage(opt.client, opt.struct, opt.onMessageType, toBoolean);
};

function sendMessage (client, message, type: string, enabled: boolean) {

    message.reply({
        embeds: [
            {
                color: client.color.red,
                description: `> Successfully ${(enabled === true) ? "enabled" : "disabled"} ${type}`
            }
        ]
    }).catch(() => {
        return;
    });
};

export type Automod = "Automodnword" 
| "Automodlinks" 
| "Automodads" 
| "Automodiploggers" 
| "Automodmassmention" 
| "Automodmasscaps" 
| "Automodipv4" 
| "Automodipv6" 
| "Automodcc" 
| "Automodphonenumbers" 
| "Automodssn" 
| "Automoddehoist"
| "Automodalts";

interface WorkOption {
    client: any;
    struct: any;
    type: Automod;
    args: string[] | any;
    onMessageType: string;
};