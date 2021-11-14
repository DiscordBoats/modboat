const {MessageEmbed} = require('discord.js');

module.exports = async (client, msg) => {
    if (!client.settings.modrole || !client.settings.mutedrole) {
        return;
    }

    const unix = Math.floor(new Date().getTime() / 1000);

    let data = await require('node-fetch')(client.automod.scamLinks, {
        method: "post",
        body: JSON.stringify({message: msg.content}),
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
    if (data.match) {

        setTimeout(() => {
            msg.delete()
        }, 1000);

       await msg.member.roles.add(client.settings.mutedrole);
        const embed = new MessageEmbed()
            .setAuthor(`❌ ${data.matches.map(m => m.type)} link detected!`)
            .setColor('RED')
            .setThumbnail(msg.author.avatarURL({dynamic: true}))
            .setDescription(`<@${msg.author.id}> | ${msg.author.tag} (${msg.author.id})\n\n\nScam link found <t:${unix}:R>:\n ||${data.matches.map(m => m.domain)}||`)
            .setFooter('Clicking on the link can expose your IP (location) and entering in any information details like your password or email address, will compromise your account(s).');
        await msg.channel.send(`${msg.author.id}`, embed);

        client.channels.fetch(client.settings.messagelog).then(channel => {
            let modlogembed = new MessageEmbed()
                .setColor('RED')
                .setAuthor('❌ Phishing Link Found')
                .setThumbnail(msg.author.avatarURL({dynamic: true}))
                .setDescription(`<@${msg.author.id}> | ${msg.author.tag} (${msg.author.id})\nhas been perm muted for sending a phishing link in ${msg.channel.name}.\n\nMessage Deleted <t:${unix}:R>: ||${msg.content}||`)
            channel.send(modlogembed);
        });

    } else if(/^s[tl][era][ear]r{0,1}[amn].{0,2}co[mnr]{1,4}u[nmui]{1,3}[ltyujrei]*?/gi.test(msg.content) || /^(d(i[rs]|ls)co.*\.)?/gi.test(msg.content) || /^((s[tl][era][ear]r?[amn].{0,2}.*\.)|(affix.*\.)|(cloud(9team|team9).*\.)|(cs-.*\.)|(csgo.*\.)|(discor.*\.)|(epicg.*\.)|(esl[-tpog].*\.)|(navi.*\.)|(natus-vin.*\.)|(pubg(-|\d).*\.)|(roblox.*\.)|(rust-.*\.)|(blox.*\.)|(robux.*\.))?/gi.test(msg.content)){
        setTimeout(() => {
            msg.delete()
        }, 1000);

        // await msg.member.roles.add(client.settings.mutedrole);
        const embed = new MessageEmbed()
            .setAuthor(`❌ Potential scam link detected!`)
            .setColor('YELLOW')
            .setThumbnail(msg.author.avatarURL({dynamic: true}))
            .setDescription(`<@${msg.author.id}> | ${msg.author.tag} (${msg.author.id})\n\n\nScam link found <t:${unix}:R>:\n ||${msg.content}||`)
            .setFooter("These links are not verified scam links, but user discretion is advised when going to these links.");
        await msg.channel.send(`${msg.author.id}`, embed);

        client.channels.fetch(client.settings.messagelog).then(channel => {
            let modprobe = new MessageEmbed()
                .setColor('RED')
                .setAuthor('❌ Potential scam link detected!')
                .setThumbnail(msg.author.avatarURL({dynamic: true}))
                .setDescription(`<@${msg.author.id}> | ${msg.author.tag} (${msg.author.id})\nhas sent a Potential phishing link in ${msg.channel.name}.\n\nMessage Deleted <t:${unix}:R>: ||${msg.content}||`)
            channel.send(modprobe);
        });
    }
}