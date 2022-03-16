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
                const channel = message.mentions.channels.first().id || message.guild.channels.cache.find((c) => c.name.toLowerCase() === args.join(" ").toLocaleLowerCase()).id
                if(!channel) return message.channel.send({
                    embeds: [
                        new MessageEmbed().setDescription("Please mention a channel or provide a channel name").setColor("RED")
                    ]
                });
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
                const channe = message.mentions.channels.first().id || message.guild.channels.cache.find((c) => c.name.toLowerCase() === args.join(" ").toLocaleLowerCase()).id

                let snipa = this.client.snipe.get(channe)
                if(!snipa) return message.channel.send("No deleted messages have been found.")

                let unixx = Math.floor(snipa.date / 1000)
                if(snipa.image) {
                    setTimeout(() => {
                        message.channel.send({files: [snipa.image]})
                    }, 1000)
                }

                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor("#eaecf3")
                            .setThumbnail(snipa.avatar)
                            .setDescription(`<@${snipa.user.id}> | ${snipa.user.tag} (${snipa.user.id})\ndeleted the message <t:${unixx}:R> (<t:${unixx}:F>)\n\n\`\`\`${snipa.msg ? snipa.msg : 'No message found maybe a file was attached.'}\`\`\``)
                    ]
                })
        }

    }
    }