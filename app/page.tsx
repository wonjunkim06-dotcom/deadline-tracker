"use client";

import { useEffect, useState } from "react";
import DeadlineCard from "@/components/DeadlineCard";
import { Deadline } from "@/lib/types";
import { getDday } from "@/lib/dday";

const STORAGE_KEY = "deadlines";

export default function Home() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [type, setType] = useState<"과제" | "시험">("과제");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setDeadlines(JSON.parse(saved));
    setLoaded(true);
  }, []);

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

  const sorted = [...deadlines].sort(
    (a, b) =>
      Number(a.done) - Number(b.done) || a.dueDate.localeCompare(b.dueDate)
  );

  const active = deadlines.filter((d) => !d.done);
  const todayCount = active.filter((d) => getDday(d.dueDate) === 0).length;
  const weekCount = active.filter((d) => {
    const n = getDday(d.dueDate);
    return n >= 0 && n <= 7;
  }).length;

  const inputClass =
    "rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none";

  return (
    <main className="mx-auto max-w-xl px-5 py-10">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900">마감 알리미</h1>
        <p className="mt-2 text-sm font-medium text-slate-500">
          {loaded && active.length > 0
            ? `오늘 ${todayCount}개 · 이번 주 ${weekCount}개 남았어요`
            : "과제와 시험 마감, 더 이상 깜빡하지 마세요."}
        </p>
      </header>

      <div className="mt-6 space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex gap-2">
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="과목"
            className={`w-1/3 ${inputClass}`}
          />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목 (예: 과제 2 제출)"
            className={`w-2/3 ${inputClass}`}
          />
        </div>
        <div className="flex gap-2">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={`flex-1 ${inputClass}`}
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "과제" | "시험")}
            className={inputClass}
          >
            <option value="과제">과제</option>
            <option value="시험">시험</option>
          </select>
          <button
            onClick={handleAdd}
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-500"
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
        <div className="mt-12 text-center">
          <p className="text-4xl">🗓</p>
          <p className="mt-4 text-lg font-bold text-slate-900">
            아직 등록한 마감이 없어요
          </p>
          <p className="mt-1 text-sm text-slate-500">
            위에서 과제나 시험 마감일을 넣으면
            <br />
            D-day로 알려드릴게요.
          </p>
        </div>
      )}
    </main>
  );
}