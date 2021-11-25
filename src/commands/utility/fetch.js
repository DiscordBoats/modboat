const { MessageEmbed } = require('discord.js')
module.exports = {
    name: 'fetch',
    description: 'Find users whose username contains some characters.',
    usage: '[search]',
    category: 'Utility',
    permissions: ['BAN_MEMBERS'],
    async execute(_client, msg, args) {
        const members = filter(await msg.guild.members.fetch(), (_k, v) => v.user.username.toLowerCase().includes(args.join(' ').toLowerCase()));
        if(!args[0]) {
            let embed2 = new MessageEmbed()
                .setColor('RANDOM')
                .setDescription(`Fetch usage example:\n\`\`\`fetch id [User_id]\nfetch [search]\n\`\`\``)
            return msg.channel.send(embed2);
        }

        if(args[0] === 'id') {
            let globaluser =  _client.users.fetch(args[1])
            if(globaluser) {
                let gloUserEmbed = new MessageEmbed()
                    .setTitle('Fetch')
                    .setDescription(`${(await globaluser).username}#${(await globaluser).discriminator} | ${(await globaluser).id}`)
                    .addField('Bot:', `${(await globaluser).bot}`, true)
                    .addField('Created At:', `${require('moment')((await globaluser).createdAt).format('LLL')} (<t:${require('moment')((await globaluser).createdAt).format('X')}:R>)`, true)
                    .setThumbnail((await globaluser).displayAvatarURL({ dynamic: true }))
                    .setColor('#0099ff')
                return msg.channel.send(gloUserEmbed)
            }
        }

        let list = '';
        members.forEach(member => {
            list += `${member.user.username}#${member.user.discriminator} (${member.user.id})\n`;
        });

        if (list === '') {
            return msg.channel.send('No users found.');
        }

        const embed = {
            color: 'd35c5e',
            title: 'Results found',
            description: list.substring(0, 4096)
        }

        await msg.channel.send({
            embed
        });
    }
};

const filter = (map, pred) => {
    const result = new Map();
    for (let [k, v] of map) {
        if (pred(k, v)) {
            result.set(k, v);
        }
    }
    return result;
}
