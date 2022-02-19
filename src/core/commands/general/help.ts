import { Command } from "../../Command";

export default class Help extends Command {
    constructor (client) {
        super(client, {
            name: "help",
            description: "gfsg"
        })
    }
};