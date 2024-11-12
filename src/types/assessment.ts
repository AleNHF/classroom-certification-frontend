import { Area, Form, Requeriment } from ".";

export interface Assessment {
    id?:           number;
    description?:  string;
    assessment?:   string;
    conclusions?:  string;
    requeriments?: Requeriment[];
    area?:         Area;
    form?:         Form;
}
