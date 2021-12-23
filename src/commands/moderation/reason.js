const {MessageEmbed} = require('discord.js');

module.exports = {
    name: 'reason',
    description: 'Changes a reason.',
    usage: '[reason number] [reason]',
    category: 'Moderation',
    permissions: ['BAN_MEMBERS'],
    execute(client, msg, args) {
        const modlogCase = client.db.prepare('SELECT message_id FROM cases WHERE number=?').get(args[0]);
        if (!modlogCase) {
            msg.channel.send('That case does not exist.');
        }

        if (!client.settings.modlog) {
            msg.channel.send('There is no modlog channel set.');
        }

        const reason = args.slice(1).join(' ');
        if(!reason) {
            return msg.channel.send('You must provide a reason.');
        }
        client.channels.fetch(client.settings.modlog).then(channel => {
            channel.messages.fetch(modlogCase.message_id).then(message => {
                message.embeds[0].description = message.embeds[0].description.split('**Reason:**')[0] + '**Reason:** ' + reason;
                message.edit({embeds: [new MessageEmbed(message.embeds[0])]});
                msg.channel.send(`Reason for case ${args[0]} has been updated.`);
            });
        });
    }
};
