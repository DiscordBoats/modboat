import { Guild, GuildMember, Message, MessageEmbed, TextChannel, User } from "discord.js";
import { Discord } from "../structures/Client";
import GuildSchema from "../models/guild";
import CasesSchema from "../models/cases";

export class Logger {
    public client: Discord;
    //colors
    public timeoutColor: string;
    public kickColor: string;
    public banColor: string;
    public warnColor: string;
    public undo: string;
    //titles
    public timeoutTitle: string;
    public kickTitle: string;
    public banTitle: string;
    public warnTitle: string;
    public undoTimeoutTitle: string;
    public undoBanTitle: string;
    public undotimeout: string;

    constructor (client: Discord) {
        //colors
        this.timeoutColor = '#fcffa4';
        this.kickColor = '#ff7f50';
        this.banColor = '#ff0000';
        this.warnColor = '#E59866';
        this.undo = '#70bd92';
        this.undotimeout = '#70bd92';
        //titles
        this.timeoutTitle = 'Timed Out';
        this.kickTitle = 'Kick';
        this.banTitle = 'Ban';
        this.warnTitle = 'Warn'
        this.undoTimeoutTitle = 'Timed In';
        this.undoBanTitle = 'Unban'
    };

    async modlogs(options: modopts) {
        if (!options.message) throw new ReferenceError('shrug');

        const data = await GuildSchema.findOne({ Guild: options.message.guild.id });

        if (!data || !data.ModChannel) {
            return;
        };
        
        if (!options.message.guild.me.permissions.has("SEND_MESSAGES")) {
            return;
        };

        if (!options.message.guild.me.permissions.has("EMBED_LINKS")) {
            return;
        };

        const channel = options.message.guild.channels.cache.get(data.ModChannel) as TextChannel;
        if (!channel) {
            return;
        };
        if (channel) {
           options.client.service.timeout(options.message.guildId, options.message.author.id)
            CasesSchema.find({ Guild: options.message.guild.id }).sort([['descending']]).exec(async (err, data) => {
                const cases = new CasesSchema({
                    Guild: options.message.guild.id,
                    User: options.user.id || options.message.author.id,
                    Reason: options.reason,
                    Case: data.length + 1
                })
                cases.save()
                if (!options.reason) {
                    options.reason = `No reason provided. To provide a reason run \`+reason ${cases.Case}\``
                };
                
                if (!options.user) {
                    options.user == options.message.author.tag as unknown as GuildMember
                };
                if (options.warn === false) {};

                if (options.warn === true) {
                   options.client.database.update.addWarning({
                        UserId: options.user.id || options.message.author.id,
                        GuildId: options.message.guild.id,
                        Reason: options.reason,
                        MessageId: options.message.id,
                        ChannelId: options.message.channel.id
                    });
                };

            const embed = new MessageEmbed()
                .setAuthor({
                    name: `${options.title} | Case #${cases.Case}`,
                    iconURL: options.message.member.displayAvatarURL({ dynamic: true}) || options.message.author.displayAvatarURL({ dynamic: true }) 
                }) 
                .setColor(options.color)
                .setDescription(`**User:** ${options.user || options.message.author.tag} (${options.userid || options.message.author.id})\n**Moderator:** ${options.moderator.user.tag} (${options.moderator.id})\n**Reason:** ${options.reason}`)
                .setFooter({
                    text: options.message.guild.name,
                    iconURL: options.message.guild.iconURL({ dynamic: true})
                })

            return channel.send({
                embeds: [embed]
            })
        })
        };
    };

    restag(message: Message, response) {

        if (!message) {
            return console.log(`Shrug - restag`);
        };

        if (!response) {
            return console.log("You need to provide a response - restag");
        };

        if (!message.guild.me.permissions.has("SEND_MESSAGES")) {
            return;
        };

        if (!message.guild.me.permissions.has("EMBED_LINKS")) {
            return;
        };

        const embed = new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            //@ts-ignore
            .setColor(this.client.color.red)
            .setDescription(response)

        message.channel.send({
            embeds: [embed]
        }).catch(error => {
            return;
        });
    };
};

interface modopts {
    client: Discord;
    message: Message;
    moderator: GuildMember;
    reason?: string;
    user?: GuildMember;
    userid?: string;
    title: 'Time Out' | 'Kick' | 'Ban' | 'Timed In' | 'Unban' | 'Warn';
    color: '#fcffa4' | '#ff7f50' | '#dc3b3b' | '#70bd92' | '#E59866';
    warn?: Boolean | true,
}

