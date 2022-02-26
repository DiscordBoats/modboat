import { Discord } from "./Client";
import fetch from "node-fetch";

export class API {
    public client: Discord;
    private api: string;

    constructor(client: Discord) {
        this.api = process.env.API_URL;
    };

    async make(opt: RequestOptions): Promise<any> {

        const request = {
            method: opt.method,
            headers: {
                "Content-Type": "application/json"
            }
        };

        const data = (opt.data) ? JSON.stringify(opt.data) : {};

        if (opt.method !== "GET") {
            if (opt.method !== "DELETE") {
                request["body"] = data;
            };
        };

        return new Promise(async (resolve, reject) => {
            return fetch(this.api + opt.endpoint, request).then((x) => {
                x.json().then((res) => {
                    return resolve(res);
                }).catch(() => {
                    resolve(null);
                });
            });
        });
    };
};

interface RequestOptions {
    method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
    endpoint: string;
    data?: any;
};