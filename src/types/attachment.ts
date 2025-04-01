export interface Attachment {
  url?:       string;
  version?:   string;
  type?:      string;
  classroom?: Classroom;
  id?:        number;
  createdAt?: Date;
}

export interface Classroom {
  id?: number;
}