"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, ChevronRight, Circle, RotateCcw } from "lucide-react";
import Header from "@/components/Header";
import { useAuth } from "@/components/AuthProvider";
import { loadCloudProgress, saveCloudProgress } from "@/lib/progress";

const tabs = ["Lesson 1", "Lesson 2", "Lesson 3", "Challenge"] as const;
type Tab = typeof tabs[number];
type Saved = Record<string, string | boolean | number>;

export default function ModuleOne() {
  const [tab, setTab] = useState<Tab>("Lesson 1");
  const [saved, setSaved] = useState<Saved>({});
  const [hydrated, setHydrated] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"local" | "syncing" | "saved" | "error">("local");
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    const local = JSON.parse(localStorage.getItem("turning-forward-progress") || "{}");

    if (!user) {
      setSaved(local);
      setHydrated(true);
      setSyncStatus("local");
      return;
    }

    loadCloudProgress(user.id)
      .then((cloud) => {
        const merged = { ...local, ...cloud };
        setSaved(merged);
        setSyncStatus("saved");
      })
      .catch(() => {
        setSaved(local);
        setSyncStatus("error");
      })
      .finally(() => setHydrated(true));
  }, [user, authLoading]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("turning-forward-progress", JSON.stringify(saved));
    if (!user) return;

    setSyncStatus("syncing");
    const timer = window.setTimeout(() => {
      saveCloudProgress(user.id, saved)
        .then(() => setSyncStatus("saved"))
        .catch(() => setSyncStatus("error"));
    }, 500);

    return () => window.clearTimeout(timer);
  }, [saved, hydrated, user]);

  const completed = useMemo(() => [saved.lesson1, saved.lesson2, saved.lesson3, saved.challenge].filter(Boolean).length, [saved]);
  const setField = (key: string, value: string | boolean | number) => setSaved((s) => ({ ...s, [key]: value }));
  const finish = (key: string, next?: Tab) => { setField(key, true); if (next) setTab(next); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <main>
      <Header />
      <section className="lesson-shell shell">
        <div className="lesson-top"><Link href="/course"><ArrowLeft size={17}/> Dashboard</Link><span>{completed} of 4 sections complete</span></div>
        <p className={`sync-note ${syncStatus === "saved" ? "ok" : syncStatus === "error" ? "error" : ""}`}>{user ? (syncStatus === "syncing" ? "Saving to your student account…" : syncStatus === "saved" ? "Progress saved to Supabase" : syncStatus === "error" ? "Cloud sync failed; progress remains saved on this device." : "") : "Guest mode: sign in to sync progress across devices."}</p>
        <div className="module-banner"><span>Module 1</span><h1>The Decision to Turn Forward</h1><p>Identity, responsibility, fear, and the structure required to create momentum.</p></div>
        <div className="tab-row">{tabs.map((item) => <button key={item} onClick={() => setTab(item)} className={tab === item ? "selected" : ""}>{saved[item === "Lesson 1" ? "lesson1" : item === "Lesson 2" ? "lesson2" : item === "Lesson 3" ? "lesson3" : "challenge"] ? <Check size={15}/> : <Circle size={13}/>} {item}</button>)}</div>

        {tab === "Lesson 1" && <LessonOne saved={saved} setField={setField} finish={() => finish("lesson1", "Lesson 2")} />}
        {tab === "Lesson 2" && <LessonTwo saved={saved} setField={setField} finish={() => finish("lesson2", "Lesson 3")} />}
        {tab === "Lesson 3" && <LessonThree saved={saved} setField={setField} finish={() => finish("lesson3", "Challenge")} />}
        {tab === "Challenge" && <Challenge saved={saved} setField={setField} finish={() => finish("challenge")} />}

        <button className="reset-link" onClick={() => { localStorage.removeItem("turning-forward-progress"); setSaved({}); }}><RotateCcw size={15}/> Reset demo progress</button>
      </section>
    </main>
  );
}

