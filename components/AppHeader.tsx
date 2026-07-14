import Image from "next/image";

type AppHeaderProps = {
  title: string;
  subtitle?: string;
};

export default function AppHeader({
  title,
  subtitle,
}: AppHeaderProps) {
  return (
    <div className="mb-10 flex flex-col items-center">
      <Image
        src="/logo.png"
        alt="Midwest Tech Talk"
        width={140}
        height={140}
        priority
        className="drop-shadow-2xl"
      />

      <h1 className="mt-5 text-center text-4xl font-extrabold tracking-tight text-white">
        {title}
      </h1>

      {subtitle && (
        <p className="mt-2 text-center text-lg text-slate-300">
          {subtitle}
        </p>
      )}
    </div>
  );
}