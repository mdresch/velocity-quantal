---
title: "Velocity Quantal — Technical Specifications (Low / No CapEx)"
owner: "@mdresch"
authors:
  - "Menno Drescher"
version: "0.1.0"
date: "2026-01-14"
status: "draft"
---

Summary
-------
This document captures technical specifications for the Velocity Quantal platform with a strict goal: enable product pilots and partner submissions with minimal upfront capital expenditure (low/no CapEx). The architecture favors serverless, pay-for-what-you-use services, managed databases, and a small operations footprint.

Goals & Constraints
-------------------
- Low / No CapEx: avoid VM fleets or large reserved infrastructure during MVP/pilot.
- Fast time-to-MVP: deliver an end-to-end RAG demo, evidence collection and partner-ready artifacts in 2–6 weeks.
- Partner compatibility: support multi-provider inference (OpenAI/Anthropic/other) and partner evidence workflows (screenshots, invoices, deployment IDs).
- Security & Compliance: follow least-privilege, data governance, and retention best-practices.
- Cost controls: default throttles, batching, and autoscale to limit bill shock.

High-level Architecture
-----------------------
Components (serverless-first):
- Frontend: React + Vite (static SPA served from CDN / object storage).
- API layer: Serverless Functions (Azure Functions / AWS Lambda / GCP Cloud Functions) behind API Gateway.
- Auth: OAuth2 / OIDC (Azure AD / GitHub / Google) + short-lived session JWTs.
- Persistent storage:
  - Document store & transactional data: serverless NoSQL (Azure Cosmos DB / DynamoDB / Firestore).
  - Vector search (embeddings): managed vector DB or vector-capable search (Pinecone / Milvus Cloud / Azure Cognitive Search / Elastic Vector / Qdrant).
  - File/evidence storage: object store (S3 / Azure Blob / GCS) with pre-signed upload URLs.
- Inference: hosted provider APIs (OpenAI, Anthropic, Azure OpenAI) invoked from serverless functions.
- Caching & queueing: CDN + Redis-lite or managed cache (Azure Cache for Redis) and message queue (SQS / Service Bus / Pub/Sub) for long-running jobs.
- CI/CD: GitHub Actions for build/test/deploy.
- IaC: Terraform (recommended) or Bicep/CloudFormation for reproducible stacks.

Data Flow (RAG example)
------------------------
1. Ingest: user uploads evidence (PDF, screenshot, transcript) via frontend → pre-signed upload to object store.
2. Processing job enqueued: ingest function triggers (via queue) to extract text (Tika / vendor OCR) and create embeddings.
3. Store: raw doc metadata → NoSQL, embeddings → Vector DB, file pointer → object store.
4. Query: user asks question via UI → frontend posts to Query API.
5. Retrieve: API calls Vector DB for nearest neighbors (k results) → constructs RAG prompt.
6. Inference: call chosen model provider with prompt → response returned to user and persisted with provenance.

Key Design Patterns
-------------------
- Adapter Pattern for Providers: wrap model provider APIs behind an interface so you can swap or multi-plex between OpenAI, Anthropic, or self-hosted models.
- RAG with Provenance: always include source pointers (file ID, line offsets, URL) and embeddings similarity scores.
- Event-driven ingestion: decouple uploads from heavy processing using message queues to limit memory and cold-start impact.
- Cost-conscious embedding strategy: use short-form dense retrieval (chunking + min tokenization) and store embeddings with metadata.
- Throttling & graceful degradation: if inference rate limit hit, fall back to cached answers or a reduced search-only response.

Data Model (examples)
---------------------
- evidence_item (NoSQL document)
  - id: uuid
  - workspaceId: string
  - uploadedBy: userId
  - filename: string
  - fileUrl: s3://...
  - fileType: pdf|png|jpg|txt
  - ingestionStatus: pending|processing|ready|failed
  - createdAt, updatedAt

- embedding_record (vector DB document)
  - id: uuid
  - evidenceId: uuid
  - chunkIndex: int
  - text: string
  - vector: [float]
  - metadata: {sourceOffset, page, length}
  - scoreOptional: float

