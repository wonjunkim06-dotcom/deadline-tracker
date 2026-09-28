"use client";

import { useEffect, useState } from "react";
import DeadlineCard from "@/components/DeadlineCard";
import { Deadline } from "@/lib/types";

const STORAGE_KEY = "deadlines";

export default function Home() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [type, setType] = useState<"과제" | "시험">("과제");

  // 처음 열 때 저장된 데이터 불러오기
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setDeadlines(JSON.parse(saved));
    setLoaded(true);
  }, []);

  // 데이터가 바뀔 때마다 저장
  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(deadlines));
  }, [deadlines, loaded]);

  function handleAdd() {
    if (!title.trim() || !dueDate) return;
    const newItem: Deadline = {
      id: crypto.randomUUID(),
      subject: subject.trim() || "기타",
      title: title.trim(),
      dueDate,
      type,
      done: false,
    };
    setDeadlines([...deadlines, newItem]);
    setSubject("");
    setTitle("");
    setDueDate("");
  }

  function handleToggle(id: string) {
    setDeadlines(
      deadlines.map((d) => (d.id === id ? { ...d, done: !d.done } : d))
    );
  }

  function handleDelete(id: string) {
    setDeadlines(deadlines.filter((d) => d.id !== id));
  }

  // 미완료 먼저, 그다음 마감이 가까운 순
  const sorted = [...deadlines].sort(
    (a, b) =>
      Number(a.done) - Number(b.done) || a.dueDate.localeCompare(b.dueDate)
  );

  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="text-2xl font-bold">마감 알리미</h1>
      <p className="mt-2 text-gray-400">
        과제와 시험 마감, 더 이상 깜빡하지 마세요.
      </p>

      <div className="mt-6 space-y-2 rounded-xl bg-gray-800 p-4">
        <div className="flex gap-2">
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="과목"
            className="w-1/3 rounded bg-white p-2 text-gray-900"
          />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목 (예: 과제 2 제출)"
            className="w-2/3 rounded bg-white p-2 text-gray-900"
          />
        </div>
        <div className="flex gap-2">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="flex-1 rounded bg-white p-2 text-gray-900"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "과제" | "시험")}
            className="rounded bg-white p-2 text-gray-900"
          >
            <option value="과제">과제</option>
            <option value="시험">시험</option>
          </select>
          <button
            onClick={handleAdd}
            className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500"
          >
            추가
          </button>
        </div>
      </div>

      <ul className="mt-6 space-y-3">
        {sorted.map((item) => (
          <DeadlineCard
            key={item.id}
            item={item}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </ul>

      {loaded && sorted.length === 0 && (
        <p className="mt-6 text-center text-gray-500">
          아직 마감이 없어요. 위에서 추가해보세요!
        </p>
      )}
    </main>
  );
}