function LessonOne({ saved, setField, finish }: any) {
  const quizReady = saved.l1q1 && saved.l1q2 && saved.l1q3 && saved.l1q4;
  const reflectionReady = String(saved.waiting || "").trim().length > 2 && String(saved.becoming || "").trim().length > 20;
  return <div className="lesson-layout"><article className="lesson-content">
    <span className="lesson-kicker">Lesson 1</span><h2>You Are Not Starting Over</h2>
    <div className="video-placeholder"><div><span>VIDEO LESSON</span><strong>Add your Vimeo, YouTube, or Mux embed here</strong><p>Recommended runtime: 12–15 minutes</p></div></div>
    <h3>The myth of starting over</h3><p>Most people think they need a fresh start. But you do not need a reset—you need a decision. You are not blank, erased, or without history. You are experienced, shaped, and capable of using what you have learned.</p>
    <blockquote>Turning forward is not denial. It is integration.</blockquote>
    <h3>Identity versus reputation</h3><p>Reputation is what people think. Identity is what you decide. You do not have to internalize every label placed on you. Rebuild identity first; reputation follows consistent action.</p>
    <h3>Responsibility without shame</h3><p>Responsibility says, “That was me, that decision was mine, and now I move.” Shame says, “I am irredeemable.” This course asks you to own your choices without destroying your worth.</p>
    <Interaction title="Pause and complete the sentence"><label>I am no longer waiting for…</label><textarea value={String(saved.waiting || "")} onChange={(e) => setField("waiting", e.target.value)} placeholder="permission, perfect timing, someone else to change…"/></Interaction>
    <Interaction title="Identity Rewrite"><label>Write at least five sentences beginning with “I am becoming…”</label><textarea className="large" value={String(saved.becoming || "")} onChange={(e) => setField("becoming", e.target.value)} placeholder="I am becoming more disciplined…"/></Interaction>
    <Quiz questions={[
      ["l1q1","Turning forward means:",["Erasing your history","Integrating your experience and moving deliberately"],"Integrating your experience and moving deliberately"],
      ["l1q2","Turning forward requires erasing the past.",["True","False"],"False"],
      ["l1q3","What should be rebuilt first?",["Reputation","Identity"],"Identity"],
      ["l1q4","Responsibility without shame is:",["Avoiding accountability","Ownership without self-destruction"],"Ownership without self-destruction"]
    ]} saved={saved} setField={setField}/>
    <button className="button primary full" disabled={!quizReady || !reflectionReady} onClick={finish}>Complete Lesson 1 <ChevronRight size={18}/></button>
  </article><Sidebar completed={!!saved.lesson1}/></div>
}

function LessonTwo({ saved, setField, finish }: any) {
  const fields = ["fear","think","worst","likely","action"];
  const ready = fields.every((k) => String(saved[k] || "").trim().length > 2) && saved.l2q1 && saved.l2q2 && saved.l2q3;
  return <div className="lesson-layout"><article className="lesson-content"><span className="lesson-kicker">Lesson 2</span><h2>Fear Is Information, Not Instruction</h2>
    <div className="video-placeholder"><div><span>VIDEO LESSON</span><strong>Embed the Lesson 2 teaching video here</strong><p>Recommended runtime: 10–12 minutes</p></div></div>
    <p>Fear often appears the moment you attempt to grow. It may tell you that something is unfamiliar, important, or stretching you—but fear does not get to vote.</p><blockquote>Fear is information. Avoidance is the real enemy.</blockquote>
    <h3>Survival mode versus strategy mode</h3><p>Survival mode reacts. Strategy mode pauses, evaluates, plans, and moves deliberately. The goal is not to stop feeling fear; it is to stop allowing fear to make every decision.</p>
    <Interaction title="Fear Mapping Tool">{[["fear","Current fear"],["think","What I think will happen"],["worst","Worst-case scenario"],["likely","Most likely scenario"],["action","One forward action I can take this week"]].map(([k,l])=><label key={k}>{l}<textarea value={String(saved[k]||"")} onChange={(e)=>setField(k,e.target.value)}/></label>)}</Interaction>
    <Quiz questions={[["l2q1","Fear is:",["A stop sign","A signal"],"A signal"],["l2q2","Survival mode is primarily:",["Reactive","Strategic"],"Reactive"],["l2q3","Scarcity thinking affects:",["Only confidence","Both confidence and decisions"],"Both confidence and decisions"]]} saved={saved} setField={setField}/>
    <button className="button primary full" disabled={!ready} onClick={finish}>Complete Lesson 2 <ChevronRight size={18}/></button>
  </article><Sidebar completed={!!saved.lesson2}/></div>
}

