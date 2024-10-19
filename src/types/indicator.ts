export interface Content {
    id: number;
    name: string;
}

export interface Resource {
    id: number;
    name: string;
    contents: Content[];
    cycle?: Cycle;
}

export interface Cycle {
    id: number;
    name: string;
    resources: Resource[];
}

export interface Indicator {
    id: number;
    name: string;
    area: string;
    resource: Resource;
    content: Content | null;
}