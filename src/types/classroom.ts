import { Team } from ".";
import { ClassroomStatus } from "../utils/enums/classroomStatus";

export interface Classroom {
    id?:            number;
    name:           string;
    code:           string;
    status:         ClassroomStatus;
    moodleCourseId: number;
    teamId?:        number;
    team?:          Team | null;
}