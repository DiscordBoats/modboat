module.exports = {
    name: 'ping',
    category: 'General',
    description: 'Get the bot ping',
    async execute(client, msg, _args) {
        msg.channel.send(`**${(client.ws.ping)}**ms`);
    }
}
