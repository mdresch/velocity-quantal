import React, { useState } from 'react'
import * as api from '../api/mockApi'

export default function OpportunityForm(){
  const [title,setTitle]=useState('')
  const [description,setDescription]=useState('')
  const [skillsText,setSkillsText]=useState('webDev:3,dataEngineering:2')
  const [availability,setAvailability]=useState<'0-5'|'6-10'|'11-20'|'21-40'|'40+' | ''>('')
  const [requiredCerts,setRequiredCerts]=useState('')
  const [requiresLicensed,setRequiresLicensed]=useState(false)
  const [message,setMessage]=useState('')

  function parseSkills(text:string){
    const out:any = {}
    text.split(',').map(s=>s.trim()).filter(Boolean).forEach(pair=>{
      const [k,v] = pair.split(':').map(x=>x.trim())
      if(k){ out[k]=Number(v||3) }
    })
    return out
  }

  async function handleSubmit(e:React.FormEvent){
    e.preventDefault()
    const requiredSkills = parseSkills(skillsText)
    const reqCerts = requiredCerts.split(',').map(s=>s.trim()).filter(Boolean)
    const { opportunityId } = await api.postOpportunity({ title, description, requiredSkills, preferredAvailability: availability as any, requiredCerts: reqCerts, requiresLicensedPartner: requiresLicensed })
    setMessage(`Opportunity created: ${opportunityId}`)
  }

  return (
    <div>
      <h3>Create Opportunity (Mentor)</h3>
      <form onSubmit={handleSubmit}>
        <label>Title<br/><input value={title} onChange={e=>setTitle(e.target.value)} required/></label><br/>
        <label>Description<br/><textarea value={description} onChange={e=>setDescription(e.target.value)} /></label><br/>
        <label>Required skills (comma list, e.g. webDev:4,dataEngineering:3)<br/><input value={skillsText} onChange={e=>setSkillsText(e.target.value)} /></label><br/>
        <label>Preferred availability<br/>
          <select value={availability} onChange={e=>setAvailability(e.target.value as any)}>
            <option value="">(any)</option>
            <option value="0-5">0-5</option>
            <option value="6-10">6-10</option>
            <option value="11-20">11-20</option>
            <option value="21-40">21-40</option>
            <option value="40+">40+</option>
          </select>
        </label><br/>
        <label>Required certifications (comma separated)<br/><input value={requiredCerts} onChange={e=>setRequiredCerts(e.target.value)} /></label><br/>
        <label><input type="checkbox" checked={requiresLicensed} onChange={e=>setRequiresLicensed(e.target.checked)} /> Requires licensed partner</label><br/>
        <button type="submit">Create Opportunity</button>
      </form>
      {message && <div style={{marginTop:12}}>{message}</div>}
    </div>
  )
}
