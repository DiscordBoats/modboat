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

        const members = filter(await message.guild.members.fetch(), (_k, v) => v.user.username.charAt(0) === "!" || v.user.username.charAt(0) === "-");
        if(members.size < 0) {
            return message.channel.send("No members found");
        }

        let array = Array.from(members.keys());
        members.forEach(member => {
            member.setNickname(member.user.username.slice(1));

        })
        message.channel.send("Dehoisted " +array.length+ " member(s)!")
    };
};
