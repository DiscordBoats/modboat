const {Permissions, MessageEmbed} = require('discord.js')
const childProcess = require("child_process");

module.exports = {
    name: 'exec',
    description: 'Execute console code',
    aliases: ['ex'],
    usage: '[Commandline]',
    category: 'Admin',
    ownerOnly: true,
    async execute(client, msg, args) {


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
                        return msg.channel.send({embeds: [errorembed]});
                    }


                    msg.channel.send(`${codebook}diff\n${stdout}${codebook}`);
                });
            } catch (err) {
                let errorEmbed = new MessageEmbed()
                    .setDescription(`Looks like you got an internal error:\n\n${codebook}${err}${codebook}`)
                    .setColor("RED");
                await msg.channel.send({embeds: [errorEmbed]});
            }
            setTimeout(() => executing.delete(), 0);



    }
}