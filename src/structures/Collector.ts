import { ButtonInteraction, Channel, Message, User } from "discord.js";

export function collectLongButton(channel: Channel, message: Message) {
}

export function filter(b: ButtonInteraction, memberid: string) {
    return memberid === b.user.id
}