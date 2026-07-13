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
          (result, error) => {
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
    <video
      ref={videoRef}
      className="mt-6 w-full rounded-xl border"
      autoPlay
      playsInline
      muted
    />
  );
}