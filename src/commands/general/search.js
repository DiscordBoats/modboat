const fetch = require('cross-fetch')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "search",
    description: 'Finds a user or bot on the website.',
    usage: '[search]',
    category: "General",
    async execute(_client, msg, args) {
        if (!args[0]) return msg.channel.send('You must say either bot or user including the user/bot id.')
        switch (args[0]) {
            case 'bot':
                if (args[1]) {
                    fetch(`https://discord.boats/api/bot/${args[1]}`, {
                        method: 'GET',
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }).then(async body => {
                        const res = await body.json()
                        if (res.error == true) return msg.channel.send(res.message)
                        if (res.bot_short_desc.length > 100) {
                        const embed = new MessageEmbed()
                        .setURL(`https://discord.boats/bot/${args[1]}`)
                        .setTitle(`${res.bot_name} (${res.bot_id})`)
                        .setDescription(`**Prefix:** \`\`${res.bot_prefix}\`\`\n **Library:** \`\`${res.bot_library}\`\`\n **Short Desc:** \`\`Short description over 100 chars.\`\`\n **Owners:** \`\`${res.bot_owners.join(' | ')}\`\`\n **Ceritied:** \`\`${res.bot_certified}\`\`\n **In Queue:** \`\`${res.bot_in_queue}\`\`\n **Categories:** \`\`${res.bot_categories.join(' | ')}\`\`\n **Server Count:** \`\`${res.bot_server_count}\`\`\n **Vote Count:** \`\`${res.bot_vote_count}\`\`\n **Invite:** **[Click Here](${res.bot_invite_link})**\n **Support Server:** **[Click Here](${res.bot_support_discord})**\n **Website:** **[Click Here](${res.bot_website})**\n **Github:** **[Click Here](${res.bot_github_repo})**`)
                        .setThumbnail(`https://cdn.discordapp.com/avatars/${args[1]}/${res.bot_avatar}`)
                        .setColor('#0099ff')
                        return msg.channel.send(embed)
                        }
                        const embed = new MessageEmbed()
                        .setURL(`https://discord.boats/bot/${args[1]}`)
                        .setTitle(`${res.bot_name} (${res.bot_id})`)
                        .setDescription(`**Prefix:** \`\`${res.bot_prefix}\`\`\n **Library:** \`\`${res.bot_library}\`\`\n **Short Desc:** \`\`${res.bot_short_desc}\`\`\n **Owners:** \`\`${res.bot_owners.join(' | ')}\`\`\n **Ceritied:** \`\`${res.bot_certified}\`\`\n **In Queue:** \`\`${res.bot_in_queue}\`\`\n **Categories:** \`\`${res.bot_categories.join(' | ')}\`\`\n **Server Count:** \`\`${res.bot_server_count}\`\`\n **Vote Count:** \`\`${res.bot_vote_count}\`\`\n **Invite:** **[Click Here](${res.bot_invite_link})**\n **Support Server:** **[Click Here](${res.bot_support_discord})**\n **Website:** **[Click Here](${res.bot_website})**\n **Github:** **[Click Here](${res.bot_github_repo})**`)
                        .setThumbnail(`https://cdn.discordapp.com/avatars/${args[1]}/${res.bot_avatar}`)
                        .setColor('#0099ff')
                        msg.channel.send(embed)
                    })
                }
                break;
                case 'user':
                    if(args[1]) {
                        fetch(`https://discord.boats/api/user/${args[1]}`, {
                            method: 'GET',
                            headers: {
                                "Content-Type": "application/json"
                            }
                        }).then(async body => {
                            const res = await body.json()
                            const embed = new MessageEmbed()
                            .setURL(`https://discord.boats/user/${args[1]}`)
                            .setTitle(`${res.user_name} (${res.user_id})`)
                            .setColor('#0099ff')
                            .setDescription(`**Bio:** \`\`\`${res.user_bio}\`\`\`\n **Premium:** ${res.user_premium ? null : 'false'}\n **Website:** **[Click Here](${res.user_website})**\n **Twitter:** **[Click Here](${res.user_twitter})**\n **Github:** **[Click Here](${res.user_github})**\n **Instagram:** **[Click Here](${res.user_instagram})**\n **Reddit:** **[Click Here](${res.user_reddit})**`)
                            msg.channel.send(embed)
                        }).catch((err) => {
                            msg.channel.send('Ok so bascially Roee fucked up and forgot to make an error message thing for the user part of the the api so...this message means the user wasn\'t found')
                        })
                    } 
        }
    }
}