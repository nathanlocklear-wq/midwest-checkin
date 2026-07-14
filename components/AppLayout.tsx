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

        <div className="
          mx-auto 
          flex 
          max-w-7xl 
          flex-col 
          gap-5 
          px-4 
          py-5
          md:flex-row 
          md:items-center 
          md:justify-between
          md:px-6
        ">

          <div className="flex items-center gap-3">

            <Image
              src="/logo.png"
              alt="Midwest Tech Talk"
              width={64}
              height={64}
              priority
              className="shrink-0"
            />

            <div>

              <h1 className="
                text-2xl 
                font-black 
                text-white
                md:text-3xl
              ">
                {title}
              </h1>

              {subtitle && (
                <p className="
                  text-sm
                  text-slate-300
                  md:text-base
                ">
                  {subtitle}
                </p>
              )}

            </div>

          </div>


          <nav className="
            flex 
            flex-wrap 
            justify-center 
            gap-2
            md:justify-end
            md:gap-3
          ">

            <Link
              href="/checkin"
              className="
                rounded-xl 
                px-4 
                py-2 
                text-sm
                font-bold 
                text-white 
                transition 
                hover:bg-[#e02427]
                md:px-5
                md:py-3
                md:text-base
              "
            >
              Check-In
            </Link>


            <Link
              href="/admin"
              className="
                rounded-xl 
                px-4 
                py-2 
                text-sm
                font-bold 
                text-white 
                transition 
                hover:bg-[#e02427]
                md:px-5
                md:py-3
                md:text-base
              "
            >
              Admin
            </Link>


            <Link
              href="/admin/attendees"
              className="
                rounded-xl 
                px-4 
                py-2 
                text-sm
                font-bold 
                text-white 
                transition 
                hover:bg-[#e02427]
                md:px-5
                md:py-3
                md:text-base
              "
            >
              Attendees
            </Link>

          </nav>

        </div>

      </header>


      <div className="
        mx-auto 
        max-w-7xl 
        px-4 
        py-8
        md:px-6
        md:py-10
      ">
        {children}
      </div>

    </main>
  );
}