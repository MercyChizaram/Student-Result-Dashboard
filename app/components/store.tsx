"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Assignment = {
  id: string;
  title: string;
  details: string;
  instructions?: string;
  submittedAt?: string;
  score?: number;
  feedback?: string;
};

export type Student = {
  id: string;
  name: string;
  role: "student";
  course: string;
  loginCredentials: { username: string; password: string };
  assignments: Assignment[];
  scores: number[];
};

export type User = {
  id: string;
  name: string;
  role: "admin" | "student";
  loginCredentials: { username: string; password: string };
};

type Store = { admin: User; students: Student[] };
type ContextValue = {
  ready: boolean;
  data: Store | null;
  user: User | null;
  login: (name: string, password: string) => User | null;
  logout: () => void;
  submit: (title: string, details: string) => void;
  assign: (studentId: string, title: string, instructions: string) => void;
  submitAssigned: (studentId: string, assignmentId: string, submission: string) => void;
  grade: (studentId: string, assignmentId: string, score: number, feedback: string) => void;
};

const KEY = "student-result-dashboard-v1";
const admin: User = {
  id: "admin-1",
  name: "Staff",
  role: "admin",
  loginCredentials: { username: "Staff", password: "admin123" },
};
const names = [
  "Daniel Okafor", "Charles Mensah", "Mercy Adeyemi", "John Bello",
  "David Eze", "Amara Nwosu", "Ibrahim Musa", "Grace Akinyemi",
  "Peter Obi", "Fatima Sule", "Samuel James",
];

function initialData(): Store {
  return {
    admin,
    students: names.map((name, index) => ({
      id: `student-${index + 1}`,
      name,
      role: "student",
      course: ["JavaScript", "React", "TypeScript", "Next.js", "Tailwind CSS"][index % 5],
      loginCredentials: { username: name, password: "student123" },
      assignments: [],
      scores: [],
    })),
  };
}

const Ctx = createContext<ContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Store | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      try {
        const raw = localStorage.getItem(KEY);
        const saved = raw ? JSON.parse(raw) as Store : initialData();
        saved.admin = { ...saved.admin, ...admin };
        saved.students = saved.students.map((student) => ({
          ...student,
          role: "student",
          loginCredentials: { username: student.name, password: "student123" },
          assignments: (student.assignments ?? []).map((assignment) => ({ ...assignment })),
          scores: student.scores ?? [],
        }));
        localStorage.setItem(KEY, JSON.stringify(saved));
        setData(saved);
        const session = localStorage.getItem(`${KEY}:session`);
        if (session) {
          const parsed = JSON.parse(session) as User;
          setUser(parsed.role === "admin" ? saved.admin : saved.students.find((student) => student.id === parsed.id) ?? null);
        }
      } catch {
        const seeded = initialData();
        localStorage.setItem(KEY, JSON.stringify(seeded));
        setData(seeded);
      }
      setReady(true);
    });
    return () => { cancelled = true; };
  }, []);

  const persist = useCallback((next: Store) => {
    setData(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }, []);

  const login = useCallback((name: string, password: string) => {
    if (!data) return null;
    const normalizedName = name.trim().toLocaleLowerCase();
    const found = data.admin.name.toLocaleLowerCase() === normalizedName && data.admin.loginCredentials.password === password
      ? data.admin
      : data.students.find((student) => student.name.toLocaleLowerCase() === normalizedName && student.loginCredentials.password === password);
    if (found) {
      setUser(found);
      localStorage.setItem(`${KEY}:session`, JSON.stringify({ id: found.id, name: found.name, role: found.role }));
    }
    return found ?? null;
  }, [data]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(`${KEY}:session`);
  }, []);

  const submit = useCallback((title: string, details: string) => {
    if (!data || !user || user.role !== "student") return;
    const assignment: Assignment = { id: crypto.randomUUID(), title, details, submittedAt: new Date().toISOString() };
    persist({ ...data, students: data.students.map((student) => student.id === user.id ? { ...student, assignments: [...student.assignments, assignment] } : student) });
  }, [data, user, persist]);

  const assign = useCallback((studentId: string, title: string, instructions: string) => {
    if (!data || user?.role !== "admin") return;
    const assignment: Assignment = { id: crypto.randomUUID(), title, details: "", instructions };
    persist({ ...data, students: data.students.map((student) => student.id === studentId ? { ...student, assignments: [...student.assignments, assignment] } : student) });
  }, [data, user, persist]);

  const submitAssigned = useCallback((studentId: string, assignmentId: string, submission: string) => {
    if (!data || user?.role !== "student" || user.id !== studentId) return;
    persist({ ...data, students: data.students.map((student) => student.id === studentId ? {
      ...student,
      assignments: student.assignments.map((assignment) => assignment.id === assignmentId && !assignment.submittedAt
        ? { ...assignment, details: submission, submittedAt: new Date().toISOString() }
        : assignment),
    } : student) });
  }, [data, user, persist]);

  const grade = useCallback((studentId: string, assignmentId: string, score: number, feedback: string) => {
    if (!data || user?.role !== "admin") return;
    persist({ ...data, students: data.students.map((student) => student.id === studentId ? {
      ...student,
      assignments: student.assignments.map((assignment) => assignment.id === assignmentId ? { ...assignment, score, feedback } : assignment),
      scores: [...student.assignments.filter((assignment) => assignment.id !== assignmentId && assignment.score !== undefined).map((assignment) => assignment.score!), score],
    } : student) });
  }, [data, user, persist]);

  const value = useMemo(() => ({ ready, data, user, login, logout, submit, assign, submitAssigned, grade }),
    [ready, data, user, login, logout, submit, assign, submitAssigned, grade]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useData() {
  const value = useContext(Ctx);
  if (!value) throw new Error("useData must be used inside DataProvider");
  return value;
}
