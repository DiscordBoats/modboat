const {preconditions} = require('../Functions/preconditions');
const automodInvites = require('../Functions/automod/invites');
const automodSlurs = require('../Functions/automod/slurs');
const automodMassmention = require('../Functions/automod/massmention');
const automodScam = require('../Functions/automod/scam');
const {MessageEmbed, Permissions} = require("discord.js");

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
