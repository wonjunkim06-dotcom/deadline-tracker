"use client";

import { useEffect, useState } from "react";
import DeadlineCard from "@/components/DeadlineCard";
import { Deadline } from "@/lib/types";
import { getDday } from "@/lib/dday";

const STORAGE_KEY = "deadlines";

function dateAfter(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const QUICK_DATES = [
  { label: "오늘", days: 0 },
  { label: "내일", days: 1 },
  { label: "다음 주", days: 7 },
];

export default function Home() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDone, setShowDone] = useState(false);
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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const canSubmit = title.trim() !== "" && dueDate !== "";

  function resetForm() {
    setSubject("");
    setTitle("");
    setDueDate("");
    setType("과제");
  }

  function openAdd() {
    resetForm();
    setEditingId(null);
    setOpen(true);
  }

  function openEdit(item: Deadline) {
    setEditingId(item.id);
    setSubject(item.subject === "기타" ? "" : item.subject);
    setTitle(item.title);
    setDueDate(item.dueDate);
    setType(item.type);
    setOpen(true);
  }

  function handleSave() {
    if (!canSubmit) return;
    if (editingId) {
      setDeadlines(
        deadlines.map((d) =>
          d.id === editingId
            ? {
                ...d,
                subject: subject.trim() || "기타",
                title: title.trim(),
                dueDate,
                type,
              }
            : d
        )
      );
    } else {
      const newItem: Deadline = {
        id: crypto.randomUUID(),
        subject: subject.trim() || "기타",
        title: title.trim(),
        dueDate,
        type,
        done: false,
      };
      setDeadlines([...deadlines, newItem]);
    }
    setOpen(false);
    setEditingId(null);
    resetForm();
  }

  function handleDelete() {
    if (!editingId) return;
    if (!window.confirm("이 마감을 삭제할까요?")) return;
    setDeadlines(deadlines.filter((d) => d.id !== editingId));
    setOpen(false);
    setEditingId(null);
    resetForm();
  }

  function handleToggle(id: string) {
    setDeadlines(
      deadlines.map((d) => (d.id === id ? { ...d, done: !d.done } : d))
    );
  }

  const byDate = (a: Deadline, b: Deadline) =>
    a.dueDate.localeCompare(b.dueDate);

  const active = deadlines.filter((d) => !d.done).sort(byDate);
  const done = deadlines.filter((d) => d.done).sort(byDate);

  const overdue = active.filter((d) => getDday(d.dueDate) < 0);
  const today = active.filter((d) => getDday(d.dueDate) === 0);
  const week = active.filter((d) => {
    const n = getDday(d.dueDate);
    return n >= 1 && n <= 7;
  });
  const later = active.filter((d) => getDday(d.dueDate) > 7);

  const sections = [
    { key: "overdue", label: "기한 지남", items: overdue, tone: "text-red-600" },
    { key: "today", label: "오늘", items: today, tone: "text-slate-900" },
    { key: "week", label: "이번 주", items: week, tone: "text-slate-900" },
    { key: "later", label: "이후", items: later, tone: "text-slate-900" },
  ];

  const parts: string[] = [];
  if (overdue.length) parts.push(`기한 지남 ${overdue.length}개`);
  if (today.length) parts.push(`오늘 ${today.length}개`);
  if (week.length) parts.push(`이번 주 ${week.length}개`);

  let summary = "과제와 시험 마감, 더 이상 깜빡하지 마세요.";
  if (loaded && deadlines.length > 0) {
    if (active.length === 0) summary = "모든 마감을 끝냈어요 🎉";
    else if (parts.length > 0) summary = parts.join(" · ");
    else summary = `남은 마감 ${later.length}개`;
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none";

  return (
    <main className="mx-auto max-w-xl px-5 py-10">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">마감 알리미</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">{summary}</p>
        </div>
        <button
          onClick={openAdd}
          className="shrink-0 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
        >
          + 마감 추가
        </button>
      </header>

      {sections
        .filter((s) => s.items.length > 0)
        .map((s) => (
          <section key={s.key} className="mt-8">
            <h2 className={`mb-3 text-sm font-bold ${s.tone}`}>
              {s.label}{" "}
              <span className="font-medium text-slate-400">{s.items.length}</span>
            </h2>
            <ul className="space-y-3">
              {s.items.map((item) => (
                <DeadlineCard
                  key={item.id}
                  item={item}
                  onToggle={handleToggle}
                  onEdit={openEdit}
                />
              ))}
            </ul>
          </section>
        ))}

      {done.length > 0 && (
        <section className="mt-8">
          <button
            onClick={() => setShowDone(!showDone)}
            className="text-sm font-bold text-slate-500 hover:text-slate-700"
          >
            {showDone ? "▾" : "▸"} 완료 {done.length}개
          </button>
          {showDone && (
            <ul className="mt-3 space-y-3">
              {done.map((item) => (
                <DeadlineCard
                  key={item.id}
                  item={item}
                  onToggle={handleToggle}
                  onEdit={openEdit}
                />
              ))}
            </ul>
          )}
        </section>
      )}

      {loaded && deadlines.length === 0 && (
        <div className="mt-16 text-center">
          <p className="text-4xl">🗓</p>
          <p className="mt-4 text-lg font-bold text-slate-900">
            아직 등록한 마감이 없어요
          </p>
          <p className="mt-1 text-sm text-slate-500">
            과제나 시험 마감일을 넣으면
            <br />
            D-day로 알려드릴게요.
          </p>
          <button
            onClick={openAdd}
            className="mt-6 rounded-full bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500"
          >
            첫 마감 추가하기
          </button>
        </div>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-t-3xl bg-white p-6 shadow-xl sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                {editingId ? "마감 수정" : "새 마감"}
              </h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="닫기"
                className="text-xl text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-5">
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  제목 *
                </label>
                <input
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  placeholder="예: 과제 2 제출"
                  className={`mt-2 ${inputClass}`}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  날짜 *
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {QUICK_DATES.map((q) => {
                    const value = dateAfter(q.days);
                    const selected = dueDate === value;
                    return (
                      <button
                        key={q.label}
                        type="button"
                        onClick={() => setDueDate(value)}
                        className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
                          selected
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {q.label}
                      </button>
                    );
                  })}
                </div>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={`mt-2 ${inputClass}`}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  종류
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {(["과제", "시험"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`rounded-lg border py-2 text-sm font-semibold ${
                        type === t
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  과목{" "}
                  <span className="font-normal text-slate-400">(선택)</span>
                </label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="예: 자료구조"
                  className={`mt-2 ${inputClass}`}
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={!canSubmit}
              className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {editingId ? "저장하기" : "추가하기"}
            </button>

            {editingId && (
              <button
                onClick={handleDelete}
                className="mt-3 w-full py-2 text-sm font-medium text-red-500 hover:text-red-600"
              >
                삭제하기
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}