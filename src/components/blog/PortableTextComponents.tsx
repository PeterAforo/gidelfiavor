import Image from "next/image";
import type { PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/lib/sanity/image";

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const src = value?.asset ? urlFor(value).width(1200).url() : "";
      if (!src) return null;
      return (
        <figure className="my-8">
          <Image src={src} alt={value.alt || "Image"} width={1200} height={700} className="rounded-lg" />
          {value.caption ? <figcaption className="mt-2 text-sm text-[var(--color-muted)]">{value.caption}</figcaption> : null}
        </figure>
      );
    },
    callout: ({ value }) => <aside className="my-6 rounded-lg border-l-4 border-[var(--color-accent)] bg-[var(--color-bg-elevated)] p-4">{value.text}</aside>,
    codeBlock: ({ value }) => <pre className="my-6 overflow-auto rounded-lg bg-[#0a1628] p-4 text-sm text-[#f5f0e8]"><code>{value.code}</code></pre>,
    embed: ({ value }) => <p className="my-4 text-sm text-[var(--color-muted)]">Embed URL: {value.url}</p>,
  },
};
