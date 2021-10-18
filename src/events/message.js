const { Permissions, MessageEmbed } = require('discord.js');
const automod = require('../automod.json');
const { preconditions } = require('../functions/preconditions');

module.exports = (client, msg) => {
  if (msg.author.bot || !msg.guild) {
    return;
  }

  // automod
  if (msg.content && automod.enabled === true) {
    const censor = automod.invites;
    const censorChecks = !!censor.find((word) => {
      if (msg.member.roles.cache.find(r => r.id === client.config.modRole) || msg.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) || msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        return;
      }
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      return regex.test(msg.content);
    });
    if (censorChecks) {
      setTimeout(() => {
        msg.delete().catch((err) => { })
      }, 0);
      client.channels.fetch(client.config.messagelog).then(channel => {
        return channel.send({
          embed: new MessageEmbed().setColor('RED').setThumbnail(msg.author.avatarURL({ dylanic: true, format: 'png' })).setDescription(`<@${msg.author.id}> | ${msg.author.tag} (${msg.author.id}) tried to advertise in <#${msg.channel.id}>\n\n Message Deleted: ||${msg.content}||\n\n** **`)
        });
      });
    }

    const slurCensor = automod.slurs;
    const slurCheck = !!slurCensor.find((word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      return regex.test(msg.content);
    });
    if (slurCheck) {
      setTimeout(() => {
        msg.delete().catch((err) => { })
      }, 0);
      client.channels.fetch(client.config.messagelog).then(channel => {
        return channel.send({
          embed: new MessageEmbed().setColor('#fc5858').setThumbnail(msg.author.avatarURL({ dylanic: true, format: 'png' })).setDescription(`<@${msg.author.id}> | ${msg.author.tag} (${msg.author.id}) tried to say a blacklisted word/phrase in <#${msg.channel.id}>\n\n Message Deleted: ||${msg.content}||\n\n** **`)
        });
      });
    }

    const massmention = automod.massmention;
    const regex = /<@![0-9]{18}>/gm;
    let validate;
    try {
      validate = msg.content.match(regex).length >= massmention;
    } catch (error) { }
    if (validate) {
      const member = msg.member;
      const muterole = msg.guild.roles.cache.find(r => r.name === client.config.muted);
      member.roles.add(muterole).then(() => {
        setTimeout(() => {
          msg.delete().catch((err) => { })
        }, 0);
        client.channels.fetch(client.config.messagelog).then(channel => {
          return channel.send({
            embed: new MessageEmbed().setColor('#fc5858').setThumbnail(msg.author.avatarURL({ dylanic: true, format: 'png' })).setDescription(`<@${msg.author.id}> | ${msg.author.tag} (${msg.author.id}) mass mentioned more then or at least ${massmention} user(s) in <#${msg.channel.id}>\n\n User has been Muted.`)
          });
        });
      });
    }
  }

  // prefix stuff
  const prefixMention = new RegExp(`^<@!?${client.user.id}> `);
  const prefix = msg.content.match(prefixMention) ? msg.content.match(prefixMention)[0] : client.config.prefix;
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
  const runPreconditions = preconditions(client, msg.member, command);
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
