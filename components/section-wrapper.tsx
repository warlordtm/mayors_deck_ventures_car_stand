import React from "react"

interface SectionWrapperProps {
  id?: string
  children: React.ReactNode
  className?: string
}

export function SectionWrapper({ id, children, className = "" }: SectionWrapperProps) {
  return (
    <section id={id} className={`py-20 md:py-28 ${className}`}>
      <div className="container mx-auto px-4">{children}</div>
    </section>
  )
}

export default SectionWrapper
