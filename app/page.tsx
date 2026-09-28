import DeadlineCard from "@/components/DeadlineCard";
import { Deadline } from "@/lib/types";

const deadlines: Deadline[] = [
  { id: "1", subject: "자료구조", title: "과제 2 제출", dueDate: "2026-09-30", type: "과제", done: false },
  { id: "2", subject: "미적분학", title: "중간고사", dueDate: "2026-10-15", type: "시험", done: false },
  { id: "3", subject: "글쓰기", title: "에세이 초안", dueDate: "2026-10-05", type: "과제", done: false },
];

export default function Home() {
  const sorted = [...deadlines].sort((a, b) =>
    a.dueDate.localeCompare(b.dueDate)
  );

  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="text-2xl font-bold">마감 알리미</h1>
      <p className="mt-2 text-gray-400">
        과제와 시험 마감, 더 이상 깜빡하지 마세요.
      </p>
      <ul className="mt-6 space-y-3">
        {sorted.map((item) => (
          <DeadlineCard key={item.id} item={item} />
        ))}
      </ul>
    </main>
  );
}