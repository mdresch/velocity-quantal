import type { FC } from 'react'
import { useState } from 'react'
import { createPilot } from '../services/pilots'
import { useNavigate } from 'react-router-dom'

interface Props {
  opportunityId?: number | string
  opportunityTitle?: string
  onClose: () => void
}

export const StartPilotModal: FC<Props> = ({ opportunityId, opportunityTitle, onClose }) => {
  const navigate = useNavigate()
  const [title, setTitle] = useState(opportunityTitle ? `${opportunityTitle} — Pilot` : '')
  const [team, setTeam] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { pilotId } = await createPilot({
        title: title || 'Untitled Pilot',
        opportunityId,
        owner: 'current-user',
        team: team ? team.split(',').map((s) => s.trim()) : [],
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      })
      onClose()
      navigate(`/pilot/${pilotId}`)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
      <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-2xl bg-[#0b1020] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Start Pilot</h2>
          <button type="button" onClick={onClose} className="text-sm text-[#94a3b8]">Close</button>
        </div>

        <div className="mt-4 grid gap-3">
          <label className="text-sm text-[#94a3b8]">Pilot Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-md bg-[#0f1724] p-2 text-[#f8fafc]" />

          <label className="text-sm text-[#94a3b8]">Team (comma-separated emails)</label>
          <input value={team} onChange={(e) => setTeam(e.target.value)} className="rounded-md bg-[#0f1724] p-2 text-[#f8fafc]" />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-[#94a3b8]">Start Date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rounded-md bg-[#0f1724] p-2 text-[#f8fafc]" />
            </div>
            <div>
              <label className="text-sm text-[#94a3b8]">End Date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="rounded-md bg-[#0f1724] p-2 text-[#f8fafc]" />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button type="submit" disabled={loading} className="rounded-xl bg-blue-600 px-4 py-2 text-white">Create Pilot</button>
            <button type="button" onClick={onClose} className="rounded-xl border border-[#2e3244] px-4 py-2 text-[#f8fafc]">Cancel</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default StartPilotModal
