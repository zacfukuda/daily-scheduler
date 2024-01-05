const LEFT = 1;
const RIGHT = 2;
const DEFAULT_HOUR_START = 0;

let hour1 = 0;
let hour2 = 0;

let step = 2;

let date1: Date;
let date2: Date;
let date1String: string;
let date2String: string;

let dragging: boolean;

let o: number;
let x1: number | null;

let schedules: ScheduleItem[];
let trash: number[] = [];

let dragPosition: 1 | 2 | null;
let guides: number[];
let datetimes: string[];

let hours: number[];

let minX: number | null;
let maxX: number | null;

export function init(dateString: string, hour: number): void {
  setHours(hour);
  setDate(dateString);
  setDatetimes();
  emptyTrash();
}

export function setHours(hour: number): void {
  hour1 = hour2 = hour | DEFAULT_HOUR_START;

  const diff = 24 - hour1;
  const length = diff + hour2 + 1;
  let t = hour1;
  let i: number;
  hours = new Array(length);

  function appendHour(): void {
    hours[i] = t;
    t++;
  }

  for (i = 0; i < diff; i++) appendHour();

  t = 0;

  for (; i < length; i++) appendHour();
}

export function setDate(dateString: string): void {
  date1 = new Date(dateString);
  date2 = new Date(date1.getTime() + 86400000); // 1000 * 3600 * 24
  date1String = date1.toISOString().substring(0, 10);
  date2String = date2.toISOString().substring(0, 10);
}

export function setDatetimes(): void {
  const length = hours.length * step - step + 1;
  const hoursLastIndex: number = hours.length - 1;
  let i: number = 0;
  let j: number;
  let k: number;
  let d: Date;

  datetimes = new Array(length);

  function createDateTimeString(dateString: string) {
    return dateString + " " + d.toISOString().substring(11, 19);
  }

  function fillStep(dateString: string) {
    d = new Date(3600000 * (hours[i] + k / step));
    datetimes[j + k] = createDateTimeString(dateString);
  }

  function fillHour(dateString: string) {
    j = i * step;

    for (k = 0; k < step; k++) fillStep(dateString);
  }

  fillHour(date1String);

  for (i = 1; hours[i] !== 0; i++) fillHour(date1String);
  for (; i < hoursLastIndex; i++) fillHour(date2String);

  j = i * step;
  k = 0;

  fillStep(date2String);
}

export function emptyTrash(): void {
  trash = [];
}

export function getHours(): number[] {
  return hours;
}

export function setO(x: number): void {
  o = x;
}

export function setGuides(element: HTMLDivElement): void {
  const length: number = hours.length * step - step + 1;
  const hoursLastIndex: number = hours.length - 1;
  const lines: NodeListOf<HTMLSpanElement> =
    element.querySelectorAll(".guideline");
  let i: number, j: number, k: number;
  let x: number, diff: number;

  guides = new Array(length);

  if (step === 1) {
    for (let i = 0; i < length; i++) guides[i] = lines[i].offsetLeft;

    return;
  }

  function fillStep() {
    guides[j + k] = x + Math.round((diff * k) / step);
  }

  function fillInHour() {
    j = i * step;
    x = lines[i].offsetLeft;
    diff = lines[i + 1].offsetLeft - x;

    for (k = 0; k < step; k++) fillStep();
  }

  for (i = 0; i < hoursLastIndex; i++) fillInHour();

  guides[length - 1] = lines[hoursLastIndex].offsetLeft;
}

export function dragStart(x: number): void {
  setDragging(true);
  setX1(x);
}

export function dragEnd(): void {
  setDragging(false);
  setX1(null);
  setDragPosition(null);
  clearHorizon();
}

export function setDragging(boo: boolean): void {
  dragging = boo;
}

export function setX1(x: number | null): void {
  if (x === null) {
    x1 = null;

    return;
  }

  x1 = o + snapToGuide(x - o);
}

export function snapToGuide(x: number): number {
  let i = 0;
  let diff1 = Math.abs(x - guides[0]);
  let diff2 = Math.abs(x - guides[1]);

  while (diff1 > diff2) {
    i++;
    diff1 = diff2;
    diff2 = Math.abs(x - guides[i + 1]);
  }

  return guides[i];
}

export function setDragPosition(n: 1 | 2 | null): void {
  dragPosition = n;
}

function clearHorizon(): void {
  minX = null;
  maxX = null;
}

export function getStartAndEndOnGrid(x2: number): {
  start: number;
  end: number;
} {
  x1 = x1 as number;
  x2 = o + snapToGuide(x2 - o);

  let start: number;
  let end: number;
  const dx = x2 - x1;

  if (dx > 0) {
    start = x1 - o;
    end = Math.min(x2 - o, maxX as number);
  } else {
    start = Math.max(x2 - o, minX as number);
    end = x1 - o;
  }

  return { start, end };
}

export function canAddSchedule(x: number): boolean {
  let boo = true;

  if (schedules.length === 0) return boo;

  const start = x - o;

  for (let i = 0; i < schedules.length; i++) {
    if (start >= schedules[i].start && start <= schedules[i].end) {
      boo = false;
      break;
    }
  }

  return boo;
}

export function setHorizonOnGrid(x: number): void {
  minX = 0;
  maxX = guides[guides.length - 1];

  if (schedules === null || schedules.length === 0) return;

  const start = x - o;

  for (let i = 0; i < schedules.length; i++) {
    if (start >= schedules[i].end && minX <= schedules[i].end)
      minX = schedules[i].end;
    if (start <= schedules[i].start && maxX >= schedules[i].start)
      maxX = schedules[i].start;
  }
}

export function joinSchedules(ss: ScheduleItem[]): ScheduleItem[] {
  for (let i = ss.length - 1; i > 0; i--) {
    const s1 = ss[i];

    for (let j = i - 1; j > -1; j--) {
      const s2 = ss[j];

      if (s1.category_id !== s2.category_id) continue;
      if (s1.end === s2.start) {
        ss[j].start = s1.start;
        addTrash(s1);
        ss.pop();
        break;
      } else if (s1.start === s2.end) {
        ss[j].end = s1.end;
        addTrash(s1);
        ss.pop();
        break;
      }
    }
  }

  return ss;
}

export function addTrash(schedule: ScheduleItem): void {
  if (!schedule.id) return;

  trash.push(schedule.id);
}

export function updateSchedules(ss: ScheduleItem[]): void {
  if (ss.length === 0) {
    schedules = [];

    return;
  }

  schedules = ss;
}

export function getSchedules(): Schedule[] {
  const length = schedules.length;

  if (length === 0) return [];

  let s: ScheduleItem;
  const ss: Schedule[] = new Array(length);

  function findIndexStart(guidelineX: number) {
    return guidelineX === s.start;
  }

  function findIndexEnd(guidelineX: number) {
    return guidelineX === s.end;
  }

  for (let i = 0; i < length; i++) {
    s = schedules[i];
    const index1 = guides.findIndex(findIndexStart);
    const index2 = guides.findIndex(findIndexEnd);
    const start = datetimes[index1];
    const end = datetimes[index2];
    ss[i] = { ...s, start, end };
    delete ss[i].category;
  }

  return ss;
}

export function getTrash(): number[] {
  return trash;
}
