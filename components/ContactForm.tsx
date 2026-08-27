"use client";

import { useState } from "react";
import { contactSchema } from "@/lib/schemas";

type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "submitted" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage("");
    setFieldErrors({});

    const result = contactSchema.safeParse({ name, email, message });
    if (!result.success) {
      const errors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (key && !errors[key]) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      if (!res.ok) {
        throw new Error("전송에 실패했습니다.");
      }

      setStatus("submitted");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "전송 중 오류가 발생했습니다."
      );
    }
  }

  if (status === "submitted") {
    return (
      <div className="rounded-xl border border-accent/30 bg-accent-soft p-6 text-center">
        <p className="font-semibold text-accent">감사합니다!</p>
        <p className="mt-1 text-sm opacity-80">
          문의가 정상적으로 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-medium text-accent underline underline-offset-4"
        >
          새 문의 작성하기
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium">
          이름
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-md border border-black/10 bg-background px-3 py-2 text-sm dark:border-white/10"
        />
        {fieldErrors.name && (
          <p className="text-xs text-accent">{fieldErrors.name}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">
          이메일
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-md border border-black/10 bg-background px-3 py-2 text-sm dark:border-white/10"
        />
        {fieldErrors.email && (
          <p className="text-xs text-accent">{fieldErrors.email}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="message" className="text-sm font-medium">
          메시지
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="rounded-md border border-black/10 bg-background px-3 py-2 text-sm dark:border-white/10"
        />
        {fieldErrors.message && (
          <p className="text-xs text-accent">{fieldErrors.message}</p>
        )}
      </div>

      {status === "error" && (
        <p className="text-sm text-accent">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {status === "submitting" ? "전송 중..." : "문의 보내기"}
      </button>
    </form>
  );
}
