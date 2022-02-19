import { Service } from "../services/Service";
import { Discord } from "../structures/Client";

export class Event {
    public client: Discord;
    public name: string;
    public once?: boolean;
    public service: Service;

    constructor (client: Discord, opt: EventOpt) {
        this.client = client;
        this.name = opt.name;
        this.once = opt.once;
        this.service = new Service(client);
    };

    run (...args) {
        return;
    };
};

interface EventOpt {
    name: string;
    once?: boolean;
};