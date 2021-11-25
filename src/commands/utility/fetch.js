const { MessageEmbed } = require('discord.js')
const fetch = require('cross-fetch')
const moment = require("moment");
const discord = require("discord.js");
const Discord = require("discord.js");
module.exports = {
    name: 'fetch',
    description: 'Find users whose username contains some characters.',
    usage: '[search]',
    category: 'Utility',
    permissions: ['BAN_MEMBERS'],
    async execute(_client, msg, args) {

        switch (args[0]) {

            case 'bot':
                if (args[1]) {
                    await fetch(`https://discord.boats/api/bot/${args[1]}`, {
                        method: 'GET',
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }).then(async body => {
                        const res = await body.json()
                        switch (null) {
                            case res.bot_server_count:
                                res.bot_server_count = 0
                                break;
                        }
                        if (res.error === true) return msg.channel.send(res.message)
                        if (res.bot_short_desc.length > 100) {
                            const embed = new MessageEmbed()
                                .setURL(`https://discord.boats/bot/${args[1]}`)
                                .setTitle(`${res.bot_name} (${res.bot_id})`)
                                .setDescription(`**Prefix:** \`\`${res.bot_prefix}\`\`\n **Library:** \`\`${res.bot_library}\`\`\n **Short Desc:** \`\`\`Short description over 100 chars.\`\`\`\n **Owners:** \`\`${res.bot_owners.join(' | ')}\`\`\n **Ceritied:** \`\`${res.bot_certified}\`\`\n **In Queue:** \`\`${res.bot_in_queue}\`\`\n **Categories:** \`\`${res.bot_categories.join(' | ')}\`\`\n **Server Count:** \`\`${res.bot_server_count}\`\`\n **Vote Count:** \`\`${res.bot_vote_count}\`\`\n **Invite:** **[Click Here](${res.bot_invite_link})**\n **Support Server:** **[Click Here](${res.bot_support_discord})**\n **Website:** **[Click Here](${res.bot_website})**\n **Github:** **[Click Here](${res.bot_github_repo})**`)
                                .setThumbnail(`https://cdn.discordapp.com/avatars/${args[1]}/${res.bot_avatar}`)
                                .setColor('#0099ff')
                            return msg.channel.send(embed)
                        }
                        const embed = new MessageEmbed()
                            .setURL(`https://discord.boats/bot/${args[1]}`)
                            .setTitle(`${res.bot_name} (${res.bot_id})`)
                            .setDescription(`**Prefix:** \`\`${res.bot_prefix}\`\`\n **Library:** \`\`${res.bot_library}\`\`\n **Short Desc:** \`\`\`${res.bot_short_desc}\`\`\`\n **Owners:** \`\`${res.bot_owners.join(' | ')}\`\`\n **Ceritied:** \`\`${res.bot_certified}\`\`\n **In Queue:** \`\`${res.bot_in_queue}\`\`\n **Categories:** \`\`${res.bot_categories.join(' | ')}\`\`\n **Server Count:** \`\`${res.bot_server_count}\`\`\n **Vote Count:** \`\`${res.bot_vote_count}\`\`\n **Invite:** **[Click Here](${res.bot_invite_link})**\n **Support Server:** **[Click Here](${res.bot_support_discord})**\n **Website:** **[Click Here](${res.bot_website})**\n **Github:** **[Click Here](${res.bot_github_repo})**`)
                            .setThumbnail(`https://cdn.discordapp.com/avatars/${args[1]}/${res.bot_avatar}`)
                            .setColor('#0099ff')
                        await msg.channel.send(embed)
                    })
                }
                break;

            case 'user':
                if (args[1]) {
                    fetch(`https://discord.boats/api/user/${args[1]}`, {
                        method: 'GET',
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }).then(async body => {
                        const p = _client.users.fetch(args[1])
                        const member = msg.guild.member(args[1]);
                        const inServer = !!member;
                        const res = await body.json()
                        const embed = new MessageEmbed()
                            .setURL(`https://discord.boats/user/${args[1]}`)
                            .setTitle(`${res.user_name} (${res.user_id})`)
                            .setDescription(`**Bio:** \`\`\`${res.user_bio}\`\`\`\n **Premium:** ${res.user_premium ? null : 'false'}\n**In server** ${inServer}\n **Website:** **[Click Here](${res.user_website})**\n **Twitter:** **[Click Here](${res.user_twitter})**\n **Github:** **[Click Here](${res.user_github})**\n **Instagram:** **[Click Here](${res.user_instagram})**\n **Reddit:** **[Click Here](${res.user_reddit})**`)
                            .setThumbnail((await p).displayAvatarURL({ dynamic: true }))
                            .setColor('#0099ff')
                        await msg.channel.send(embed)

                    }).catch(async (err) => {
                        const globaluser = _client.users.fetch(args[1])
                        const member = msg.guild.member(args[1]);
                        const inServer = !!member;

                        if (globaluser) {
                            const gloUserEmbed = new MessageEmbed()
                            .setURL(`https://discord.com/users/${args[1]}`)
                                .setTitle(`${(await globaluser).username}#${(await globaluser).discriminator} | ${(await globaluser).id}`)
                                .setDescription(`**Bot**: ${(await globaluser).bot}\n**Created at**: ${require('moment')((await globaluser).createdAt).format('LLL')} (<t:${require('moment')((await globaluser).createdAt).format('X')}:R>)\n**In server**: ${inServer}`)
                                .setThumbnail((await globaluser).displayAvatarURL({ dynamic: true }))
                                .setColor('#0099ff')
                            return msg.channel.send(gloUserEmbed)
                        }

                    })
                }
                break;
            case 'list':
                if (args[1]) {
                    const members = filter(await msg.guild.members.fetch(), (_k, v) => v.user.username.toLowerCase().includes(args[1].toLowerCase()))
                    let list = '';
                    members.forEach(member => {
                        list += `${member.user.username}#${member.user.discriminator} (${member.user.id})\n`;
                    });

                    if (list === '') {
                        return msg.channel.send('No users found.');
                    }

                    const embed = {
                        color: 'd35c5e',
                        title: 'Results found',
                        description: list.substring(0, 4096)
                    }

                    await msg.channel.send({
                        embed
                    });
                }
                break;
            case 'alt':
                if (args[1]) {
                    const Discord = require('discord.js');

                    let days = args[1];
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
                        .setAuthor(`Found ${array.length} account${array.length === 1 ? '' : 's'} that have been created within the last ${days} day${days === 1 ? '' : 's'}`)
                        .setDescription(array.join("\n\n") || "No alts found")
                        .setThumbnail(msg.guild.iconURL({ dynamic: true }))
                        .setColor("RANDOM")

                    if (array.length <= interval) {

                        const range = (array.length === 1) ? '[1]' : `[1 - ${array.length}]`;
                        await msg.channel.send(embed
                            .setAuthor(`Found ${array.length} account${array.length === 1 ? '' : 's'} that have been created within the last ${days} day${days === 1 ? '' : 's'}`)
                            .setDescription(array.join("\n\n") || "No alts found")
                            .setThumbnail(msg.guild.iconURL({ dynamic: true }))
                            .setColor("RANDOM")
                        );

                    } else {
                        let altEm = new Discord.MessageEmbed()
                            .setAuthor(`Found ${array.length} account${array.length === 1 ? '' : 's'} that have been created within the last ${days} day${days === 1 ? '' : 's'}`)
                            .setDescription('Unable to show all accounts since it exceeds the maximum amount of characters.')
                            .setThumbnail(msg.guild.iconURL({ dynamic: true }))
                            .setColor("RANDOM")
                        await msg.channel.send(altEm);
                    }
                }
                break;
            default:
                let embed2 = new MessageEmbed()
                    .setColor('RANDOM')
                    .setDescription(`Fetch usage example:\n\`\`\`fetch [user/bot/list/alt] [id/name/days]\`\`\``)
                return msg.channel.send(embed2);
        }

    }

}
/*
if(args[0] === 'id') {
    let globaluser =  _client.users.fetch(args[1])
    if(globaluser) {
        let gloUserEmbed = new MessageEmbed()
            .setTitle('Fetch')
            .setDescription(`${(await globaluser).username}#${(await globaluser).discriminator} | ${(await globaluser).id}`)
            .addField('Bot:', `${(await globaluser).bot}`, true)
            .addField('Created At:', `${require('moment')((await globaluser).createdAt).format('LLL')} (<t:${require('moment')((await globaluser).createdAt).format('X')}:R>)`, true)
            .setThumbnail((await globaluser).displayAvatarURL({ dynamic: true }))
            .setColor('#0099ff')
        return msg.channel.send(gloUserEmbed)
    }
}
 */



const filter = (map, pred) => {
    const result = new Map();
    for (let [k, v] of map) {
        if (pred(k, v)) {
            result.set(k, v);
        }
    }
    return result;
}
