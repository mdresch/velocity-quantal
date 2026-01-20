import React, { useState } from 'react'
import * as api from '../api/mockApi'

export default function PilotForm(){
  const [title,setTitle]=useState('')
  const [description,setDescription]=useState('')
  const [jurisdiction,setJurisdiction]=useState('')
  const [protectedFlag,setProtectedFlag]=useState(false)
  const [evidenceNote,setEvidenceNote]=useState('')
  const [message,setMessage]=useState('')

  async function handleSubmit(e:React.FormEvent){
    e.preventDefault()
    if(protectedFlag && evidenceNote.trim()===''){ alert('Protected pilots require evidence or partner-fallback note'); return }
    const { pilotId } = await api.postPilot({ title, description, jurisdiction, protectedFlag, evidenceNote })
    setMessage(`Pilot created: ${pilotId}`)
  }

  return (
    <div>
      <h2>Submit Pilot</h2>
      <form onSubmit={handleSubmit}>
        <label>Title<br/><input value={title} onChange={e=>setTitle(e.target.value)} required/></label><br/>
        <label>Description<br/><textarea value={description} onChange={e=>setDescription(e.target.value)} required/></label><br/>
        <label>Jurisdiction<br/><input value={jurisdiction} onChange={e=>setJurisdiction(e.target.value)} /></label><br/>
        <label><input type="checkbox" checked={protectedFlag} onChange={e=>setProtectedFlag(e.target.checked)} /> Protected activity</label><br/>
        {protectedFlag && (
          <label>Evidence or partner fallback note (required)<br/><input value={evidenceNote} onChange={e=>setEvidenceNote(e.target.value)} required/></label>
        )}
        <br/>
        <button type="submit">Create Pilot</button>
      </form>
      {message && <div style={{marginTop:12}}>{message}</div>}
    </div>
  )
}
