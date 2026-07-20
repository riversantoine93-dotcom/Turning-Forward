import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Compass, PenLine } from "lucide-react";
import Header from "@/components/Header";

export default function Home() {
  return (
    <main>
      <Header />
      <section className="hero shell">
        <div className="hero-copy">
          <span className="eyebrow">Interactive Learning Portal</span>
          <h1>You do not need to start over. You need a forward strategy.</h1>
          <p>Build identity, structure, discipline, and momentum through guided lessons, private reflection, quizzes, and weekly action challenges.</p>
          <div className="hero-actions">
            <Link className="button primary" href="/course">Enter the Course <ArrowRight size={18} /></Link>
            <a className="button ghost" href="https://theconvictionfictionpodcast.com" target="_blank" rel="noreferrer">Visit Main Website</a>
          </div>
          <div className="trust-row"><span><CheckCircle2 size={17}/>Mobile friendly</span><span><CheckCircle2 size={17}/>Progress saved locally</span><span><CheckCircle2 size={17}/>Interactive Module 1</span></div>
        </div>
        <div className="hero-logo-card"><Image src="/learn-logo.png" alt="LEARN logo" width={620} height={620} priority /></div>
      </section>
      <section className="feature-section shell">
        <article><BookOpen/><h3>Guided Lessons</h3><p>Clear teaching broken into practical, manageable steps.</p></article>
        <article><PenLine/><h3>Private Reflection</h3><p>Save identity statements, fear maps, and weekly commitments.</p></article>
        <article><Compass/><h3>Forward Action</h3><p>Turn insight into one concrete behavior at a time.</p></article>
      </section>
      <footer>© 2026 The Conviction Fiction Podcast. All rights reserved.</footer>
    </main>
  );
}
