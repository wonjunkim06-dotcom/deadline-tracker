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
  const urgent = d <= 3 && !item.done;

  return (
    <li
      className={`flex items-center justify-between rounded-xl bg-white p-4 text-gray-900 shadow ${
        item.done ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={item.done}
          onChange={() => onToggle(item.id)}
          className="h-5 w-5"
        />
        <div>
          <p className="text-sm text-gray-500">
            {item.subject} · {item.type}
          </p>
          <p className={`font-semibold ${item.done ? "line-through" : ""}`}>
            {item.title}
          </p>
          <p className="text-sm text-gray-500">{item.dueDate}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={`text-xl font-bold ${
            urgent ? "text-red-600" : "text-blue-600"
          }`}
        >
          {formatDday(d)}
        </span>
        <button
          onClick={() => onDelete(item.id)}
          className="text-sm text-gray-400 hover:text-red-500"
        >
          삭제
        </button>
      </div>
    </li>
  );
}