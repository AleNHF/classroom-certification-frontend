export interface EvaluationData {
    id: number;
    reviewDate: string;
    result: number;
    cycleId: number;
    areaId: number;
    classroom: {
        id: number;
        name: string;
        code: string;
        status: string;
        createdAt: string;
    };
    evaluatedIndicators: EvaluatedIndicator[];
}

export interface EvaluatedIndicator {
    id: number;
    result: number;
    observation: string;
    indicator: {
        id: number;
        name: string;
        area: {
            id: number;
            name: string;
        };
        content?: {
            id: number;
            name: string;
        };
        resource: {
            id: number;
            name: string;
            cycle: {
                id: number;
                name: string;
            };
        };
    };
}




