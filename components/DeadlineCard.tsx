"use client";

import { Deadline } from "@/lib/types";
import { getDday, formatDday } from "@/lib/dday";

type Props = {
  item: Deadline;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function DeadlineCard({ item, onToggle, onDelete }: Props) {
  const d = getDday(item.dueDate);
  const overdue = d < 0 && !item.done;
  const urgent = d <= 3 && !item.done;

  const ddayColor = item.done
    ? "text-slate-400"
    : urgent
    ? "text-red-600"
    : "text-blue-600";

  return (
    <li
      className={`flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${
        item.done ? "opacity-60" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={item.done}
        onChange={() => onToggle(item.id)}
        aria-label="완료 체크"
        className="h-5 w-5 shrink-0 accent-blue-600"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium">
            {item.subject}
          </span>
          <span>{item.type}</span>
        </div>
        <p
          className={`mt-1 truncate text-base font-semibold text-slate-900 ${
            item.done ? "line-through" : ""
          }`}
        >
          {item.title}
        </p>
        <p className="text-sm text-slate-500">{item.dueDate}</p>
      </div>

      <div className="flex flex-col items-end gap-1">
        <span className={`text-2xl font-extrabold ${ddayColor}`}>
          {formatDday(d)}
        </span>
        {overdue && (
          <span className="text-xs font-medium text-red-600">기한 지남</span>
        )}
        <button
          onClick={() => onDelete(item.id)}
          className="text-xs text-slate-400 hover:text-red-500"
        >
          삭제
        </button>
      </div>
    </li>
  );
}