- query_session
  - id: uuid
  - userId
  - prompt
  - returnedAnswer
  - sources: [evidenceId:chunkIndex]
  - modelUsed: openai-gpt-4o/claude-2
  - costTokens / costEstimate
  - createdAt

API Surface (MVP)
-----------------
- POST /api/auth/login → OAuth redirect / token exchange
- POST /api/evidence/upload-url → returns pre-signed URL (body: filename, contentType)
- POST /api/evidence/ingest → notify system of new file (triggers ingestion job)
- GET /api/evidence/{id} → metadata
- POST /api/query → {prompt, workspaceId, options} → returns {answer, sources, modelUsed}
- GET /api/health → readiness / liveness

Sample API contract for /api/query (JSON)
{
  "prompt": "Summarize the customer's compliance evidence",
  "workspaceId": "w-abc123",
  "topK": 5,
  "provider": "auto" // or openai/anthropic
}

Security & Governance
---------------------
- Secrets: store in Key Vault / Secrets Manager; never bake into images.
- Least privilege: per-function identities and RBAC policies for DB and storage.
- Data isolation: partition data by workspaceId/tenant; avoid cross-tenant leakage.
- PII handling: classify files on ingest; apply redaction or separate processing lanes for sensitive data.
- Audit logging: immutable logs for ingestion, queries, and provider calls (include request IDs).

Cost Controls & Estimation
--------------------------
- Use serverless autoscale and pay-per-request for functions.
- Keep inference provider usage metered and meter by environment (dev vs pilot vs prod).
- Implement embedding caching and reuse across similar uploads to reduce API calls.
- Example small pilot cost drivers:
  - Storage: negligible (object storage + replication)
  - Vector DB: small monthly cost depending on chosen vendor and dataset size (~$50–$500 for small pilots)
  - Inference: main variable; use trial credits when possible; estimate per-query $0.01–$0.50 depending on model.

Operational Runbook (MVP)
-------------------------
- Onboard: create workspace, set up OAuth, provision storage and DB, configure provider keys.
- Ingest flow test: upload sample evidence, verify ingestionStatus -> ready, verify embeddings count.
- Query test: issue sample queries, validate returned sources and answer grounding.
- Evidence export: produce ZIP of evidence artifacts for partner submission.

Monitoring & Observability
--------------------------
- App metrics: request rates, latency, error rates (Prometheus / Cloud Monitor / App Insights)
- Cost metrics: provider token usage, embedding calls, storage volumes
- Business KPIs: pilot time-to-value, number of validated evidence submissions, partner acceptance rate

CI/CD & Deployment
------------------
- Use GitHub Actions:
  - Lint, build, unit tests
  - Deploy frontend to CDN (Netlify / Azure Static Web Apps / S3+CloudFront)
  - Deploy functions via IaC (Terraform apply with environment vars)
- Releases: tag-based; create a deploy preview for partner demos

Infrastructure as Code
---------------------
- Provide Terraform modules for:
  - serverless functions + API gateway
  - NoSQL database + containerized vector DB endpoint or managed vector DB config
  - object storage + access policy
  - secrets + identity bindings

MVP Acceptance Criteria
-----------------------
- Upload evidence and confirm ingestion with embeddings persisted.
- Query returns coherent, grounded answers with 3+ source pointers.
- Evidence export package produced with required artifacts for partner submission.
- Authentication, authorization, and audit logging enabled.

Deliverables (MVP)
------------------
- `platform/mvp` repo with minimal frontend, function handlers, ingestion pipeline, and Terraform skeleton.
- `Docs/evidence-template.md` to capture pilot measurements and artifacts.
- 3 seeded pilot case studies in `Docs/case-study-<n>.md` with KPIs.

Next Practical Steps
--------------------
1. Create `platform/mvp` repo scaffold (React + Vite + function examples).
2. Add `Docs/evidence-template.md` and 3 pilot case study drafts.
3. Provision minimal managed services using provider trial credits.
4. Run first pilot and capture evidence for partner program submissions.

Appendix: Minimal Dev Commands
-----------------------------
# Install
npm install
# Run dev frontend
npm run dev
# Run tests
npm test
# Deploy (example)
terraform init && terraform apply -var-file=env/dev.tfvars

---
Updated 2026-01-14: initial technical specifications for low/no CapEx Velocity Quantal MVP.
