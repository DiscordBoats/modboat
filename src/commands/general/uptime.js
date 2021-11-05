const ms = require('ms');

module.exports = {
    name: 'uptime',
    category: 'General',
    description: 'Get the bot uptime',
    async execute(client, msg, _args) {
        msg.channel.send(ms(client.uptime, {long: true}));
    }
}
