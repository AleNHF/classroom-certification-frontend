import { Requeriment } from ".";

export interface AssessmentData {
    id?:           string;
    description?:  string;
    assessment?:   number;
    conclusions?:  string;
    areaId?:       number;
    formId?:       number;
    requeriments?: Requeriment[];
}