function LessonThree({ saved, setField, finish }: any) {
  const ready = ["wake","nonnegotiables","growth","eliminate"].every((k)=>String(saved[k]||"").trim().length>2);
  return <div className="lesson-layout"><article className="lesson-content"><span className="lesson-kicker">Lesson 3</span><h2>The First Discipline: Structure</h2>
    <div className="video-placeholder"><div><span>VIDEO LESSON</span><strong>Embed the Lesson 3 teaching video here</strong><p>Recommended runtime: 10–12 minutes</p></div></div>
    <p>Motivation is unreliable. Discipline builds momentum. Freedom without structure can feel unstable, but structure creates safety, safety creates clarity, and clarity makes progress possible.</p><blockquote>You cannot out-motivate chaos. You must out-structure it.</blockquote>
    <h3>Micro-commitments</h3><p>Choose small, repeatable behaviors: a wake time, a study block, a savings percentage, ten pages of reading, or a scheduled workout. Momentum is built in inches.</p>
    <Interaction title="Structure Builder">{[["wake","My wake time"],["nonnegotiables","My three non-negotiables"],["growth","My growth block: time and activity"],["eliminate","One habit I am eliminating"]].map(([k,l])=><label key={k}>{l}<textarea value={String(saved[k]||"")} onChange={(e)=>setField(k,e.target.value)}/></label>)}</Interaction>
    <button className="button primary full" disabled={!ready} onClick={finish}>Complete Lesson 3 <ChevronRight size={18}/></button>
  </article><Sidebar completed={!!saved.lesson3}/></div>
}

function Challenge({ saved, setField, finish }: any) {
  const ready = ["routine","fearAction","identityBehavior"].every((k)=>String(saved[k]||"").trim().length>2) && saved.pledge;
  return <div className="lesson-layout"><article className="lesson-content"><span className="lesson-kicker">Weekly Forward Challenge</span><h2>Turn the Decision into Action</h2><p>Choose one behavior in each category. Keep it realistic, measurable, and specific enough to complete within seven days.</p>
    <Interaction title="My commitments">{[["routine","One structured daily routine"],["fearAction","One fear-facing action"],["identityBehavior","One identity-building behavior"]].map(([k,l])=><label key={k}>{l}<textarea value={String(saved[k]||"")} onChange={(e)=>setField(k,e.target.value)}/></label>)}<label className="check-label"><input type="checkbox" checked={!!saved.pledge} onChange={(e)=>setField("pledge",e.target.checked)}/> I commit to completing these actions during the next seven days.</label></Interaction>
    {!saved.challenge ? <button className="button primary full" disabled={!ready} onClick={finish}>I Commit to Turning Forward <Check size={18}/></button> : <div className="completion-card"><Check/><h3>Module 1 complete</h3><p>You made the decision. Forward is not loud—it is consistent.</p><Link className="button ghost" href="/course">Return to dashboard</Link></div>}
  </article><Sidebar completed={!!saved.challenge}/></div>
}

function Interaction({ title, children }: any) { return <section className="interaction"><h3>{title}</h3>{children}</section>; }
function Sidebar({ completed }: { completed: boolean }) { return <aside className="lesson-sidebar"><h3>Module principle</h3><p>“You are not starting over. You are building forward.”</p><div className={completed ? "status complete" : "status"}>{completed ? <Check/> : <Circle/>}{completed ? "Section complete" : "Complete the activities to continue"}</div></aside>; }
function Quiz({ questions, saved, setField }: any) { return <section className="quiz"><h3>Knowledge Check</h3>{questions.map(([key,q,options,answer]: any, idx:number)=><div className="question" key={key}><strong>{idx+1}. {q}</strong>{options.map((option:string)=><label className={`option ${saved[key]===option ? (option===answer ? "correct" : "incorrect") : ""}`} key={option}><input type="radio" name={key} checked={saved[key]===option} onChange={()=>setField(key,option)}/>{option}</label>)}</div>)}</section>; }
