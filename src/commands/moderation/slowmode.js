module.exports = {
    name: 'slowmode',
    description: 'Changes the slowmode.',
    usage: '[time]',
    category: 'Moderation',
    permissions: ['MANAGE_MESSAGES'],
    execute(_client, msg, args) {
        msg.channel.setRateLimitPerUser(args[0]);
        msg.channel.send(`Updated slowmode to ${args[0]} seconds.`);
    }
};
