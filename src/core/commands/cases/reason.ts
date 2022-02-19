import { Message, MessageEmbed, MessageEmbedOptions, TextChannel } from "discord.js";
import { Command } from "../../Command";
import Schema from "../../../models/cases";
import GuildSchema from "../../../models/guild";
import { APIEmbed } from "discord-api-types";


export default class Reason extends Command {
    constructor(client) {
        super(client, {
            name: "reason",
            description: "Gives action log a reason"
        });
    };

    async run (message: Message, args: string[]) {
        return message.reply('In the works')
        if (!this.service.permission.checkMember(message, "MANAGE_MESSAGES", true)) {
            return;
        };

        if (!this.service.permission.checkBot(message, "MANAGE_MESSAGES", true)) {
            return;
        };
        const caseNum = args[0];
        const reason = args.slice(1).join(" ");
        if (!caseNum) {
            return message.reply({
                content: 'You need to provide the case number that exists'
            });
        };

        if (!reason) {
            return message.reply({
                content: 'You need to provide the new reason'
            })
        }
        const GuildData = await GuildSchema.findOne({ Guild: message.guild.id });
        const data = await Schema.findOne({ Guild: message.guild.id, Case: caseNum });

        if (!GuildData) {
            return message.reply({
                content: 'The modlog doesn\'t seem to be set'
            })
        }

        if (!data) {
            return message.reply({
                content: 'This case number doesn\'t exist'
            })
        }
        this.client.channels.fetch(GuildData.ModChannel).then(channel => {
            //@ts-ignore
            channel.messages.fetch(data.MessageId as TextChannel).then((message: { embeds: (MessageEmbed | MessageEmbedOptions | APIEmbed)[]; edit: (arg0: { embeds: MessageEmbed[]; }) => void; channel: { send: (arg0: string) => void; }; }) => {
                message.embeds[0].description = message.embeds[0].description.split('**Reason:**')[0] + '**Reason:** ' + reason;
                message.edit({embeds: [new MessageEmbed(message.embeds[0])]});
                message.channel.send(`Reason for case ${args[0]} has been updated`);
            });
        });
    }
}