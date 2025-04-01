import { Classroom } from ".";

export interface Form {
    id?:               number;
    name?:             string;
    server?:           string;
    completionDate?:   Date;
    lastRevisionDate?: Date;
    career?:           string;
    director?:         string;
    finalGrade?:       string;
    responsible?:      string;
    author?:           string;
    classroom?:        Classroom;
}

