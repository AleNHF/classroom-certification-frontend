export interface Requeriment {
    id?:           string;
    name?:         string;
    url?:          string;
    assessmentId?: number;
    originalFileName?: string;
    file?: File | null;
}