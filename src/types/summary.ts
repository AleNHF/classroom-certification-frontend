import { Form } from ".";

export interface Summary {
  data?:                 Datum[];
  totalWeight?:          number;
  totalWeightedAverage?: number;
}

export interface Datum {
  area?:            string;
  average?:         number;
  percentage?:      number;
  weight?:          number;
  weightedAverage?: number;
  form?:            Form;
  id?:              number;
}