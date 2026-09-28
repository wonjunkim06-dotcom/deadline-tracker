import { Deadline } from "@/lib/types";
import { getDday, formatDday } from "@/lib/dday";

export default function DeadlineCard({ item }: { item: Deadline }) {
  const d = getDday(item.dueDate);
  const urgent = d <= 3;

  return (
    <li className="flex items-center justify-between rounded-xl bg-white p-4 text-gray-900 shadow">
      <div>
        <p className="text-sm text-gray-500">
          {item.subject} · {item.type}
        </p>
        <p className="font-semibold">{item.title}</p>
        <p className="text-sm text-gray-500">{item.dueDate}</p>
      </div>
      <span
        className={`text-xl font-bold ${urgent ? "text-red-600" : "text-blue-600"}`}
      >
        {formatDday(d)}
      </span>
    </li>
  );
}