"use client";

import { BrowserMultiFormatReader } from "@zxing/browser";
import { useEffect, useRef } from "react";

interface Props {
  active: boolean;
  onScan: (text: string) => void;
}

export default function QRScanner({
  active,
  onScan,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!active) return;

    const codeReader = new BrowserMultiFormatReader();

    let controls:
      | Awaited<ReturnType<typeof codeReader.decodeFromVideoDevice>>
      | undefined;

    async function startScanner() {
      try {
        controls = await codeReader.decodeFromVideoDevice(
          undefined,
          videoRef.current!,
          (result) => {
            if (result) {
              controls?.stop();
              onScan(result.getText());
            }
          }
        );
      } catch (err) {
        console.error(err);
      }
    }

    startScanner();

    return () => {
      controls?.stop();
    };
  }, [active, onScan]);

  if (!active) return null;

  return (
    <div className="rounded-3xl bg-white p-6 shadow-2xl">

      <div className="mb-6 text-center">

        <h2 className="text-3xl font-black text-[#02112f]">
          QR Badge Scanner
        </h2>

        <p className="mt-2 text-slate-500">
          Hold the attendee badge in front of the camera.
        </p>

      </div>

      <div className="overflow-hidden rounded-2xl border-4 border-[#02112f] bg-black shadow-inner">

        <video
          ref={videoRef}
          className="aspect-video w-full"
          autoPlay
          playsInline
          muted
        />

      </div>

      <div className="mt-5 rounded-2xl bg-red-50 p-4 text-center">

        <p className="font-semibold text-[#e02427]">
          Camera will automatically scan the first QR code it detects.
        </p>

      </div>

    </div>
  );
}