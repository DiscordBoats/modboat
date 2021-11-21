const Discord = require('discord.js')
const fs = require("fs");
module.exports = async (client, messages) => {
    const length = messages.array().length;
    const channel = messages.first().channel.name;

    require('fs').writeFile(`./bulkDeleteLog.txt`, `${messages.map(message => `[${message.author.tag} (${message.author.id}) | ${require('moment')(message.createdAt).format('LLL')}]\n${message.content ? message.content : "<No messages found, maybe a embed or attachment>"}\n\n`).join(" ")}`, function (err) {
            if (err) {
                messages.first().channel.send(err)
            }
        });
    const embed = new Discord.MessageEmbed()
        .setDescription(`${length} messages were deleted in ${channel}`)
        .setColor('YELLOW')
    setTimeout(async () => {
        client.channels.fetch(client.settings.messagelog).then(channel => {
          channel.send({embed, files: [`./bulkDeleteLog.txt`]});
        })
    }, 10000)

    setTimeout(async () => {
        fs.unlink(`./bulkDeleteLog.txt`, function (err) {
            if (err) {
                messages.first().channel.send(err)
            }
        });
    }, 20000)
}