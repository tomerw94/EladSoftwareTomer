import { Pipe, PipeTransform } from "@angular/core";
import { Policy } from "../models/policy";

@Pipe({ name: 'policies' })
export class PoliciesPipe implements PipeTransform {
    transform(value: Policy[]): string {
        if (!value) return "";
        if (value.length == 1) return value[0].policyNumber;
        if (value.length == 0) return "No Policies";
        return value[0].policyNumber + ` (+${value.length - 1} more)`;
    }
}