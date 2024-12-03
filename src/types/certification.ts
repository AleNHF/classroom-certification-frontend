import { Classroom } from ".";

export interface Certification {
  career?:        string;
  contentAuthor?: string;
  faculty?:       string;
  evaluatorName?: string;
  plan?:          string;
  modality?:      string;
  teacher?:       string;
  teacherCode?:   string;
  classroom?:     Classroom;
  authorities?:   Authority[];
  updatedAt?:     Date;
  id?:            number;
  createdAt?:     Date;
}

export interface Authority {
  id?:        number;
  name?:      string;
  position?:  string;
  signature?: string;
}