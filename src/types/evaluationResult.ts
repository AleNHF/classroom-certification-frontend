export interface EvaluationResult {
  evaluationId?:             number;
  totalResources?:           number;
  matchedResources?:         number;
  unmatchedResources?:       number;
  evaluatedIndicatorsCount?: number;
  resourceDetails?:          ResourceDetail[];
  summary?:                  Summary;
}

export interface ResourceDetail {
  resourceId?:        number;
  resourceName?:      string;
  indicatorsMatched?: number;
  indicatorsResult?:  Array<IndicatorsResult[]>;
}

export interface IndicatorsResult {
  indicatorId?: number;
  result?:      number;
  observation?: string;
}

export interface Summary {
  averageComplianceResult?: number;
}
