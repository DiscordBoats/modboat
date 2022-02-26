import {Event} from "../../../Event";
import {GuildMember, Message} from "discord.js";
import Schema from "../../../../models/guild";

export default class AutoRole extends Event {
    constructor(client) {
        super(client, {
            name: "guildMemberAdd",
            once: false
        });
    };
    async run(member: GuildMember) {
        if (!member.guild.me.permissions.has('MANAGE_ROLES')) {
            return;
        }
        const data = await Schema.findOne({ Guild: member.guild.id });
        if (!data || data.Autorole) {
            return;
        }

        if (data.Autorole === false) {
            return;
        }

        if (data.Autoroles === []) {
            return;
        }
        
        const r = data.Autoroles;
        for (let i = 0; i < r.length; i++) {
            const checkrole = member.guild.roles.cache.get(data.Autoroles[i]);
            if (checkrole.editable == false) {
                return;
            };
            await member.roles.add(data.Autoroles[i]).catch(err => {return;})
        }

    }

}