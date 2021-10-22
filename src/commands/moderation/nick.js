module.exports = {
    name: 'nick',
    description: 'Change a user\'s nickname.',
    usage: '[user mention or id] [nickname]',
    category: 'Moderation',
    aliases: ['nickname'],
    permissions: ['MANAGE_NICKNAMES'],
    execute(client, msg, args) {
        const user = msg.mentions.users.first() || args[0];
        const member = msg.guild.member(user);
        if (member) {
            if (client.config.modRole) {
                if (member.roles.cache.find(r => r.id === client.settings.modRole)) {
                    return msg.channel.send('You cannot change the nick of this user.');
                }
            }
            member.setNickname(args.slice(1).join(' ')).then(() => {
                msg.channel.send(`${member.user.tag}'s nickname has been changed to ${args.slice(1).join(' ')}`);
            }).catch(err => {
                console.error(err);
                msg.channel.send('Failed to change nickname.');
            });        
        } else {
            msg.channel.send('No user provided');
        }
    }
};
