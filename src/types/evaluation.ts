import { Area, Classroom, Cycle } from ".";

export interface Evaluation {
    id?:         number;
    reviewDate?: Date;
    result?:     number;
    classroom?:  Classroom;
    cycle?:     Cycle;
    area?:      Area
}
