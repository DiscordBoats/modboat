module.exports = {
    name: 'say',
    description: 'Say something in chat.',
    usage: '[message]',
    category: 'Utility',
    permissions: ['BAN_MEMBERS'],
    async execute(_client, msg, args) {
        if (!args[0]) {
            return await msg.delete();
        }

        msg.channel.send(args.join(' ')).then(async () => {
            await msg.delete();
        });
    }
};
