const moment = require('moment');
const discord = require("discord.js");
module.exports = {
    name: 'find',
    description: 'Finds potential alt accounts based on their account creation.',
    usage: '[amount of days]',
    category: 'Moderation',
    permissions: ['BAN_MEMBERS'],
    async execute(client, msg, args) {


        const Discord = require('discord.js');

        let days = args[0];
        if (!days) return msg.channel.send("Please provide a valid days duration");

        if (isNaN(days)) return msg.channel.send("Please provide a valid Days Duration");

        let day = Number(days);

        if (day > 5000) return msg.channel.send("You may only find accounts up to 5000 days.");

        let array = []

        msg.guild.members.cache.forEach(async (user) => {

            let math = day * 86400000

            let x = Date.now() - user.user.createdAt;
            let created = Math.floor(x / 86400000);

            if (day >= created) {

                array.push(`${user} (${user.user.tag} | ${user.id})\n__Created At__: <t:${moment(user.user.createdAt).format('X')}:F> (<t:${moment(user.user.createdAt).format('X')}:R>)`)
            }

        })

        const interval = 10;

        const embed = new discord.MessageEmbed()
            .setTitle(`Found ${array.length} account${array.length === 1 ? '' : 's'}`)
            .setDescription(array.join("\n\n") || "No alts found")
            .setThumbnail(msg.guild.iconURL({dynamic: true}))
            .setColor("RANDOM")

        if (array.length <= interval) {

            const range = (array.length === 1) ? '[1]' : `[1 - ${array.length}]`;
            await msg.channel.send(embed
                .setTitle(`Found ${array.length} account${array.length === 1 ? '' : 's'}`)
                .setDescription(array.join("\n\n") || "No alts found")
                .setThumbnail(msg.guild.iconURL({dynamic: true}))
                .setColor("RANDOM")
            );

        } else {
            let altEm = new Discord.MessageEmbed()
                .setTitle(`Found ${array.length} account${array.length === 1 ? '' : 's'}`)
                .setDescription('Unable to show all accounts since it exceeds the maximum amount of characters.')
                .setThumbnail(msg.guild.iconURL({dynamic: true}))
                .setColor("RANDOM")
            await msg.channel.send(altEm);
        }
    }
}