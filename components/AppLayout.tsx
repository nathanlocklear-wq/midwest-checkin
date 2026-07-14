import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export default function AppLayout({
  title,
  subtitle,
  children,
}: Props) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#02112f] via-[#08204d] to-[#02112f]">

      <header className="border-b border-white/10 bg-[#02112f]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div className="flex items-center gap-4">

            <Image
              src="/logo.png"
              alt="Midwest Tech Talk"
              width={72}
              height={72}
              priority
            />

            <div>
              <h1 className="text-3xl font-black text-white">
                {title}
              </h1>

              {subtitle && (
                <p className="text-slate-300">
                  {subtitle}
                </p>
              )}
            </div>

          </div>

          <nav className="flex gap-3">

            <Link
              href="/checkin"
              className="rounded-xl px-5 py-3 font-bold text-white transition hover:bg-[#e02427]"
            >
              Check-In
            </Link>

            <Link
              href="/admin"
              className="rounded-xl px-5 py-3 font-bold text-white transition hover:bg-[#e02427]"
            >
              Admin
            </Link>

            <Link
              href="/admin/attendees"
              className="rounded-xl px-5 py-3 font-bold text-white transition hover:bg-[#e02427]"
            >
              Attendees
            </Link>

          </nav>

        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {children}
      </div>

    </main>
  );
}