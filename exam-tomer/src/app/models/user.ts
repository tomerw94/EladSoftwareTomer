import { Policy } from "./policy";

export class User {
    id: number;
    name: string;
    email: string;
    policies: Policy[];
    constructor(init?: Partial<User>) {
        Object.assign(this, init);
        if (!this.policies) {
            this.policies = [];
        }
    }
}