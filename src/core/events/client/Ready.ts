import { Event } from "../../Event";

export default class Ready extends Event {
    constructor (client) {
        super(client, {
            name: "ready",
            once: true
        });
    };
    async run () {
        console.log("Client is ready");
        ["Slash"].forEach((x) => {
            require("../../../handlers/" + x).default(this.client);
        });
        await this.client.user.setActivity({
            type: "PLAYING",
            name: "Members"
            
        })
    };
};