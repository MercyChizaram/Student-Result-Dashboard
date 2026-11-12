"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useData } from "../components/store";

export default function Admin() {
  const { ready, user, data, assign, grade, logout } = useData();
  const router = useRouter();
  const [selected, setSelected] = useState("");
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");

  useEffect(() => {
    if (ready && (!user || user.role !== "admin")) router.replace("/");
  }, [ready, user, router]);

  if (!ready || user?.role !== "admin" || !data) {
    return <main className="center">Loading…</main>;
  }

  const active = data.students.find((student) => student.id === selected) ?? data.students[0];
  if (!active) return <main className="center">No students found.</main>;

  function createAssignment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    assign(active.id, title, instructions);
    setTitle("");
    setInstructions("");
  }

  function saveGrade(event: FormEvent<HTMLFormElement>, assignmentId: string) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    grade(active.id, assignmentId, Number(formData.get("score")), String(formData.get("feedback") ?? ""));
  }

  return (
    <main className="shell">
      <header className="top">
        <div>
          <p className="eyebrow">STAFF PORTAL</p>
          <h1>Staff dashboard</h1>
          <p className="muted">Assign work, review submissions, and record grades.</p>
        </div>
        <button className="secondary" onClick={() => { logout(); router.push("/"); }}>Log out</button>
      </header>

      <div className="admin-layout">
        <aside className="card">
          <h2>Students ({data.students.length})</h2>
          {data.students.map((student) => (
            <button key={student.id} className={`student-link ${active.id === student.id ? "selected" : ""}`} onClick={() => setSelected(student.id)}>
              <span>{student.name}<small>{student.course}</small></span>
              <b>{student.assignments.length}</b>
            </button>
          ))}
        </aside>

        <section className="card">
          <h2>{active.name}</h2>
          <p className="muted">{active.course} · {active.assignments.length} assignments · {active.scores.length} grades</p>

          <form onSubmit={createAssignment}>
            <h3>Assign work to {active.name}</h3>
            <label>Assignment title<input required value={title} onChange={(event) => setTitle(event.target.value)} /></label>
            <label>Instructions<textarea required rows={4} value={instructions} onChange={(event) => setInstructions(event.target.value)} /></label>
            <button>Assign to {active.name}</button>
          </form>

          <h3>Assignments and submissions</h3>
          {active.assignments.length === 0 ? <p className="empty">No assignments yet.</p> : active.assignments.map((assignment) => (
            <article className="assignment" key={assignment.id}>
              <h3>{assignment.title}</h3>
              {assignment.instructions && <p><strong>Instructions:</strong> {assignment.instructions}</p>}
              {assignment.submittedAt ? (
                <>
                  <p><strong>Student submission:</strong> {assignment.details}</p>
                  <small className="muted">Submitted {new Date(assignment.submittedAt).toLocaleString()}</small>
                  <form className="grade-form" onSubmit={(event) => saveGrade(event, assignment.id)}>
                    <label>Score (0–100)<input required name="score" type="number" min="0" max="100" defaultValue={assignment.score} /></label>
                    <label>Feedback<textarea name="feedback" rows={2} defaultValue={assignment.feedback ?? ""} /></label>
                    <button>Save grade</button>
                  </form>
                </>
              ) : <p className="muted">Waiting for the student to submit.</p>}
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
