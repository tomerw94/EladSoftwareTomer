export class Policy {
    id: number;
    policyNumber: string;
    amount: number;
    start: Date;
    end: Date;
    userId: number;
    constructor(init?: Partial<Policy>) {
        Object.assign(this, init);
    }
}