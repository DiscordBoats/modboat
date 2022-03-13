import {Command} from "../../Command";
import {Message, MessageEmbed} from "discord.js";
import {Discord} from "../../../structures/Client";

export default class Snipe extends Command {
    constructor (client) {
        super (client, {
            name: "snipe",
            description: "Snipe messages",
        });
    };

    async run (message: Message, args: string[]) {
        // message.mentions.channels.first().id || message.guild.channels.cache.find((c) => c.name.toLowerCase() === args.join(" ").toLocaleLowerCase()).id
        switch(args[0]) {
            case "channel":
                const channel = message.channel.id

                let snip = this.client.snipe.get(channel)
                if(!snip) return message.channel.send("No deleted messages have been found.")

                let unix = Math.floor(snip.date / 1000)
                if(snip.image) {
                    setTimeout(() => {
                        message.channel.send({files: [snip.image]})
                    }, 1000)
                }

                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor("#eaecf3")
                            .setThumbnail(snip.avatar)
                            .setDescription(`<@${snip.user.id}> | ${snip.user.tag} (${snip.user.id})\ndeleted the message <t:${unix}:R> (<t:${unix}:F>)\n\n\`\`\`${snip.msg ? snip.msg : 'No message found maybe a file was attached.'}\`\`\``)
                    ]
                })
                break

            default:
        }

    }
    }