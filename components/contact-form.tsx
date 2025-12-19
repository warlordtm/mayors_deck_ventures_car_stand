"use client"

import React, { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<null | { ok: boolean; message: string }>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus(null)

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus({ ok: false, message: "Please fill out all fields." })
      return
    }

    // simple email check
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setStatus({ ok: false, message: "Please provide a valid email address." })
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("contact_messages").insert({ name, email, message })

      if (error) {
        setStatus({ ok: false, message: error.message })
      } else {
        setStatus({ ok: true, message: "Thank you — your message has been submitted." })
        setName("")
        setEmail("")
        setMessage("")
      }
    } catch (err: any) {
      setStatus({ ok: false, message: err?.message || "An unexpected error occurred." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form id="contact" onSubmit={submit} className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-8">
      <h3 className="mb-4 text-2xl font-bold text-white">Get in touch</h3>
      <p className="mb-6 text-sm text-zinc-400">Send us a message and our team will respond within 24 hours.</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex w-full flex-col">
          <span className="mb-2 text-sm text-zinc-300">Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-md border border-border bg-transparent px-3 py-2 text-white placeholder:text-zinc-500"
            placeholder="Your full name"
            required
          />
        </label>
        <label className="flex w-full flex-col">
          <span className="mb-2 text-sm text-zinc-300">Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-border bg-transparent px-3 py-2 text-white placeholder:text-zinc-500"
            placeholder="you@domain.com"
            type="email"
            required
          />
        </label>
      </div>

      <label className="mt-4 flex flex-col">
        <span className="mb-2 text-sm text-zinc-300">Message</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[120px] rounded-md border border-border bg-transparent px-3 py-2 text-white placeholder:text-zinc-500"
          placeholder="How can we help you today?"
          required
        />
      </label>

      <div className="mt-6 flex items-center justify-between">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 items-center justify-center rounded-md bg-accent px-6 font-semibold text-black disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
        {status && (
          <p className={`text-sm ${status.ok ? "text-emerald-400" : "text-rose-400"}`}>{status.message}</p>
        )}
      </div>
    </form>
  )
}

export default ContactForm
