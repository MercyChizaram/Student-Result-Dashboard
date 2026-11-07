"use client";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation"; import { useData } from "../components/store";

export default function Admin() {
    const { ready, user, data, grade, logout } = useData();
    const router = useRouter();
    const [selected, setSelected] = useState("");
    useEffect(() => { if (ready && (!user || user.role !== "admin")) router.replace("/"); }, [ready, user, router]);
    if (!ready || user?.role !== "admin" || !data)
        return <main className="center">Loading…</main>;
    const active = data.students.find(s => s.id === selected) ?? data.students[0];
    function save(e: FormEvent<HTMLFormElement>, studentId: string, assignmentId: string) {
        e.preventDefault();
        const fd = new FormData(e.currentTarget); grade(studentId, assignmentId, Number(fd.get("score")), String(fd.get("feedback") ?? ""));
    } return (
        <main className="shell">
            <header className="top">
                <div>
                    <p className="eyebrow">STAFF PORTAL</p>
                    <h1>Staff dashboard</h1>
                    <p className="muted">Review submissions and record grades.</p>
                </div>
                <button className="secondary" onClick={() => { logout(); router.push("/") }}>Log out</button>
            </header>
            <div className="admin-layout">
                <aside className="card">
                    <h2>Students ({data.students.length})</h2>{data.students.map(s => <button key={s.id} className={`student-link ${active.id === s.id ? "selected" : ""}`} onClick={() => setSelected(s.id)}>
                        <span>{s.name}<small>{s.course}</small></span><b>{s.assignments.length}</b>
                    </button>)}
                </aside>
                <section className="card">
                    <h2>{active.name}</h2>
                    <p className="muted">{active.course} · {active.assignments.length} assignments · {active.scores.length} grades</p>
                    {active.assignments.length === 0 ? <p className="empty">No assignments submitted yet.</p> : active.assignments.map(a =>
                        <article className="assignment" key={a.id}>
                            <h3>{a.title}</h3><p>{a.details}</p><small className="muted">Submitted {new Date(a.submittedAt).toLocaleString()}</small>
                            <form className="grade-form" onSubmit={e => save(e, active.id, a.id)}>
                                <label>Score (0–100)<input required name="score" type="number" min="0" max="100" defaultValue={a.score} /></label>
                                <label>Feedback<textarea name="feedback" rows={2} defaultValue={a.feedback ?? ""} /></label>
                                <button>Save grade</button>
                            </form>
                        </article>)}
                </section>
            </div>
        </main>
    );
}

