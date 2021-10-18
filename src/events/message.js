const { Permissions, MessageEmbed } = require('discord.js');

module.exports = (client, msg) => {
  if (msg.author.bot || !msg.guild) {
    return;
  }

  if (msg.content && require('../automod.json').enabled === true) {
    let censor = require('../automod.json').invites;
    const censorChecks = !!censor.find((word) => {
      if (msg.member.roles.cache.find(r => r.id === '439872254390829077') || msg.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) || msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
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

    let slurCensor = require('../automod.json').slurs;
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
          embed: new MessageEmbed().setColor('#fc5858').setThumbnail(msg.author.avatarURL({ dylanic: true, format: 'png' })).setDescription(`<@${msg.author.id}> | ${msg.author.tag} (${msg.author.id}) tried to say a blacklisted in <#${msg.channel.id}>\n\n Message Deleted: ||${msg.content}||\n\n** **`)
        });
      });
    }

    const massmention = require('../automod.json').massmention;
    const regex = /<@![0-9]{18}>/gm;
    try {
      var validate = msg.content.match(regex != null && regex).length >= massmention;

  } catch (error) { };
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
  if (command.ownerOnly && !client.config.owners.includes(msg.author.id)) {
    return;
  }

  if (command.permissions !== undefined && Array.isArray(command.permissions) && msg.guild) { // Permissions stuff
    const doesntHave = command.permissions.some(x => !msg.member.permissions.has(x));
    if (doesntHave) {
      const missing = command.permissions.filter(x => !msg.member.permissions.has(x));
      return msg.channel.send(`You're missing the following permissions: ${missing.join(', ')}`);
    }
  }

  try {
    client.log.info('Attempting to run cmd ' + command.name + ' (ran by ' + msg.author.id + ')');
    command.execute(client, msg, args);
  } catch (err) {
    client.log.error(err);
    return msg.channel.send("```" + err + "```");
  }


};
