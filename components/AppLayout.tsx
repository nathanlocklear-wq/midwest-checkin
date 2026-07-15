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

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#02112f]/95 backdrop-blur">

        <div
          className="
            mx-auto
            flex
            max-w-7xl
            flex-col
            gap-5
            px-4
            py-4
            md:flex-row
            md:items-center
            md:justify-between
            md:px-6
          "
        >

          <div className="flex items-center gap-3">

            <Image
              src="/logo.png"
              alt="Midwest Tech Talk"
              width={52}
              height={52}
              priority
              className="shrink-0"
            />

            <div>

              <h1 className="text-2xl font-black text-white md:text-3xl">
                {title}
              </h1>

              {subtitle && (
                <p className="text-sm text-slate-300 md:text-base">
                  {subtitle}
                </p>
              )}

            </div>

          </div>

          <nav
            className="
              grid
              grid-cols-2
              gap-2
              sm:grid-cols-4
            "
          >

            <Link
              href="/admin"
              className="
                rounded-xl
                bg-[#e02427]
                px-4
                py-3
                text-center
                text-sm
                font-black
                text-white
                transition
                hover:bg-red-700
              "
            >
              ← Dashboard
            </Link>

            <Link
              href="/checkin"
              className="
                rounded-xl
                bg-white/10
                px-4
                py-3
                text-center
                text-sm
                font-bold
                text-white
                transition
                hover:bg-[#e02427]
              "
            >
              📷 Check-In
            </Link>

            <Link
              href="/admin/attendees"
              className="
                rounded-xl
                bg-white/10
                px-4
                py-3
                text-center
                text-sm
                font-bold
                text-white
                transition
                hover:bg-[#e02427]
              "
            >
              👥 Attendees
            </Link>

            <Link
              href="/admin/badges"
              className="
                rounded-xl
                bg-white/10
                px-4
                py-3
                text-center
                text-sm
                font-bold
                text-white
                transition
                hover:bg-[#e02427]
              "
            >
              🪪 Badges
            </Link>

          </nav>

        </div>

      </header>

      <div
        className="
          mx-auto
          max-w-7xl
          px-4
          py-6
          md:px-6
          md:py-8
        "
      >
        {children}
      </div>

    </main>
  );
}