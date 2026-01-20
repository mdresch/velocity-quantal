import React, { useEffect, useState } from 'react'
import * as api from '../api/mockApi'

export default function OpportunityList(){
  const [opps,setOpps]=useState<any[]>([])
  const [profileId,setProfileId]=useState('p1')
  const [result,setResult]=useState<any|null>(null)

  async function load(){
    const list = await api.listOpportunities()
    setOpps(list)
  }

  useEffect(()=>{ load() },[])

  async function compare(oppId:string){
    setResult(null)
    const r = await api.matchProfileToOpportunity(profileId, oppId)
    setResult(r)
  }

  return (
    <div>
      <h3>Available Opportunities</h3>
      <label>Compare using profile id (example: p1)<br/><input value={profileId} onChange={e=>setProfileId(e.target.value)} /></label>
      <ul>
        {opps.map(o=> (
          <li key={o.id} style={{marginBottom:8}}>
            <strong>{o.title}</strong> {o.preferredAvailability?`(avail: ${o.preferredAvailability})`:''}<br/>
            <button onClick={()=>compare(o.id)}>Compare with profile</button>
            <div style={{fontSize:12,marginTop:6}}>{o.description}</div>
          </li>
        ))}
      </ul>
      {result && (
        <div style={{marginTop:12}}>
          <h4>Match: {result.fitLevel} ({result.score})</h4>
          <ul>{result.rationale.map((r:string,i:number)=>(<li key={i}>{r}</li>))}</ul>
        </div>
      )}
    </div>
  )
}
