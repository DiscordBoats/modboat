module.exports = {
    name: "dehoist",
    descritpion: 'Dehoists Users',
    usage: 'nickname [user mention or id] | username [user mention or id]',
    category: 'Moderation',
    permissions: ["MANAGE_NICKNAMES"],
    async execute(client, msg, args) {
        const member = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) 
        if(!member) return msg.channel.send(`Please mention the user to dehoist. **(${client.config.prefix}dehoist [nickname/username] [mention])**`)
        if(!member.kickable) return msg.channel.send('This person is higher then me thus i can\'t their name.') 
        if (args[0] === 'nickname') {
            if (member.nickname === null) return msg.channel.send('This user doesn\'t seem to be hoisting.')
            if (client.emoji.removeEmoji(member.nickname, false)) {
                member.edit({ nick: 'User hoisting'})
                return message.channel.send(`\`${member.user.tag}\` has been dehoisted.`)

            }
            
            const nick = member.nickname.startsWith(("!", ":", "?", "$", "%", "&", "'", "(", ")", "#", "*", "+", ",", "-", ".", "/").charAt(1))
            if (nick) {
                member.edit({ nick: 'User hoisting'})
                return msg.channel.send(`\`${member.user.tag}\` has been dehoisted.`)
            }
            
            if (!nick) return msg.channel.send('This user doesn\'t seem to be hoisting.')
            if (member.nickname[0] < '0') {
                member.edit({ nick: 'User hoisting'})
                return msg.channel.send(`\`${member.user.tag}\` has been dehoisted.`)
            }

        }
        if (args[0] === 'username') {
            if (member.user.username === null) return msg.channel.send('This user doesn\'t seem to be hoisting.')
            if (client.emoji.removeEmoji(member.user.username, false)) {
                member.edit({ nick: 'User hoisting'})
                return msg.channel.send(`\`${member.user.tag}\` has been dehoisted.`)
            }
            
            const user = member.user.username.startsWith(("!", ":", "?", "$", "%", "&", "'", "(", ")", "#", "*", "+", ",", "-", ".", "/").charAt(1))
            if (user) {
                member.edit({ nick: 'User hoisting'})
                return msg.channel.send(`\`${member.user.tag}\` has been dehoisted.`)
            }
            if (!user) return msg.channel.send('This user doesn\'t seem to be hoisting.')
            if (member.user.username[0] < '0' ) {
                member.edit({ nick: 'User hoisting'})
                return msg.channel.send(`\`${member.user.tag}\` has been dehoisted.`)
            };
        };
    }
}