module.exports = {
    name: 'lockdown',
    description: 'Lockdown a channel or the server',
    usage: '[type] [on/off]',
    category: 'Moderation',
    permissions: ['MANAGE_MESSAGES'],
    execute(_client, msg, args) {
        switch (args[0]) {
            case 'channel':
                if (args[1] === 'off') { 
                    msg.channel.updateOverwrite(msg.guild.id, { SEND_MESSAGES: null });
                    return msg.channel.send(`:lock: ${msg.author} unlocked the channel.`);
                }
                msg.channel.updateOverwrite(msg.guild.id, { SEND_MESSAGES: false });
                msg.channel.send(`:lock: ${msg.author} locked the channel.`);
                break;
            case 'server':
                msg.channel.send('Not implemented yet.');
                break;
            default:
                msg.channel.send('Must be channel or server');
        }
    }
}
