import React, { useState } from 'react'
import * as api from '../api/mockApi'

export default function ProfileForm(){
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [availability,setAvailability]=useState<'0-5'|'6-10'|'11-20'|'21-40'|'40+'>('11-20')
  const [skills,setSkills]=useState<any>({webDev:3,mobileDev:1,dataEngineering:2,mlAi:1,marketing:2,ops:2})
  const [experience,setExperience]=useState(1)
  const [consent,setConsent]=useState(false)
  const [result,setResult]=useState<null|api.MatchResult>(null)

  async function handleSubmit(e:React.FormEvent){
    e.preventDefault()
    if(!consent){ alert('Consent required'); return }
    const payload = { name, email, availability, skills, experienceYears: experience, willingToUpskill:true, willingToPartnerLicensed:true }
    const { profileId } = await api.postProfile(payload)
    const match = await api.postMatch(profileId)
    setResult(match)
  }

  return (
    <div>
      <h2>Quick Profile (5–10 min)</h2>
      <form onSubmit={handleSubmit}>
        <label>Name<br/><input value={name} onChange={e=>setName(e.target.value)} required/></label><br/>
        <label>Email<br/><input value={email} onChange={e=>setEmail(e.target.value)} type="email" required/></label><br/>
        <label>Availability<br/>
          <select value={availability} onChange={e=>setAvailability(e.target.value as any)}>
            <option value="0-5">0-5</option>
            <option value="6-10">6-10</option>
            <option value="11-20">11-20</option>
            <option value="21-40">21-40</option>
            <option value="40+">40+</option>
          </select>
        </label><br/>
        <fieldset>
          <legend>Top skills (0–5)</legend>
          {Object.keys(skills).map(k=> (
            <label key={k}>{k} <input type="number" min={0} max={5} value={skills[k]} onChange={e=>setSkills({...skills,[k]:Number(e.target.value)})} /></label>
          ))}
        </fieldset>
        <label>Years experience<br/><input type="number" value={experience} onChange={e=>setExperience(Number(e.target.value))} /></label><br/>
        <label><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} /> I consent to verification and sharing.</label><br/>
        <button type="submit">Submit & Get Match</button>
      </form>
      {result && (
        <div style={{marginTop:16}}>
          <h3>Match Result: {result.fitLevel} ({result.score})</h3>
          <ul>{result.rationale.map((r,i)=><li key={i}>{r}</li>)}</ul>
        </div>
      )}
    </div>
  )
}
