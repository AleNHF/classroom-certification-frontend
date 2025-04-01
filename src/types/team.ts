import { Personal } from ".";

export interface Team {
    id?:         string;
    name:       string;
    management: string;
    faculty:    string;
    personal:   number[];
    personals?:  Personal[];
}
