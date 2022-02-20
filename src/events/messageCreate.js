const {preconditions} = require('../Functions/preconditions');
const automodInvites = require('../Functions/automod/invites');
const automodSlurs = require('../Functions/automod/slurs');
const automodMassmention = require('../Functions/automod/massmention');
const automodScam = require('../Functions/automod/scam');
const {MessageEmbed} = require("discord.js");

module.exports = async (client, msg) => {
    try {
        if (msg.author.bot || !msg.guild) {
            return;
        }
    }catch(e) {
        return;
    }

    // automod
    // && client.settings.automod
    if (msg.content) {

        await automodInvites(client, msg);
        await automodSlurs(client, msg);
        await automodMassmention(client, msg);
        await automodScam(client, msg);
    }
    const reg = new RegExp(/why/g || /website|discord boats/g || /going|down/g)

    if(reg.test(msg.content)) {
        return msg.reply({
            embeds: [
                new MessageEmbed()
                    .setColor("BLUE")
                    .setDescription("[Why is Discord boats shutting down?](https://discord.com/channels/439866052684283905/439866052684283907/945095023526035486)\n\nThe shutdown of the website is because of three things:\n" +
                        "- Money, the site was losing money and costing the developers every month to run.\n" +
                        "- Time, running a site like this takes a lot of time. Both me and Roee have full-time jobs in the software industry.\n" +
                        "- Scope, the general scope of the discord bot listing field has been going downhill for the last five years. Nowadays the field is only about top.gg and discord trying to create their own solution to replace botlists.")
            ]
        })
    }
    // prefix stuff
    const prefixMention = new RegExp(`^<@!?${client.user.id}> `);
    const prefix = msg.content.match(prefixMention) ? msg.content.match(prefixMention)[0] : (client.settings.prefix || client.config.defaultPrefix);
    if (msg.content.indexOf(prefix) !== 0) {
        return;
    }

    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const name = args.shift();
    const command = client.commands.get(name) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(name));

    const runPreconditions = preconditions(client, msg, command);
    if (runPreconditions) {
        return;
    }



    try {
        client.log.info('Attempting to run cmd ' + command.name + ' (ran by ' + msg.author.id + ')');
        command.execute(client, msg, args);
    } catch (err) {
        client.log.error(err);
        return msg.channel.send("```" + err + "```");
    }
};
