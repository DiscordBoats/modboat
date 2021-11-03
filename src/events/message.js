const { preconditions } = require('../Functions/preconditions');
const automodInvites = require('../Functions/automod/invites');
const automodSlurs = require('../Functions/automod/slurs');
const automodMassmention = require('../Functions/automod/massmention');
const automodScam = require('../Functions/automod/scam');
const {MessageEmbed} = require("discord.js");

module.exports = async (client, msg) => {
  if (msg.author.bot || !msg.guild) {
    return;
  }
  // automod
  // && client.settings.automod
  if (msg.content) {
    const unix = Math.floor(new Date().getTime() / 1000);

    let data = await require('node-fetch')(client.automod.scamLinks, {
      method: "post",
      body: JSON.stringify({ message: msg.content}),
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Anti-phishing (Nek#2937 / 750510159289254008)",
      },

    }).then(res => res.json())
    /*
    const scam = await fetch(client.automod.scamLinks).then(res => res.json());

    const scamRegex = !!scam.find((word) => {
        if (msg.member.roles.cache.has(client.settings.modrole)) {
            return;
        }
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        return regex.test(msg.content);
    });
*/
    if(data.match) {

      setTimeout(() => {
        msg.delete()
      }, 0);

     // await msg.member.roles.add(client.settings.mutedrole);
      const embed = new MessageEmbed()
          .setAuthor(`❌ ${data.matches.map(m => m.type)} link detected!`)
          .setColor('RED')
          .setThumbnail(msg.author.avatarURL({ dynamic: true }))
          .setDescription(`<@${msg.author.id}> | ${msg.author.tag} (${msg.author.id})\n\n\nScam link found <t:${unix}:R>:\n ||${data.matches.map(m => m.domain)}||`)
          .setFooter('Clicking on the link can expose your IP (location) and entering in any information details like your password or email address, will compromise your account(s).');
      await msg.channel.send(`${msg.author.id}`, embed);

      client.channels.fetch(client.settings.messagelog).then(channel => {
        let modlogembed = new MessageEmbed()
            .setColor('RED')
            .setAuthor('❌ Phishing Link Found')
            .setThumbnail(msg.author.avatarURL({ dynamic: true }))
            .setDescription(`<@${msg.author.id}> | ${msg.author.tag} (${msg.author.id})\nhas been perm muted for sending a phishing link in ${msg.channel.name}.\n\nMessage Deleted <t:${unix}:R>: ||${msg.content}||`)
        channel.send(modlogembed);
      });
    }

    automodInvites(client, msg);
    automodSlurs(client, msg);
    automodMassmention(client, msg);
    automodScam(client, msg);
  }

  // prefix stuff
  const prefixMention = new RegExp(`^<@!?${client.user.id}> `);
  const prefix = msg.content.match(prefixMention) ? msg.content.match(prefixMention)[0] : (client.settings.prefix || client.config.defaultPrefix);
  if (msg.content.indexOf(prefix) !== 0) {
    return;
  }

  const args = msg.content.slice(prefix.length).trim().split(/ +/g);
  const name = args.shift();
  const cmd = client.commands.filter(x => x.name === name || (x.hasOwnProperty('aliases') ? x.aliases : []).includes(name)).array(); // Aliases
  if (!cmd.length) {
    return;
  }

  // permissions
  const command = cmd[0];
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
