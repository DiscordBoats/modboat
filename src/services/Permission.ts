import { Interaction, Message, PermissionString } from "discord.js";
import Schema from "../models/guild";

export class Permission {

    constructor() {
    };

    checkMember(object: Message | Interaction, permission: PermissionString, reply?: boolean): boolean {

        let hasPermission = true;

        if (!object.member["permissions"]["has"](permission)) {
            hasPermission = false;
        };

        if (!hasPermission && reply === true) {

            object["reply"]({
                content: `> Missing Permission \`${permission}\`. :x:`
            }).catch(() => {
                return;
            });
            
        };

        return hasPermission;
    };

    checkBot (object: Message | Interaction, permission: PermissionString, reply?: boolean): boolean {
        let hasPermission = true;

        if (!object.guild.me["permissions"]["has"](permission)) {
            hasPermission = false;
        };

        if (!hasPermission && reply === true) {

            object["reply"]({
                content: `> I'm missing permission \`${permission}\`. :x:`
            }).catch(() => {
                return;
            });
            
        };

        return hasPermission;
    };

    async checkForModeratorRole(object: Message, permission: PermissionString, reply?: boolean): Promise<boolean> {
        const data = await Schema.findOne({ Guild: object.guild.id })

        if (data.Moderatorrole === false) {
            return this.checkMember(object, permission, reply);
        };

        if (data.Moderatorroles === []) {
            return this.checkMember(object, permission);
        } 
        let hasPermission = true;
        const roleData = data.Moderatorroles;
        for (let i = 0; i < roleData.length; i++) {
            if (!object.member.roles.cache.has(roleData[i])) {
                hasPermission = false;
            }
            if (!hasPermission && reply === true) {

                object["reply"]({
                    content: `> Missing Role \`moderator role\`. :x:`
                }).catch(() => {
                    return;
                });

            }
            ;

            return hasPermission;
        }
    };
};