"use client";

import Image from "next/image";
import Link from "next/link";
import { LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function Header() {
  const { user, loading, signOut } = useAuth();

  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="LEARN home">
        <Image src="/learn-logo.png" alt="LEARN by The Conviction Fiction Podcast" width={74} height={74} priority />
        <div><strong>LEARN</strong><span>The Conviction Fiction Podcast</span></div>
      </Link>
      <nav>
        <Link href="/course">Course</Link>
        <a href="https://theconvictionfictionpodcast.com" target="_blank" rel="noreferrer">Main Website</a>
        {!loading && (user ? (
          <button className="nav-auth" onClick={() => signOut()} title={user.email ?? "Signed in"}>
            <LogOut size={16}/> Sign out
          </button>
        ) : (
          <Link className="nav-auth" href="/login"><LogIn size={16}/> Sign in</Link>
        ))}
      </nav>
    </header>
  );
}
