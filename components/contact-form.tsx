"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
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
      // Simulate sending message (replace with actual email service or API)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate delay

      setStatus({ ok: true, message: "Thank you, your message has been submitted." })
      setName("")
      setEmail("")
      setMessage("")
    } catch (err: any) {
      setStatus({ ok: false, message: err?.message || "An unexpected error occurred." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.form
      id="contact"
      onSubmit={submit}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        damping: 20,
        stiffness: 100
      }}
      className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-8 shadow-2xl shadow-black/5"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-center"
      >
        <h3 className="mb-4 text-2xl font-bold text-foreground">Get in touch</h3>
        <p className="mb-6 text-sm text-muted-foreground">Send us a message and our team will respond within 24 hours.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="grid gap-4 sm:grid-cols-2"
      >
        <motion.label
          whileFocus={{ scale: 1.02 }}
          className="flex w-full flex-col"
        >
          <span className="mb-2 text-sm text-muted-foreground">Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-md border border-border bg-transparent px-3 py-2 text-foreground transition-all duration-300 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none"
            required
          />
        </motion.label>
        <motion.label
          whileFocus={{ scale: 1.02 }}
          className="flex w-full flex-col"
        >
          <span className="mb-2 text-sm text-muted-foreground">Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-border bg-transparent px-3 py-2 text-foreground transition-all duration-300 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none"
            type="email"
            required
          />
        </motion.label>
      </motion.div>

      <motion.label
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        whileFocus={{ scale: 1.01 }}
        className="mt-4 flex flex-col"
      >
        <span className="mb-2 text-sm text-muted-foreground">Message</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[120px] rounded-md border border-border bg-transparent px-3 py-2 text-foreground transition-all duration-300 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none resize-none"
          required
        />
      </motion.label>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-6 flex flex-col items-center gap-4"
      >
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="inline-flex h-12 items-center justify-center rounded-md bg-accent px-6 font-semibold text-black disabled:opacity-60 shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300 cursor-pointer"
        >
          {loading ? "Sending..." : "Send Message"}
        </motion.button>
        {status && (
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`text-sm text-center ${status.ok ? "text-emerald-400" : "text-rose-400"}`}
          >
            {status.message}
          </motion.p>
        )}
      </motion.div>
    </motion.form>
  )
}

export default ContactForm
