module.exports = {
    name: 'fetch',
    description: 'Find users whose username contains some characters.',
    usage: '[search]',
    category: 'Utility',
    permissions: ['BAN_MEMBERS'],
    async execute(_client, msg, args) {
        const members = filter(await msg.guild.members.fetch(), (_k, v) => v.user.username.includes(args.join(' ')));
        let list = '';
        members.forEach(member => {
            list += `${member.user.username}#${member.user.discriminator} (${member.user.id})\n`;
        });
        const embed = {
            color: 'd35c5e',
            title: 'Results found',
            description: list
        }
        msg.channel.send({
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
