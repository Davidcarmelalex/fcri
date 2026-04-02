"use client";

import { useState } from "react";

type AcademicIntakeFormProps = {
  type: "course" | "fellowship";
  title: string;
  description: string;
  scopeLabel: string;
  scopePlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  successMessage: string;
};

export default function AcademicIntakeForm({
  type,
  title,
  description,
  scopeLabel,
  scopePlaceholder,
  messageLabel,
  messagePlaceholder,
  successMessage,
}: AcademicIntakeFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [scope, setScope] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          name,
          email,
          organization,
          budget: scope,
          message,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || "Failed to submit application");
      }

      setStatus("success");
      setFeedback(successMessage);
      setName("");
      setEmail("");
      setOrganization("");
      setScope("");
      setMessage("");
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Failed to submit application");
    }
  }

  return (
    <div className="rounded-[2rem] border border-gold/15 bg-[rgba(10,10,10,0.78)] p-8 backdrop-blur">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.25em] text-gold">Academic Intake</p>
        <h2 className="mt-4 text-3xl font-semibold text-white">{title}</h2>
        <p className="mt-3 text-base leading-7 text-silver">{description}</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-white">Name</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-2xl border border-gold/15 bg-black/40 px-4 py-3 text-white outline-none transition-colors focus:border-gold"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-white">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-gold/15 bg-black/40 px-4 py-3 text-white outline-none transition-colors focus:border-gold"
              placeholder="you@domain.org"
            />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-white">Background</label>
            <input
              value={organization}
              onChange={(event) => setOrganization(event.target.value)}
              className="w-full rounded-2xl border border-gold/15 bg-black/40 px-4 py-3 text-white outline-none transition-colors focus:border-gold"
              placeholder="Institution, role, or operating background"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-white">{scopeLabel}</label>
            <input
              value={scope}
              onChange={(event) => setScope(event.target.value)}
              className="w-full rounded-2xl border border-gold/15 bg-black/40 px-4 py-3 text-white outline-none transition-colors focus:border-gold"
              placeholder={scopePlaceholder}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white">{messageLabel}</label>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={8}
            className="w-full rounded-2xl border border-gold/15 bg-black/40 px-4 py-3 text-white outline-none transition-colors focus:border-gold"
            placeholder={messagePlaceholder}
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--gold)] px-6 py-4 text-sm font-semibold tracking-[0.08em] text-black transition-colors hover:bg-[var(--gold-light)] disabled:opacity-70"
        >
          {status === "loading" ? "Submitting application..." : "Submit application"}
        </button>
      </form>

      {feedback ? (
        <p className={`mt-5 text-sm leading-6 ${status === "success" ? "text-[var(--accent)]" : "text-[#ffb86c]"}`}>
          {feedback}
        </p>
      ) : null}
    </div>
  );
}
