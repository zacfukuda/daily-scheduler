declare interface ScheduleCategory {
  id: number;
  name: string;
  fill: string;
  stroke: string;
}

declare interface Schedule {
  id?: number;
  title?: string;
  start: string;
  end: string;
  note?: string;
  category?: ScheduleCategory;
  category_id?: number;
  user_id?: number;
}

declare interface ScheduleItem {
  id?: number;
  start: number;
  end: number;
  category: ScheduleCategory;
  category_id: number;
}

declare interface ScheduleItemIndexable extends ScheduleItem {
  index: number;
}
