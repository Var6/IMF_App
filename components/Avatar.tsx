import { initials } from "@/lib/format";

/**
 * Simple avatar. Falls back to initials when there is no image.
 * Uses a plain <img> because file URLs may be presigned-redirect proxies.
 */
export function Avatar({
  name,
  src,
  size = 36,
}: {
  name: string;
  src?: string | null;
  size?: number;
}) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className="rounded-full object-cover ring-2 ring-white"
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      className="grid place-items-center rounded-full bg-brand-100 font-semibold text-brand-700 ring-2 ring-white"
    >
      {initials(name) || "?"}
    </div>
  );
}
