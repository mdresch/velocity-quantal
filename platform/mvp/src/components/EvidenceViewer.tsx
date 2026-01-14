import React, { useEffect, useState } from 'react'
import * as api from '../api/mockApi'

export default function EvidenceViewer(){
  const [pilotId,setPilotId]=useState('pilot1')
  const [items,setItems]=useState<any[]>([])

  useEffect(()=>{
    async function load(){
      const e = await api.getEvidence(pilotId)
      setItems(e)
    }
    load()
  },[pilotId])

  return (
    <div>
      <h2>Evidence Viewer</h2>
      <label>Pilot ID: <input value={pilotId} onChange={e=>setPilotId(e.target.value)} /></label>
      <div style={{marginTop:12}}>
        {items.length===0 && <div>No evidence found for this pilot.</div>}
        {items.map((it,i)=> (
          <div key={i} style={{border:'1px solid #ddd',padding:8,marginBottom:8}}>
            <strong>{it.filename||'file'}</strong>
            <div>Issuer: {it.issuer}</div>
            <div>Registry ID: {it.registryId}</div>
            <div>Issued: {it.issuedAt}</div>
            <div>Verified: {it.verified? 'yes':'no'}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
