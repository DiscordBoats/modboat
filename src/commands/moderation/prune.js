module.exports = {
    name: 'prune',
    description: 'Deletes messages.',
    usage: '[amount]',
    aliases: ['purge'],
    category: 'Moderation',
    permissions: ['MANAGE_MESSAGES'],
    execute(_client, msg, args) {
        const amount = args[0];
        if (isNaN(amount)) {
            return msg.channel.send('Use a valid number.');
        }

        msg.channel.bulkDelete(amount, true)
            .then(messages => {
                msg.channel.send(`Deleted ${messages.size} messages.`);
            })
            .catch(err => {
                console.error(err);
                msg.channel.send('Failed to delete messages.');
            });
    }
};
