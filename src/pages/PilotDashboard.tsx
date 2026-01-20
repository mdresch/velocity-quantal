import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPilot } from '../services/pilots'

export const PilotDashboard: FC = () => {
  const { id } = useParams()
  const [pilot, setPilot] = useState<any | null>(null)

  useEffect(() => {
    if (!id) return
    getPilot(id).then((p) => setPilot(p))
  }, [id])

  if (!pilot) {
    return (
      <div className="fade-in">
        <h1 className="text-2xl font-bold text-[#f8fafc]">Pilot</h1>
        <p className="mt-4 text-[#94a3b8]">Loading or pilot not found.</p>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#f8fafc]">{pilot.title}</h1>
          <p className="mt-1 text-[#94a3b8]">Pilot ID: {pilot.id}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-[#2e3244] bg-[#161821] p-6">
          <h3 className="text-lg font-bold text-[#f8fafc]">Summary</h3>
          <p className="mt-2 text-[#94a3b8]">Owner: {pilot.owner}</p>
          <p className="mt-1 text-[#94a3b8]">Team: {(pilot.team || []).join(', ')}</p>
          <p className="mt-1 text-[#94a3b8]">Status: {pilot.status}</p>
        </div>

        <div className="rounded-2xl border border-[#2e3244] bg-[#161821] p-6">
          <h3 className="text-lg font-bold text-[#f8fafc]">Evidence</h3>
          <p className="mt-2 text-[#94a3b8]">No evidence viewer implemented in prototype.</p>
        </div>
      </div>
    </div>
  )
}

export default PilotDashboard
