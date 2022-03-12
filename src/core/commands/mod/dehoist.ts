import { Message, MessageEmbed } from "discord.js";
import { Command } from "../../Command";
import {inspect} from "util";


export default class Dehoist extends Command {
    constructor (client) {
        super (client, {
            name: "dehoist",
            description: "Eval code",
        });
    };

    async run (message: Message, args: string[]) {
        const filter = (map, pred) => {
            const result = new Map();
            for (let [k, v] of map) {
                if (pred(k, v)) {
                    result.set(k, v);
                }
            }
            return result;
        }

        switch(args[0]) {
            case "user":
                const user = await message.guild.members.fetch(args[1]);

                if (!user) {
                    return message.channel.send("User not found");
                }

                user.setNickname(user.user.username.replace(/[^a-zA-Z0-9\s\w]/g, " ")).catch(e => {
                    return
                })

                return message.channel.send(`Dehoisted ${user.nickname} (${user.user.tag} | ${user.id})`);
                break;
            case "list":
                let list = '';
                (await message.guild.members.fetch()).forEach(member => {
                    if(/[^a-zA-Z0-9\s\w]/g.test(member.user.username) || /[^a-zA-Z0-9\s\w]/g.test(member.nickname)) {
                        list += `${member.user.username}#${member.user.discriminator} (${member.user.id}) \`Bot: ${member.user.bot}\`\n`;
                    }
                });

                if (list === '') {
                    return message.channel.send('No users found.');
                }

                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setTitle("Dehoist List")
                            .setDescription(list.substring(0, 4096))
                            .setColor("#00ff00")
                    ]
                })
                break;
            default:
                // @ts-ignore
                const array = []; // eslint-disable-line

                (await message.guild.members.fetch()).forEach(member => {
                    // @ts-ignore

                    if(/[^a-zA-Z0-9\s\w]/g.test(member.user.username) || /[^a-zA-Z0-9\s\w]/g.test(member.nickname)) {

                            array.push(member.user.id)
                            member.setNickname(member.user.username.replace(/[^a-zA-Z0-9\s\w]/g, " ")).catch(e => {
                                return
                            })

                    }


                })
                return message.channel.send("Dehoisted " + array.length + " member(s)")
            break
        }

    };
};
