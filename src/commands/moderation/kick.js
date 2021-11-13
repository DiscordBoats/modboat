module.exports = {
    name: 'kick',
    description: 'Kicks a user.',
    usage: '[user mention or id] [reason]',
    category: 'Moderation',
    permissions: ['KICK_MEMBERS'],
    async execute(client, msg, args) {
        const user = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || msg.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());

        if (user) {
            /* Returns undefined either way.
            if (!user.user.kickable) {
                return msg.channel.send('You cannot kick this user.');
            }
             */

            if (user.user.id === msg.author.id || user.user.id === client.user.id) {
                return msg.channel.send('You cannot kick the bot or yourself.');
            }

            if (client.settings.modrole) {
                if (user.user.roles.cache.has(client.settings.modrole)) {
                    return msg.channel.send('You cannot kick this user.');
                }
            }
            await user.send(`You've been kicked from \`${msg.guild.name}\` for the reason: \`${args.slice(1).join(' ') || 'No reason provided.'}\`.`)
            user.kick(`${args.slice(1).join(' ')} | Action by: ${msg.author.tag}`).then(() => {
                msg.channel.send(`${user.user.tag} (${user.user.id}) has been kicked.`);
                if (!client.settings.modlog) {
                    msg.channel.send(`Looks like a mod log channel hasn't been set!`);
                }

                client.channels.fetch(client.settings.modlog).then(channel => {
                    const latest = client.db.prepare('SELECT number FROM cases ORDER BY number DESC LIMIT 1').get() || {number: 0};
                    const embed = {
                        color: 'f1aeae',
                        author: {
                            name: 'Kick | Case #' + (latest.number + 1),
                            icon_url: msg.author.avatarURL()
                        },
                        description: `**User:** ${banned.user.tag} (${banned.user.tag})\n**Moderator:** ${msg.author.tag} (${msg.author.id})\n**Reason:** ${args.slice(1).join(' ') || 'No reason provided. To provide a reason run +reason ' + (latest.number + 1)}`,
                        footer: {
                            text: msg.guild.name,
                            icon_url: msg.guild.iconURL()
                        }
                    }
                    channel.send({
                        embed
                    }).then(message => {
                        client.db.prepare('INSERT INTO cases (message_id) VALUES (?)').run(message.id);
                    });
                });
            });
        } else {
            msg.channel.send('No user provided');
        }
    }
};
