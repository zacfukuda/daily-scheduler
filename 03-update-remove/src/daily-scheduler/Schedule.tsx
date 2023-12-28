import { useEffect, useState, useRef } from "react";
import {
  getDragging,
  setDragPosition,
  dragStart,
  dragEnd,
  getStartAndEndOnSchedule,
  setHorizonOnEntry,
} from "./daily-scheduler-util";
import type { MouseEvent as ReactMouseEvent } from "react";

const cnScheduleFocus = "focused";

interface ScheduleProps extends ScheduleItemIndexable {
  updateSchedule(arg0: ScheduleItemIndexable): void;
  removeSchedule(arg0: number): void;
}

export default function Schedule({
  id,
  start,
  end,
  category,
  category_id,
  index,
  updateSchedule,
  removeSchedule,
}: ScheduleProps) {
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const style = {
    backgroundColor: category.fill,
    borderColor: category.stroke,
    left: start,
    width: end - start,
  };

  function isLeftSide(cx: number): boolean {
    return cx > left && cx < left + 10;
  }

  function isCenter(cx: number): boolean {
    return cx >= left + 10 && cx <= right - 10;
  }

  function isRightSide(cx: number): boolean {
    return cx > right - 10 && cx < right;
  }

  function handleKeyDown(e: KeyboardEvent): void {
    if (e.keyCode === 8 || e.key === "Backspace") {
      window.onkeydown = null;
      ref.current?.classList.remove(cnScheduleFocus);

      return removeSchedule(index);
    }
  }

  function focus(): void {
    const current = ref.current as HTMLDivElement;
    const parentNode = current.parentNode as HTMLDivElement;
    const nodes = parentNode.querySelectorAll("." + cnScheduleFocus);

    nodes.forEach((i) => i.classList.remove(cnScheduleFocus));
    current.classList.add(cnScheduleFocus);

    window.onkeydown = handleKeyDown;
  }

  function unfocus(): void {
    ref.current?.classList.remove(cnScheduleFocus);
    window.onkeydown = null;
  }

  function handleClick(): void {
    if (ref.current?.classList.contains(cnScheduleFocus)) {
      return unfocus();
    }

    focus();
  }

  function handleMouseDown({ clientX }: ReactMouseEvent): void {
    if (isLeftSide(clientX)) setDragPosition(1);
    else if (isRightSide(clientX)) setDragPosition(2);
    else return handleClick();

    dragStart(clientX);
    setHorizonOnEntry(clientX);
    document.body.style.cursor = "col-resize";
    window.addEventListener("mousemove", handleWindowMouseMove);
    window.addEventListener("mouseup", handleWindowMouseUp);
  }

  function handleMouseMove(e: ReactMouseEvent): void {
    if (getDragging()) return;

    const current = ref.current as HTMLDivElement;

    if (isCenter(e.clientX)) current.style.cursor = "";
    else current.style.cursor = "col-resize";
  }

  function handleWindowMouseUp(e: MouseEvent): void {
    const o = getStartAndEndOnSchedule(start, end, e.clientX);

    dragEnd();
    document.body.style.cursor = "";
    window.removeEventListener("mousemove", handleWindowMouseMove);
    window.removeEventListener("mouseup", handleWindowMouseUp);

    updateSchedule({
      id,
      start: o.start,
      end: o.end,
      category,
      category_id,
      index,
    });
  }

  function handleWindowMouseMove(e: MouseEvent): void {
    const o = getStartAndEndOnSchedule(start, end, e.clientX);
    const target = ref.current as HTMLDivElement;
    target.style.left = o.start + "px";
    target.style.width = o.end - o.start + "px";
  }

  useEffect(() => {
    const current = ref.current as HTMLDivElement;
    const { left, right } = current.getBoundingClientRect();
    setLeft(left);
    setRight(right);
  }, [start, end]);

  return (
    <div
      ref={ref}
      className="schedule-item"
      style={style}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
    ></div>
  );
}
