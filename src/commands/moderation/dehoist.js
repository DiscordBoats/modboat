const {MessageEmbed} = require("discord.js");
module.exports = {
    name: 'dehoist',
    descritpion: 'Dehoists Users',
    usage: 'nickname [user mention or id] | username [user mention or id]',
    category: 'Moderation',
    permissions: ['MANAGE_NICKNAMES'],
    async execute(client, msg, args) {
let int = 0
        switch (args[0]) {
            case 'username':
                msg.guild.members.cache.forEach( (us) => {
                    const member = msg.guild.member(us.user)
                    if(!member.user.username) return;
                    if(member.user.username.charAt(0).startsWith(`!`) || member.user.username.charAt(0).startsWith(`:`) || member.user.username.charAt(0).startsWith("?") || member.user.username.charAt(0).startsWith("$") || member.user.username.charAt(0).startsWith("#") || member.user.username.charAt(0).startsWith("@") || member.user.username.charAt(0).startsWith("&") || member.user.username.charAt(0).startsWith("%") || member.user.username.charAt(0).startsWith("^") || member.user.username.charAt(0).startsWith("*") || member.user.username.charAt(0).startsWith("(") || member.user.username.charAt(0).startsWith(")") || member.user.username.charAt(0).startsWith("-") || member.user.username.charAt(0).startsWith("_") || member.user.username.charAt(0).startsWith("+") || member.user.username.charAt(0).startsWith("=") || member.user.username.charAt(0).startsWith("[") || member.user.username.charAt(0).startsWith("]") || member.user.username.charAt(0).startsWith("{") || member.user.username.charAt(0).startsWith("}") || member.user.username.charAt(0).startsWith("|") || member.user.username.charAt(0).startsWith("\\") || member.user.username.charAt(0).startsWith(";") || member.user.username.charAt(0).startsWith(":") || member.user.username.charAt(0).startsWith("'") || member.user.username.charAt(0).startsWith("\"") || member.user.username.charAt(0).startsWith("<") || member.user.username.charAt(0).startsWith(">") || member.user.username.charAt(0).startsWith("?") || member.user.username.charAt(0).startsWith("/") || member.user.username.charAt(0).startsWith(".")) { // I hate myself

                        /*
                        for(const a of member.user.username) {

                            int = a.length
                        }
                         */
                        member.setNickname(`Z Hoisting Bad`)
                    }

                })
                msg.channel.send(`${int} users dehoisted.`)
                break;
            case 'nick':
                msg.guild.members.cache.forEach( (user) => {
                    const member = msg.guild.member(user.user);
                    if(!member.nickname) return;
                    if(member.nickname.charAt(0).startsWith(`!`) || member.nickname.charAt(0).startsWith(`:`) || member.nickname.charAt(0).startsWith("?") || member.nickname.charAt(0).startsWith("$") || member.nickname.charAt(0).startsWith("#") || member.nickname.charAt(0).startsWith("@") || member.nickname.charAt(0).startsWith("&") || member.nickname.charAt(0).startsWith("%") || member.nickname.charAt(0).startsWith("^") || member.nickname.charAt(0).startsWith("*") || member.nickname.charAt(0).startsWith("(") || member.nickname.charAt(0).startsWith(")") || member.nickname.charAt(0).startsWith("-") || member.nickname.charAt(0).startsWith("_") || member.nickname.charAt(0).startsWith("+") || member.nickname.charAt(0).startsWith("=") || member.nickname.charAt(0).startsWith("[") || member.nickname.charAt(0).startsWith("]") || member.nickname.charAt(0).startsWith("{") || member.nickname.charAt(0).startsWith("}") || member.nickname.charAt(0).startsWith("|") || member.nickname.charAt(0).startsWith("\\") || member.nickname.charAt(0).startsWith(";") || member.nickname.charAt(0).startsWith(":") || member.nickname.charAt(0).startsWith("'") || member.nickname.charAt(0).startsWith("\"") || member.nickname.charAt(0).startsWith("<") || member.nickname.charAt(0).startsWith(">") || member.nickname.charAt(0).startsWith("?") || member.nickname.charAt(0).startsWith("/") || member.nickname.charAt(0).startsWith(".")) { // I hate myself
                        /*
                        for(const a of member.user.username) {
                           int = a.length
                        }

                         */
                        member.setNickname('Z Hoisting bad')
                    }
                })
                msg.channel.send(`${int} users dehoisted.`)
                break;

            case 'list':
                / alksdnafkinasf
                break;
            default:
                let embed2 = new MessageEmbed()
                    .setColor('RANDOM')
                    .setDescription(`Dehoist usage example:\n\`\`\`dehoist [nick/username]\`\`\``)
                return msg.channel.send(embed2);
        }
    }
}