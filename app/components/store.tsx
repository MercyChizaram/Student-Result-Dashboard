"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Assignment =
  {
    id: string;
    title: string;
    details: string;
    submittedAt: string;
    score?: number;
    feedback?: string
  };

export type Student =
  {
    id: string;
    name: string;
    role: "student";
    course: string;
    loginCredentials: { username: string; password: string };
    assignments: Assignment[]; scores: number[]
  };

export type User =
  {
    id: string;
    name: string;
    role: "admin" | "student";
    loginCredentials: { username: string; password: string }
  };

type Store =
  {
    admin: User;
    students: Student[]
  };

type ContextValue =
  {
    ready: boolean;
    data: Store | null;
    user: User | null;
    login: (username: string, password: string) => User | null;
    logout: () => void;
    submit: (title: string, details: string) => void;
    grade: (studentId: string, assignmentId: string, score: number, feedback: string) => void
  };

const KEY = "student-result-dashboard-v1";

const admin: User =
{
  id: "admin-1",
  name: "Staff",
  role: "admin",
  loginCredentials: { username: "Staff", password: "admin123" }
};
const names =
  [
    "Daniel Okafor",
    "Charles Mensah",
    "Mercy Adeyemi",
    "John Bello",
    "David Eze",
    "Amara Nwosu",
    "Ibrahim Musa",
    "Grace Akinyemi",
    "Peter Obi",
    "Fatima Sule",
    "Samuel James"
  ];

function initialData(): Store
{
  return {
    admin, students: names.map((name, i) => ({
      id: `student-${i + 1}`,
      name, role: "student" as const,
      course: ["JavaScript", "React", "TypeScript", "Next.js", "Tailwind CSS"][i % 5],
      loginCredentials: { username: name, password: "student123" }, assignments: [], scores: []
    }))
  };
}
const Ctx = createContext<ContextValue | null>(null);
export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Store | null>(null);
  const [user, setUser] = useState<User | null>(null); const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      try {
        const raw = localStorage.getItem(KEY);
        const saved = raw ? JSON.parse(raw) as Store : initialData();
        saved.admin = { ...saved.admin, name: "Staff", loginCredentials: { username: "Staff", password: "admin123" } };
        saved.students = saved.students.map(s => ({
          ...s, role: "student" as const,
          loginCredentials: { username: s.name, password: "student123" }
        }));
        localStorage.setItem(KEY, JSON.stringify(saved));
        setData(saved);
        const session = localStorage.getItem(`${KEY}:session`);
        if (session) {
          const parsed = JSON.parse(session) as User;
          if (parsed.role === "admin") setUser(saved.admin);
          else setUser(saved.students.find(s => s.id === parsed.id) ?? null);
        }
      } catch {
        const seeded = initialData();
        localStorage.setItem(KEY, JSON.stringify(seeded));
        setData(seeded);
      }
      setReady(true);
    });
    return () => { cancelled = true; };
  }, []); const persist = useCallback((next: Store) => {
    setData(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }, []);
  const login =
    useCallback((username: string, password: string) => {
      if (!data) return null;
      const normalizedName = username.trim().toLocaleLowerCase();
      const found = data.admin.name.toLocaleLowerCase() === normalizedName && data.admin.loginCredentials.password === password ? data.admin : data.students.find(s => s.name.toLocaleLowerCase() === normalizedName && s.loginCredentials.password === password);
      if (found) {
        setUser(found); localStorage.setItem(`${KEY}:session`,
          JSON.stringify({ id: found.id, name: found.name, role: found.role }));
      } return found ?? null;
    }, [data]);
  const logout = useCallback(() => { setUser(null); localStorage.removeItem(`${KEY}:session`); }, []);
  const submit = useCallback((title: string, details: string) => {
    if (!data || !user || user.role === "admin") return;
    const assignment: Assignment = {
      id: crypto.randomUUID(),
      title, details, submittedAt: new Date().toISOString()
    };
    persist({ ...data, students: data.students.map(s => s.id === user.id ? { ...s, assignments: [...s.assignments, assignment] } : s) });
  }, [data, user, persist]);
  const grade = useCallback((studentId: string, assignmentId: string, score: number, feedback: string) => {
    if (!data || user?.role !== "admin") return;
    persist({
      ...data, students: data.students.map(s => s.id === studentId ? {
        ...s, assignments: s.assignments.map(a => a.id === assignmentId ? { ...a, score, feedback } : a),
        scores: [...s.assignments.filter(a => a.id !== assignmentId && a.score !== undefined).map(a => a.score!), score]
      } : s)
    });
  }, [data, user, persist]);
  const value = useMemo(() => ({ ready, data, user, login, logout, submit, grade }),
    [ready, data, user, login, logout, submit, grade]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useData() {
  const value = useContext(Ctx);
  if (!value) throw new Error("useData must be used inside DataProvider"); return value;
}



