import { API } from "../API";
import { Discord } from "../Client";
import { Get, Update, Create, Delete } from "./classes";

export class Database {
    public get: Get;
    public update: Update;
    public create: Create;
    public delete: Delete;

    constructor(client: Discord) {
        this.get = new Get(client);
        this.update = new Update(client);
        this.create = new Create(client);
        this.delete = new Delete(client);
    };
};