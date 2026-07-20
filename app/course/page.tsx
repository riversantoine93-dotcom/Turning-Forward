"use client";

import Link from "next/link";
import { LockKeyhole, PlayCircle } from "lucide-react";
import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";
import { modules } from "@/lib/course";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { loadCloudProgress } from "@/lib/progress";

export default function CourseDashboard() {
  const [progress, setProgress] = useState(0);
  const { user, loading } = useAuth();
  useEffect(() => {
    if (loading) return;
    const local = JSON.parse(localStorage.getItem("turning-forward-progress") || "{}");
    const apply = (data: Record<string, unknown>) => {
      const completed = [data.lesson1, data.lesson2, data.lesson3, data.challenge].filter(Boolean).length;
      setProgress(Math.round((completed / 32) * 100));
    };
    if (!user) {
      apply(local);
      return;
    }
    loadCloudProgress(user.id).then((cloud) => apply({ ...local, ...cloud })).catch(() => apply(local));
  }, [user, loading]);

  return (
    <main>
      <Header />
      <section className="dashboard-head shell">
        <span className="eyebrow">Turning Forward</span>
        <h1>The Work Beyond Fear</h1>
        <p>Eight modules for moving from survival to strategy.</p>
        <ProgressBar value={progress} />
        <p className="sync-note">{user ? `Signed in as ${user.email}. Your progress syncs securely across devices.` : "You are viewing as a guest. Sign in to sync progress across devices."}</p>
      </section>
      <section className="module-grid shell">
        {modules.map((module) => (
          <article className={`module-card ${module.available ? "active" : "locked"}`} key={module.number}>
            <div className="module-number">{String(module.number).padStart(2, "0")}</div>
            <div className="module-copy"><span>Module {module.number}</span><h2>{module.title}</h2><p>{module.subtitle}</p></div>
            {module.available ? <Link href="/course/module-1" className="circle-link" aria-label="Open module 1"><PlayCircle /></Link> : <div className="circle-link"><LockKeyhole /></div>}
          </article>
        ))}
      </section>
    </main>
  );
}
