"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Send } from "lucide-react";
import { getDictionary } from "@/lib/i18n";

const dict = getDictionary();
const f = dict.contact.form;

const inputCls =
  "w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3.5 text-sm text-frost placeholder:text-mist/50 outline-none backdrop-blur-md transition-all duration-300 focus:border-ember/50 focus:bg-ember/[0.03] focus:shadow-[0_0_24px_rgba(255,155,69,0.08)]";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const subject = encodeURIComponent(`[Site] ${data.get("type")} — ${data.get("name")}`);
    const body = encodeURIComponent(
      `Nom : ${data.get("name")}\nE-mail : ${data.get("email")}\nOrganisation : ${data.get("org")}\nProfil : ${data.get("type")}\n\n${data.get("message")}`
    );
    window.location.href = `mailto:${dict.contact.direct.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <div className="glass-deep relative overflow-hidden rounded-3xl p-8 md:p-10">
      <div
        className="animate-aurora pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(232,118,31,0.14), transparent 70%)" }}
        aria-hidden
      />

      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex min-h-[380px] flex-col items-center justify-center gap-5 text-center"
          >
            <span className="glass flex h-16 w-16 items-center justify-center rounded-full text-ember ring-glow">
              <CheckCircle2 size={28} />
            </span>
            <p className="font-display max-w-sm text-lg text-frost">{f.success}</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            className="relative flex flex-col gap-5"
            exit={{ opacity: 0, y: -16 }}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block font-display text-xs uppercase tracking-[0.2em] text-mist">
                  {f.name}
                </label>
                <input id="name" name="name" required className={inputCls} autoComplete="name" />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block font-display text-xs uppercase tracking-[0.2em] text-mist">
                  {f.email}
                </label>
                <input id="email" name="email" type="email" required className={inputCls} autoComplete="email" />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="org" className="mb-2 block font-display text-xs uppercase tracking-[0.2em] text-mist">
                  {f.org}
                </label>
                <input id="org" name="org" className={inputCls} autoComplete="organization" />
              </div>
              <div>
                <label htmlFor="type" className="mb-2 block font-display text-xs uppercase tracking-[0.2em] text-mist">
                  {f.type}
                </label>
                <select id="type" name="type" className={`${inputCls} appearance-none`} defaultValue={f.types[0]}>
                  {f.types.map((t) => (
                    <option key={t} value={t} className="bg-ink text-frost">
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="mb-2 block font-display text-xs uppercase tracking-[0.2em] text-mist">
                {f.message}
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                placeholder={f.messagePlaceholder}
                className={`${inputCls} resize-none`}
              />
            </div>

            <button type="submit" className="btn-primary mt-2 justify-center">
              {f.submit}
              <Send size={16} strokeWidth={2.2} />
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
