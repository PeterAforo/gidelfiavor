"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.email(),
  firstName: z.string().max(100).optional(),
});

type FormValues = z.infer<typeof schema>;

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [message, setMessage] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const payload = (await response.json()) as { message?: string };
    setMessage(payload.message || (response.ok ? "Subscribed!" : "Failed to subscribe."));
    if (response.ok) reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {!compact && (
        <input
          {...register("firstName")}
          placeholder="First name (optional)"
          className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/60 focus:border-white/40 focus:outline-none transition-all"
        />
      )}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          {...register("email")}
          type="email"
          required
          placeholder="Your Email Address"
          className="flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-3.5 text-sm text-white placeholder:text-white/60 focus:border-white/40 focus:outline-none transition-all"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-[var(--color-accent)] px-8 py-3.5 text-sm font-bold text-[#0a1628] transition-all hover:bg-[var(--color-accent-hover)] disabled:opacity-60"
        >
          {isSubmitting ? "Subscribing..." : "Subscribe"}
        </button>
      </div>
      {message && (
        <p className={`text-sm font-medium ${message.includes("Welcome") || message.includes("Subscribed") ? "text-green-400" : "text-white/70"}`}>
          {message}
        </p>
      )}
    </form>
  );
}
