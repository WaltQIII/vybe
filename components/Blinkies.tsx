import Image from "next/image";

interface BlinkiesProps {
  urls: string[];
}

export default function Blinkies({ urls }: BlinkiesProps) {
  if (!urls || urls.length === 0) return null;

  return (
    <div className="ms-panel overflow-hidden rounded">
      <div className="ms-section-header flex items-center gap-2">
        <span>&#10024;</span> Blinkies
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2 p-3">
        {urls.map((url, i) => (
          <Image
            key={i}
            src={url}
            alt={`Blinkie ${i + 1}`}
            width={100}
            height={100}
            className="h-auto max-h-[80px] w-auto max-w-[120px] rounded"
            unoptimized
          />
        ))}
      </div>
    </div>
  );
}
