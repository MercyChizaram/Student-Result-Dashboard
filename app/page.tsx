"use client";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useData } from "./components/store";
export default function Home() {
    const { ready, user, login } = useData();
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    useEffect(() => {
        if (user) router.replace(user.role === "admin" ? "/admin" : "/dashboard");
        
    }, [user, router]); function onSubmit(e: FormEvent) {
        e.preventDefault();
        const found = login(username.trim(), password);
        if (found) router.push(found.role === "admin" ? "/admin" : "/dashboard"); else setError("Name or password was not recognized.");
    } if (!ready) return (
        <main className="center">
            <p>Loading dashboard…</p>
        </main>
    ); return (
        <main className="center">
            <form className="card login" onSubmit={onSubmit}>
                <p className="eyebrow">STUDENT & STAFF PORTAL</p>
                <h1>Welcome back</h1>
                <p className="muted">Sign in to view results and assignments.</p>
                <label>Student or staff name<input required value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" /></label>
                <label>Password<input required type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" /></label>{error && <p className="error">{error}</p>}
                <button>Sign in</button>
            </form>
        </main>
    );
}

