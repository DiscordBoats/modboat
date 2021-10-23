module.exports = {
    name: 'reload',
    category: 'Admin',
    description: 'Reload commands',
    ownerOnly: true,
    aliases: ['unload', 'load'],
    async execute(client, msg, args) {
        if (!args || args.size < 0) {
            return msg.channel.send('Need a category.');
        }

        if (!args || args.size < 1) {
            return msg.channel.send('Need a command.');
        }

        const categoryName = args[0];
        const commandName = args[1];
        const unload = args[2];

        try {
            delete require.cache[require.resolve(`../${categoryName}/${commandName}.js`)];
            client.commands.delete(commandName);
        } catch (e) {
            client.log.warn(`Failed to unload command ${commandName}, likely doesn't exist`);
            if (unload === 'unload') {
                return msg.channel.send(`Failed to unload command **${commandName}**.`);
            }
        }

        try {
            client.commands.set(commandName, require(`../${categoryName}/${commandName}.js`));
        } catch (e) {
            client.log.error(`Failed to load command ${commandName}`)
            return msg.channel.send(`Failed to reload command **${commandName}**` + '```js\n' + e + '```.');
        }
        client.log.warn(`Reloaded command ${commandName} (${categoryName})`);
        msg.channel.send(`Managed to (re)load command **${commandName}** from category **${categoryName}**.`);
    }
};
