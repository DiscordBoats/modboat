const {Permissions, MessageEmbed} = require('discord.js')
const childProcess = require("child_process");

module.exports = {
    name: 'exec',
    description: 'Execute console code',
    aliases: ['ex'],
    usage: '[Commandline]',
    category: 'Admin',
    async execute(client, msg, args) {

        if (msg.author.id === '750510159289254008' || msg.member.roles.cache.find(r => r.id === client.config.modrole) || msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            let executing = await msg.channel.send("Executing. . .")
            if (!args.join(" ")) return executing.edit(":x: You need to provide a command to execute.")

            const childProcess = require("child_process");
            let codebook = "```";

            try {
                childProcess.exec(args.join(" "), {}, (err, stdout) => {
                    if (err) {
                        let errorembed = new MessageEmbed()
                            .setDescription(`\`\`\`${err}\`\`\``)
                            .setColor("RED")
                            .setFooter("Ooooo an error.")
                        return msg.channel.send(errorembed);
                    }


                    msg.channel.send(`${codebook}diff\n${stdout}${codebook}`);
                });
            } catch (err) {
                let errorEmbed = new MessageEmbed()
                    .setDescription(`Looks like you got an internal error:\n\n${codebook}${err}${codebook}`)
                    .setColor("RED");
                await msg.channel.send(errorEmbed);
            }
            setTimeout(() => executing.delete(), 0);


        } else {
            let funnyembedthingthatImade = new MessageEmbed().setColor('RANDOM').setImage('https://i.kym-cdn.com/photos/images/newsfeed/001/869/622/b0c.gif')
            await msg.channel.send(funnyembedthingthatImade);
        }

    }
}