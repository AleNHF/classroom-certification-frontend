import { Area, Form } from ".";

export interface Assessment {
    id?:           number;
    description?:  string;
    assessment?:   string;
    conclusions?:  string;
    requeriments?: Requeriment[];
    area?:         Area;
    form?:         Form;
}

export interface Requeriment {
    id?:         number;
    name?:       string;
    url?:        string;
}
