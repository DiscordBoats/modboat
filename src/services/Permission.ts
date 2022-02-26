import { Interaction, Message, PermissionString } from "discord.js";

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
};