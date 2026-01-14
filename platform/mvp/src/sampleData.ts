export const sampleProfiles = [
  { id:'p1', name:'Alice', email:'alice@example.com', availability:'40+', skills:{webDev:5,dataEngineering:4,mlAi:3,marketing:2,ops:3}, experienceYears:3, certifications:[], willingToUpskill:true, willingToPartnerLicensed:true },
  { id:'p2', name:'Bas', email:'bas@example.com', availability:'21-40', skills:{webDev:3,dataEngineering:2,mlAi:1,marketing:2,ops:3}, experienceYears:6, certifications:[{name:'Clinical Tech',issuer:'RegBoard',id:'VER-123',verified:true}], willingToUpskill:false, willingToPartnerLicensed:false },
  { id:'p3', name:'Carol', email:'carol@example.com', availability:'6-10', skills:{webDev:1,dataEngineering:1,mlAi:0,marketing:2,ops:1}, experienceYears:0, certifications:[], willingToUpskill:true, willingToPartnerLicensed:true }
]

export const samplePilots = [
  { id:'pilot1', title:'Local marketplace content', protectedFlag:false },
  { id:'pilot2', title:'Clinical data collection pilot', protectedFlag:true },
  { id:'pilot3', title:'Medical device calibration', protectedFlag:true }
]

export const sampleOpportunities = [
  { id:'opp1', title:'Marketplace QA and content curation', description:'Short-term content curation and tagging project', requiredSkills:{webDev:3,marketing:3}, preferredAvailability:'11-20', requiredCerts:[], requiresLicensedPartner:false },
  { id:'opp2', title:'Clinical recruitment coordination', description:'Coordination role requiring verified clinical certification', requiredSkills:{ops:3}, preferredAvailability:'21-40', requiredCerts:['Clinical'], requiresLicensedPartner:true }
]
