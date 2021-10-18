module.exports = (client, oldMsg, newMsg) => {
    if (!oldMsg.author.bot === false) {
        return;
    }

    client.channels.fetch(client.config.messagelog).then(channel => {
        const embed = {
            color: 'dc3b3b',
            author: {
                name: `A message was edited by ${oldMsg.author.tag} (${oldMsg.author.id})`,
                icon_url: oldMsg.author.avatarURL()
            },
            title: `<#${oldMsg.channel.id}>`,
            url: `https://discord.com/channels/${newMsg.guild.id}/${newMsg.channel.id}/${newMsg.id}`,
            description: `**Old Message**:\n${oldMsg.content}\n\n**New Message**:\n${newMsg.content}`
        }
        channel.send({ embed });
    });
};
