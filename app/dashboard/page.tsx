"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useData } from "../components/store";

export default function Dashboard() {
  const { ready, user, data, submit, submitAssigned, logout } = useData();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  useEffect(() => {
    if (ready && (!user || user.role !== "student")) router.replace("/");
  }, [ready, user, router]);

  if (!ready || !user || user.role !== "student" || !data) return <main className="center">Loading…</main>;
  const student = data.students.find((item) => item.id === user.id);
  if (!student) return null;
  const studentId = student.id;

  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit(title, details);
    setTitle("");
    setDetails("");
  }

  function sendAssigned(event: FormEvent<HTMLFormElement>, assignmentId: string) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    submitAssigned(studentId, assignmentId, String(formData.get("submission") ?? ""));
  }

  const averageScore = student.scores.length
    ? Math.round(student.scores.reduce((total, score) => total + score, 0) / student.scores.length)
    : null;

  return (
    <main className="shell">
      <header className="top">
        <div>
          <p className="eyebrow">STUDENT PORTAL</p>
          <h1>Welcome, {student.name}</h1>
          <p className="muted">{student.course} · Student ID {student.id}</p>
        </div>
        <button className="secondary" onClick={() => { logout(); router.push("/"); }}>Log out</button>
      </header>

      <section className="grid">
        <div className="card">
          <h2>Submit an assignment</h2>
          <form onSubmit={send}>
            <label>Assignment title<input required value={title} onChange={(event) => setTitle(event.target.value)} /></label>
            <label>Submission details<textarea required rows={4} value={details} onChange={(event) => setDetails(event.target.value)} /></label>
            <button>Submit assignment</button>
          </form>
        </div>
        <div className="card">
          <h2>Your grades</h2>
          {averageScore === null ? <p className="muted">Grades will appear after your work is reviewed.</p> : <p className="score">Average score: {averageScore}%</p>}
        </div>
      </section>

      <section className="card">
        <h2>Work assigned to you</h2>
        {student.assignments.filter((assignment) => assignment.instructions).length === 0 ? (
          <p className="muted">You don’t have any assigned work yet.</p>
        ) : student.assignments.filter((assignment) => assignment.instructions).map((assignment) => (
          <article className="assignment" key={assignment.id}>
            <h3>{assignment.title}</h3>
            <p><strong>Instructions:</strong> {assignment.instructions}</p>
            {assignment.submittedAt ? (
              <>
                <p><strong>Your submission:</strong> {assignment.details}</p>
                <small className="muted">Submitted {new Date(assignment.submittedAt).toLocaleString()}</small>
                <p><strong>Grade:</strong> {assignment.score === undefined ? "Waiting for staff to grade" : `${assignment.score}%`}</p>
                {assignment.feedback && <p><strong>Feedback:</strong> {assignment.feedback}</p>}
              </>
            ) : (
              <form onSubmit={(event) => sendAssigned(event, assignment.id)}>
                <label>Your work<textarea required name="submission" rows={5} placeholder="Write your answer here" /></label>
                <button>Submit this assignment</button>
              </form>
            )}
          </article>
        ))}
      </section>

      <section className="card">
        <h2>Your submissions</h2>
        {student.assignments.filter((assignment) => !assignment.instructions).length === 0 ? (
          <p className="muted">No other submissions yet.</p>
        ) : student.assignments.filter((assignment) => !assignment.instructions).map((assignment) => (
          <article className="assignment" key={assignment.id}>
            <div className="row"><h3>{assignment.title}</h3><b>{assignment.score === undefined ? "Awaiting grade" : `${assignment.score}%`}</b></div>
            <p>{assignment.details}</p>
            {assignment.submittedAt && <small className="muted">Submitted {new Date(assignment.submittedAt).toLocaleString()}</small>}
            {assignment.feedback && <p><strong>Feedback:</strong> {assignment.feedback}</p>}
          </article>
        ))}
      </section>
    </main>
  );
}


