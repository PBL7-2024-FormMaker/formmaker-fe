export interface Interval {
  from: string;
  to: string;
}

export interface IntervalDate {
  intervalList: Interval[];
  listDate: number[];
}

export interface AppointmentSettings {
  intervalDateList: IntervalDate[];
  slotDuration: number;
}
