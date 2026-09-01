'use client'

import { useEffect, useState } from 'react'

export function DnaHelix() {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => setPhase((value) => value + 1), 80)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="dna-visual" aria-label="Animated DNA-inspired molecular visualization" role="img">
      <div className="dna-grid" />
      {Array.from({ length: 15 }).map((_, index) => {
        const angle = ((index + phase) * 18) * (Math.PI / 180)
        const left = 50 + Math.sin(angle) * 27
        const right = 50 - Math.sin(angle) * 27
        const top = 8 + index * 6
        return (
          <div className="dna-row" key={index} style={{ top: `${top}%` }}>
            <span className="dna-node" style={{ left: `${left}%` }} />
            <span className="dna-node dna-node-right" style={{ left: `${right}%` }} />
            <span className="dna-rung" style={{ left: `${Math.min(left, right)}%`, width: `${Math.abs(left - right)}%` }} />
          </div>
        )
      })}
      <span className="sr-only">A continuously moving molecular double helix</span>
    </div>
  )
}
