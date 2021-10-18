
module.exports = {
    name: 'warns',
    description: 'Removes a warning from a user.',
    usage: '[user mention or id] [amount]',
    aliases: ['warnings'],
    category: 'Moderation',
    permissions: ['KICK_MEMBERS'],
    execute(client, msg, args) {
        const user = msg.mentions.users.first() ? msg.mentions.users.first().id : args[0];
        const member = msg.guild.member(user);
        if (member) {
           const warnings = client.db.prepare('SELECT number FROM warns WHERE id = ?').all(member.id)[0].number;
            
            if (!warnings || warnings === 0) {
                return msg.channel.send(`${member.user.tag} has no warnings.`);
            }

            msg.channel.send(`${member.user.tag} has ${warnings} warnings.`);
        } else {
            msg.channel.send('No user provided');
        }
    }
};
