# HACKATHON_CONTEXT.md
# LogiPulse — Master Implementation Context & Build Contract

> **STATUS: LOCKED IMPLEMENTATION SPECIFICATION**
>
> This document is the single source of truth for building LogiPulse.
> Antigravity must read and follow this document before modifying the repository.
>
> **Execution rule:** Build **P0 completely first**, test it, verify the P0 acceptance criteria, and create a Git checkpoint/commit. Only after P0 is accepted may P1 be implemented and committed separately. P2 is not to be implemented unless explicitly authorized.

---

# SECTION 1 — PROJECT OVERVIEW

## PROJECT NAME

**LogiPulse**

## ONE-LINE DESCRIPTION

A predictive logistics operations platform that forecasts workload, measures process-level efficiency, identifies workforce capacity gaps and bottlenecks, and recommends proactive resource redistribution.

## PROBLEM BEING SOLVED

Logistics operations lack a unified, data-driven mechanism to measure operational effectiveness and proactively plan workforce capacity across inbound, outbound, and inventory processes.

Current challenges include:

- no standardized process-level efficiency yardstick
- limited inbound/outbound workload forecasting
- difficulty estimating manpower from projected demand
- limited visibility into operational trends
- reactive workforce/resource planning
- difficulty aligning workforce capacity with expected demand
- difficulty identifying underutilized and overutilized operational areas
- difficulty identifying capacity gaps and bottlenecks
- lack of actionable resource-allocation recommendations

## WHY THIS PROBLEM MATTERS

Operational leaders need to understand:

1. what workload is occurring now
2. what workload is likely to occur next
3. how much workforce capacity will be required
4. whether available capacity is sufficient
5. where operational bottlenecks are forming
6. where excess capacity exists
7. how capacity can proactively be redistributed

The product should help move the organization from **reactive resource planning** to **predictive capacity planning**.

## TARGET USERS

Logistics operations leadership.

## PRIMARY USER

**Logistics Manager / Operational Leader**

The user is responsible for:

- logistics operations
- workforce/capacity planning
- process-level operational decisions
- identifying bottlenecks
- allocating resources across operational areas

## CORE VALUE PROPOSITION

**Predict workload → calculate workforce requirement → compare capacity → detect bottlenecks → recommend proactive resource redistribution.**

---

# SECTION 2 — CONFIRMED REQUIREMENTS

## CONFIRMED REQUIREMENTS

The MVP must provide:

1. Authentication for one Logistics Manager.
2. Unified logistics operations dashboard.
3. Inbound analytics.
4. Outbound analytics.
5. Inventory analytics.
6. Historical operational trends.
7. Process-level efficiency measurement.
8. Workload forecasting.
9. Workforce requirement estimation.
10. Required-vs-available workforce analysis.
11. Capacity-gap detection.
12. Bottleneck detection.
13. Underutilization detection.
14. Overutilization detection.
15. Proactive resource allocation recommendations.

## SAFE ASSUMPTIONS

The following implementation assumptions are locked for the hackathon:

- Synthetic historical logistics data is acceptable.
- Approximately 60–90 days of synthetic data is sufficient for the MVP.
- Forecasting can use a lightweight statistical/time-series method.
- Workforce capacity can be represented as aggregate operational-area capacity.
- Recommendation calculations should be deterministic and explainable.
- MongoDB Atlas is the external database service.
- AWS EC2 hosts the application/backend runtime.
- The frontend and backend communicate through REST.
- A single Logistics Manager role is sufficient.
- The MVP does not require real-time streaming.

## CONSTRAINTS

- Exactly 2 developers.
- Approximately 6 hours for development, testing, deployment, and demo.
- P0 is mandatory.
- P1 is secondary.
- P2 is optional.
- Architecture must remain simple.
- Database is MongoDB + Mongoose.
- Backend is Node.js + Express.
- Frontend is React + TypeScript + Tailwind CSS + Create React App.
- Authentication is JWT + bcrypt/bcryptjs.
- MongoDB is hosted on MongoDB Atlas.
- AWS usage is intentionally minimal: EC2 + IAM.
- No unnecessary infrastructure.

## DO NOT ASSUME

Do not invent:

- additional user roles
- employee-level performance requirements
- new database collections
- new APIs
- additional AWS services
- complex AI requirements
- real-time requirements
- enterprise integrations
- mobile requirements
- unconfirmed business rules

If an implementation blocker genuinely requires a contract change, stop and report the proposed change rather than silently changing the contract.

---

# SECTION 3 — USERS & PRIMARY JOURNEY

## USER ROLES

Only:

```text
LOGISTICS_MANAGER
```

## USER PERMISSIONS

The Logistics Manager can:

- authenticate
- view logistics dashboard
- view operational data
- view forecasts
- view workforce/capacity analysis
- view bottlenecks
- view recommendations
- update recommendation status

No admin role is required.

## PRIMARY USER JOURNEY

```text
1. User opens application
2. User reaches Login
3. User enters Logistics Manager credentials
4. Frontend calls POST /api/auth/login
5. Backend verifies bcrypt password
6. Backend generates JWT
7. Frontend stores authentication state
8. User enters Dashboard
9. Frontend calls GET /api/dashboard
10. Backend aggregates operational data
11. Historical workload/trends are shown
12. Forecasted workload is shown
13. Required workforce is calculated
14. Available workforce is compared against required workforce
15. Capacity gap is identified
16. Bottleneck is identified
17. Under/overutilized areas are identified
18. Excess-capacity areas are matched with shortage areas
19. Resource allocation recommendation is shown
20. Manager can update recommendation status
```

## PRIMARY DEMO JOURNEY

The primary demo is:

```text
Login
  ↓
Dashboard
  ↓
Current operational KPIs
  ↓
Inbound / Outbound / Inventory trends
  ↓
Workload forecast
  ↓
Required workforce
  ↓
Available workforce
  ↓
Capacity gap
  ↓
Bottleneck
  ↓
Under/overutilized operational area
  ↓
Proactive resource allocation recommendation
  ↓
Manager accepts/updates recommendation
```

This is the most important end-to-end flow.

---

# SECTION 4 — MVP CONTRACT

## PROJECT

LogiPulse

## PROBLEM

Logistics operations lack a unified predictive mechanism to measure process efficiency, forecast workload, determine workforce capacity needs, identify bottlenecks/gaps, and proactively allocate resources.

## TARGET USER

Logistics Manager / Operational Leader

## CORE VALUE

Move logistics resource planning from reactive decisions to proactive, data-driven capacity planning.

---

## P0 — MUST BUILD

### P0.1 Authentication

- One Logistics Manager.
- Login using email/password.
- Password stored as bcrypt/bcryptjs hash.
- JWT authentication.
- Protected product APIs.
- Frontend login/logout flow.

### P0.2 Unified Dashboard

Dashboard must display:

- inbound workload
- outbound workload
- inventory volume
- required workforce
- available workforce
- capacity gap
- average efficiency
- average utilization
- active bottlenecks
- pending recommendations

### P0.3 Operational Analytics

Support:

- inbound
- outbound
- inventory
- historical trends
- operational areas
- process-level status

### P0.4 Process Efficiency

Calculate operational efficiency at process/area level.

Preferred:

```text
efficiency =
(completedWorkload / plannedWorkload) * 100
```

### P0.5 Workload Forecasting

Forecast future workload from historical operations.

Use a lightweight deterministic statistical/time-series method.

### P0.6 Workforce Requirement

Calculate required workforce from forecast workload and capacity assumptions.

Preferred:

```text
requiredWorkforce =
ceil(forecastWorkload / capacityPerWorker)
```

### P0.7 Capacity Analysis

Calculate:

```text
capacityGap =
availableWorkforce - requiredWorkforce
```

Interpret:

```text
negative = shortage
zero = balanced
positive = excess
```

### P0.8 Utilization

Calculate operational utilization.

Preferred:

```text
utilization =
(workload / processingCapacity) * 100
```

Interpretation:

```text
< 70% = UNDERUTILIZED
70–90% = NORMAL
90–100% = HIGH
> 100% = OVERUTILIZED
```

### P0.9 Bottleneck Detection

Detect operational areas with capacity constraints.

Potential triggers:

```text
capacityGap < 0
```

and/or:

```text
utilization > 100
```

### P0.10 Resource Allocation Recommendation

Identify:

- areas with excess capacity
- areas with workforce shortages

Then calculate:

```text
recommendedResources =
min(sourceExcess, targetShortage)
```

### P0.11 Under/Overutilization

Show operational areas that are:

- underutilized
- normal
- highly utilized
- overutilized

---

# P1 — SHOULD BUILD

Implement only after P0 is stable.

- Peak/non-peak operational analysis
- Operational risk indicators
- Delivery-delay risk analysis
- Simple traffic/weather contributing-factor information

Traffic/weather must NOT be treated as causal proof.

Use wording such as:

```text
Possible contributing factor
```

rather than:

```text
Traffic caused the delay
```

No real-time integration.

---

# P2 — IF TIME

Only after P0 and P1 are stable:

- what-if workload scenarios
- natural-language explanations of forecasts/recommendations

---

# P3 — DO NOT BUILD

- employee-level productivity analytics
- employee rankings
- employee scoring
- employee performance tracking
- multiple roles
- admin panel
- registration
- forgot password
- OAuth/social login
- real-time workforce tracking
- GPS tracking
- Kafka
- WebSockets
- Socket.IO
- Redis
- message queues
- microservices
- Kubernetes
- RAG
- vector database
- AI agents
- enterprise integrations
- mobile application
- complex event-driven architecture

---

## TOTAL DEVELOPMENT TARGET

6 hours.

## SAFETY BUFFER

Reserve approximately 30–60 minutes for:

- integration bugs
- deployment
- demo preparation
- unexpected failures

## BIGGEST MVP RISK

Trying to implement too much before the complete P0 flow works.

## FALLBACK PLAN

If time becomes tight:

1. Stop P1/P2.
2. Stabilize P0.
3. Use synthetic data.
4. Use deterministic forecasting.
5. Use deterministic workforce/capacity/recommendation calculations.
6. Ensure the end-to-end demo works.

---

# SECTION 5 — FINAL TECH STACK

## FRONTEND

- Framework: React
- Language: TypeScript
- Build tool: Create React App
- Styling: Tailwind CSS
- State management: React Context/local state
- Routing: React Router
- Charts: Recharts or equivalent
- HTTP client: Axios or fetch

**Do NOT migrate to Vite unless explicitly instructed.**

## BACKEND

- Runtime: Node.js
- Language: JavaScript
- Framework: Express
- API style: REST
- Database library: Mongoose
- Authentication: JWT
- Password hashing: bcrypt/bcryptjs
- Validation: lightweight validation library or clean middleware validation

## DATABASE

- Database: MongoDB
- ODM: Mongoose
- Hosting: MongoDB Atlas
- Environment: Cloud

## AI

- Required for P0: No LLM
- Forecasting: lightweight statistical/time-series calculation
- Provider: none required
- Embeddings: none
- Vector DB: none
- RAG: none
- Agent: none

## OTHER SERVICES

Required:

- MongoDB Atlas
- AWS EC2
- AWS IAM

Optional P1:

- external traffic/weather APIs

No other services are required.

---

# SECTION 6 — ARCHITECTURE CONTRACT

## ARCHITECTURE STYLE

Simple modular monolith.

```text
React Frontend
      |
      | HTTPS / REST
      v
Node.js + Express
      |
      +-- Auth
      +-- Dashboard
      +-- Operations
      +-- Forecasting
      +-- Workforce
      +-- Capacity
      +-- Bottlenecks
      +-- Recommendations
      |
      v
Mongoose
      |
      v
MongoDB Atlas
```

## COMPONENTS

### Frontend

React + TypeScript + Tailwind + CRA.

### Backend

Node.js + Express modular monolith.

### Database

MongoDB Atlas through Mongoose.

### Authentication

JWT + bcrypt/bcryptjs.

### AI

No complex AI infrastructure.

### External APIs

None required for P0.

### File storage

None required.

### AWS

EC2 + IAM.

### Deployment

Application/backend on EC2, database on MongoDB Atlas.

---

## ARCHITECTURE RULE

Use a simple modular architecture suitable for a 6-hour hackathon.

Do NOT introduce:

- microservices
- Kubernetes
- Redis
- message queues
- WebSockets
- Kafka
- complex event-driven architecture
- RAG
- vector databases
- AI agents
- unnecessary infrastructure

---

# SECTION 7 — DATABASE CONTRACT

## DATABASE

MongoDB

## HOSTING

MongoDB Atlas

## ODM

Mongoose

## CORE COLLECTIONS

Exactly:

```text
users
operations
forecasts
capacity
bottlenecks
recommendations
```

Inventory is represented through:

```text
operations.operationType = INVENTORY
```

Do not create a separate inventory collection for the MVP.

---

## 7.1 USERS

Purpose:

Store the Logistics Manager authentication record.

```text
_id: ObjectId
name: String, required
email: String, required, unique, lowercase, trimmed
passwordHash: String, required
role: "LOGISTICS_MANAGER", required
isActive: Boolean, default true
createdAt: Date
updatedAt: Date
```

Index:

```text
email: unique
```

---

## 7.2 OPERATIONS

Purpose:

Primary historical/current operational data.

```text
_id: ObjectId
date: Date, required
operationType: "INBOUND" | "OUTBOUND" | "INVENTORY", required
operationalArea: String, required
workload: Number, required
plannedWorkload: Number
completedWorkload: Number
processingCapacity: Number
availableWorkforce: Number
requiredWorkforce: Number
processingTime: Number
delayRate: Number
efficiency: Number
utilization: Number
status: "NORMAL" | "DELAYED" | "AT_RISK" | "COMPLETED"
createdAt: Date
updatedAt: Date
```

Areas:

```text
Receiving
Putaway
Picking
Packing
Shipping
Inventory
```

Indexes:

```text
date
operationType + date
operationalArea + date
```

---

## 7.3 FORECASTS

```text
_id: ObjectId
forecastDate: Date, required
operationType: "INBOUND" | "OUTBOUND" | "INVENTORY", required
operationalArea: String
forecastedVolume: Number, required
modelName: String, required
confidence: Number
modelVersion: String
createdAt: Date
updatedAt: Date
```

Indexes:

```text
forecastDate + operationType
operationalArea + forecastDate
```

---

## 7.4 CAPACITY

```text
_id: ObjectId
planningDate: Date, required
operationType: String, required
operationalArea: String, required
forecastWorkload: Number, required
requiredWorkforce: Number, required
availableWorkforce: Number, required
capacityGap: Number, required
utilization: Number, required
status: "UNDER_CAPACITY" | "BALANCED" | "OVER_CAPACITY", required
riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
forecastReference: ObjectId
createdAt: Date
updatedAt: Date
```

Indexes:

```text
planningDate + operationType
operationalArea + planningDate
```

---

## 7.5 BOTTLENECKS

```text
_id: ObjectId
planningDate: Date, required
operationType: String, required
operationalArea: String, required
workload: Number, required
availableWorkforce: Number, required
requiredWorkforce: Number, required
capacityGap: Number, required
utilization: Number, required
severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL", required
status: "OPEN" | "RESOLVED", required
reason: String, required
createdAt: Date
updatedAt: Date
```

Indexes:

```text
planningDate + operationalArea
severity + status
```

---

## 7.6 RECOMMENDATIONS

```text
_id: ObjectId
recommendationDate: Date, required
sourceArea: String, required
targetArea: String, required
operationType: String, required
recommendedResources: Number, required
sourceAvailableCapacity: Number
targetCapacityGap: Number
reason: String, required
priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL", required
expectedImpact: String
status: "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED", required
bottleneckReference: ObjectId
capacityReference: ObjectId
createdAt: Date
updatedAt: Date
```

Indexes:

```text
recommendationDate
status + priority
targetArea + recommendationDate
```

---

## DATABASE RULES

- Use ObjectId.
- Use Mongoose timestamps.
- Do not use soft-delete unless later explicitly required.
- Do not store plaintext passwords.
- Do not create employee data.
- Do not create unnecessary audit/configuration collections.
- Validate enum values.
- Validate non-negative numeric values.
- Keep references consistent.
- Ensure seeded data is internally consistent.

---

## MAIN DATA ACCESS PATTERNS

The application must efficiently support:

### Dashboard

- recent operations
- operation totals
- historical trends
- forecast records
- capacity records
- open bottlenecks
- pending recommendations

### Operations

Filter by:

- date range
- operation type
- operational area
- status

### Forecast

Filter by:

- forecast date
- operation type
- operational area

### Capacity

Filter by:

- planning date
- operation type
- operational area
- status
- risk level

### Bottlenecks

Filter by:

- planning date
- operation type
- operational area
- severity
- status

### Recommendations

Filter by:

- recommendation date
- status
- priority
- target area

---

## AI-RELATED DATA

No AI-specific collection is required.

Forecast metadata lives in `forecasts`.

## FILE METADATA

No file storage is required.

## AUDIT DATA

No separate audit collection is required for the MVP.

## SOFT DELETE

Not required.

## TIMESTAMPS

Use Mongoose:

```text
createdAt
updatedAt
```

---

# SECTION 8 — API CONTRACT

## BASE URL

```text
/api
```

## API VERSION

No separate URL version is necessary for the hackathon.

The effective API base is:

```text
/api
```

## AUTHENTICATION

JWT Bearer authentication.

Header:

```text
Authorization: Bearer <token>
```

Public:

```text
POST /api/auth/login
GET /api/health
```

Protected:

```text
GET /api/dashboard
GET /api/operations
GET /api/forecast
GET /api/capacity
GET /api/bottlenecks
GET /api/recommendations
PATCH /api/recommendations/:id
```

---

## STANDARD SUCCESS RESPONSE

```json
{
  "success": true,
  "data": {},
  "message": "..."
}
```

## STANDARD ERROR RESPONSE

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}
```

Never expose internal stack traces.

---

## 8.1 POST `/api/auth/login`

### Purpose

Authenticate the Logistics Manager.

### Authentication

Public.

### Request

```json
{
  "email": "manager@logipulse.demo",
  "password": "demo-password"
}
```

### Validation

- email required
- password required
- email must be valid
- normalize/trim email

### Backend flow

```text
request
 ↓
validate
 ↓
find user
 ↓
verify bcrypt
 ↓
check isActive
 ↓
create JWT
 ↓
return safe user
```

### Success

HTTP `200`.

```json
{
  "success": true,
  "data": {
    "token": "<jwt>",
    "user": {
      "id": "<objectId>",
      "name": "Logistics Manager",
      "email": "manager@logipulse.demo",
      "role": "LOGISTICS_MANAGER"
    }
  },
  "message": "Login successful"
}
```

### Errors

```text
400 VALIDATION_ERROR
401 INVALID_CREDENTIALS
403 FORBIDDEN
500 INTERNAL_ERROR
```

Never return `passwordHash`.

---

## 8.2 GET `/api/health`

### Purpose

Deployment/debugging health check.

### Authentication

Public.

### Response

HTTP `200`.

```json
{
  "success": true,
  "data": {
    "status": "ok"
  }
}
```

It may additionally report database health internally, but do not expose sensitive details.

---

## 8.3 GET `/api/dashboard`

### Purpose

Return the consolidated data needed for the main dashboard.

### Authentication

Required.

### Query

Optional:

```text
startDate
endDate
```

### Response

```json
{
  "success": true,
  "data": {
    "summary": {
      "inboundWorkload": 0,
      "outboundWorkload": 0,
      "inventoryVolume": 0,
      "requiredWorkforce": 0,
      "availableWorkforce": 0,
      "capacityGap": 0,
      "averageEfficiency": 0,
      "averageUtilization": 0,
      "activeBottlenecks": 0,
      "pendingRecommendations": 0
    },
    "trends": {
      "inbound": [],
      "outbound": [],
      "inventory": [],
      "efficiency": [],
      "utilization": []
    },
    "forecasts": [],
    "capacity": [],
    "bottlenecks": [],
    "recommendations": []
  },
  "message": "Dashboard data retrieved"
}
```

### Database mapping

```text
operations
forecasts
capacity
bottlenecks
recommendations
```

### Rule

Prefer one consolidated dashboard endpoint over excessive frontend requests.

---

## 8.4 GET `/api/operations`

### Purpose

Retrieve operational data.

### Authentication

Required.

### Query parameters

```text
startDate
endDate
operationType
operationalArea
status
```

### Response

```json
{
  "success": true,
  "data": {
    "items": [],
    "count": 0
  },
  "message": "Operations retrieved"
}
```

### Database

```text
operations
```

### Validation

- valid dates
- start <= end
- valid operationType
- valid area
- valid status

---

## 8.5 GET `/api/forecast`

### Purpose

Retrieve workload forecasts.

### Authentication

Required.

### Query parameters

```text
startDate
endDate
operationType
operationalArea
```

### Response

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "<objectId>",
        "forecastDate": "2026-09-10",
        "operationType": "OUTBOUND",
        "operationalArea": "Shipping",
        "forecastedVolume": 4200,
        "modelName": "MovingAverage",
        "confidence": 87,
        "modelVersion": "1.0"
      }
    ]
  },
  "message": "Forecast retrieved"
}
```

### Database

```text
operations
forecasts
```

---

## 8.6 FORECAST GENERATION RULE

If a valid forecast does not exist for the requested range:

1. read historical operations
2. aggregate daily workload
3. apply lightweight forecasting
4. generate future dates
5. persist forecast records
6. return forecast

If an appropriate forecast already exists, reuse it where practical.

No external ML server.

If history is insufficient:

```text
503 FORECAST_UNAVAILABLE
```

---

## 8.7 GET `/api/capacity`

### Purpose

Retrieve workforce/capacity analysis.

### Authentication

Required.

### Query

```text
startDate
endDate
operationType
operationalArea
status
riskLevel
```

### Response

```json
{
  "success": true,
  "data": {
    "items": []
  },
  "message": "Capacity data retrieved"
}
```

### Database

```text
capacity
forecasts
operations
```

---

## 8.8 CAPACITY CALCULATION

```text
requiredWorkforce =
ceil(forecastWorkload / capacityPerWorker)
```

Then:

```text
capacityGap =
availableWorkforce - requiredWorkforce
```

Status:

```text
capacityGap < 0 → UNDER_CAPACITY
capacityGap = 0 → BALANCED
capacityGap > 0 → OVER_CAPACITY
```

Risk must be deterministic and explainable.

---

## 8.9 GET `/api/bottlenecks`

### Purpose

Retrieve operational bottlenecks.

### Authentication

Required.

### Query

```text
startDate
endDate
operationType
operationalArea
severity
status
```

### Response

```json
{
  "success": true,
  "data": {
    "items": []
  },
  "message": "Bottlenecks retrieved"
}
```

### Database

```text
bottlenecks
capacity
```

Default dashboard behavior should prioritize:

```text
status = OPEN
```

and higher severity.

---

## 8.10 GET `/api/recommendations`

### Purpose

Retrieve resource allocation recommendations.

### Authentication

Required.

### Query

```text
startDate
endDate
status
priority
targetArea
```

### Response

```json
{
  "success": true,
  "data": {
    "items": []
  },
  "message": "Recommendations retrieved"
}
```

### Database

```text
recommendations
capacity
bottlenecks
```

---

## 8.11 PATCH `/api/recommendations/:id`

### Purpose

Update recommendation status.

### Authentication

Required.

### Request

```json
{
  "status": "ACCEPTED"
}
```

Allowed:

```text
PENDING
ACCEPTED
REJECTED
COMPLETED
```

### Validation

- valid ObjectId
- status is valid enum

### Response

Return updated recommendation in standard success format.

### Errors

```text
400 VALIDATION_ERROR
404 NOT_FOUND
500 INTERNAL_ERROR
```

Do not create a complicated workflow.

---

## API STATUS CODES

Use:

```text
200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
500 Internal Server Error
503 Service Unavailable
```

---

## API ERROR CODES

```text
VALIDATION_ERROR
INVALID_CREDENTIALS
UNAUTHORIZED
FORBIDDEN
NOT_FOUND
DUPLICATE_RESOURCE
DATABASE_ERROR
DATABASE_UNAVAILABLE
FORECAST_UNAVAILABLE
CAPACITY_UNAVAILABLE
INTERNAL_ERROR
```

---

## API VALIDATION

Validate:

- body
- query parameters
- dates
- ObjectIds
- enum values
- numbers
- email
- recommendation status

Never pass arbitrary request objects directly into MongoDB.

Protect against NoSQL injection.

---

## PAGINATION

Not required for the primary dashboard.

If list endpoints need pagination, use:

```text
page
limit
```

Do not build cursor pagination.

---

## SEARCH

No general free-text search is required.

Use structured filters only.

---

## SORTING

Use sensible chronological ordering for operational/time-series data.

For recommendations:

```text
pending/high priority first
```

where practical.

---

## FILE UPLOAD

Not required.

---

## AI ENDPOINTS

None required for P0.

---

## EXTERNAL API ENDPOINTS

None required for P0.

---

# SECTION 9 — FRONTEND/BACKEND INTEGRATION CONTRACT

## FRONTEND BASE URL

Development:

```text
http://localhost:<backend-port>
```

Production:

Use deployed backend URL.

## BACKEND BASE PATH

```text
/api
```

---

## PRIMARY FLOW MAPPING

```text
Login UI
 ↓
POST /api/auth/login
 ↓
authController
 ↓
authService
 ↓
users collection
 ↓
JWT response
 ↓
frontend auth state
 ↓
Dashboard
 ↓
GET /api/dashboard
 ↓
dashboardController
 ↓
dashboardService
 ↓
operations + forecasts + capacity + bottlenecks + recommendations
 ↓
dashboard response
 ↓
React state
 ↓
KPI cards/charts/tables
```

---

## FRONTEND API CLIENT

Create a centralized service such as:

```text
frontend/src/services/api.ts
```

It must:

- attach JWT
- send requests
- parse standard responses
- handle common errors
- expose clear API methods

Avoid scattering raw requests throughout UI components.

---

## FRONTEND STATES

Every major API-backed section should support:

### Loading

Show loading indicator/skeleton.

### Success

Render actual backend data.

### Empty

Show meaningful empty-state message.

### Validation error

Show user-safe validation message.

### Unauthorized

Clear auth state and redirect to login.

### Network failure

Show recoverable error message.

### Server error

Show user-safe error state.

---

# SECTION 10 — AWS CONTRACT

## REQUIRED AWS SERVICES

### EC2

Purpose:

Host the Node.js backend/application runtime.

### IAM

Purpose:

Secure AWS account/resource access.

## NOT REQUIRED

Do not introduce:

- RDS
- Lambda
- API Gateway
- ECS
- EKS
- S3
- CloudFront
- ElastiCache

unless an explicit later decision changes the architecture.

MongoDB is hosted on MongoDB Atlas.

---

## EC2 REQUIREMENTS

Configure:

- Node.js runtime
- application environment variables
- appropriate security group
- required application port
- process management where practical
- Git deployment

Keep EC2 setup simple.

---

## ENVIRONMENT VARIABLES

Backend:

```text
MONGODB_URI=
JWT_SECRET=
PORT=
```

Optional P1:

```text
WEATHER_API_KEY=
TRAFFIC_API_KEY=
```

Never commit actual secrets.

---

## SECURITY GROUP

Allow only required application traffic.

Do not expose unnecessary ports.

---

# SECTION 11 — DEPLOYMENT CONTRACT

## DATABASE HOSTING

MongoDB Atlas.

## BACKEND HOSTING

AWS EC2.

## FRONTEND HOSTING

Use the simplest reliable hosting compatible with the current project. If the hackathon setup permits, serve the production React build through the Node application/EC2 to reduce infrastructure.

Do not add unnecessary AWS services.

## DEPLOYMENT SEQUENCE

1. Create/verify MongoDB Atlas database.
2. Configure network access and credentials.
3. Create/verify EC2 instance.
4. Configure IAM/security group.
5. Clone repository.
6. Install backend dependencies.
7. Configure environment variables.
8. Seed database.
9. Start backend.
10. Build/deploy frontend.
11. Verify `/api/health`.
12. Verify login.
13. Verify dashboard.
14. Execute complete demo flow.

---

# SECTION 12 — REPOSITORY STRUCTURE

Recommended:

```text
logipulse/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── context/
│       ├── hooks/
│       └── App.tsx
│
├── backend/
│   └── src/
│       ├── config/
│       ├── models/
│       ├── routes/
│       ├── controllers/
│       ├── services/
│       ├── middleware/
│       ├── utils/
│       ├── app.js
│       └── server.js
│
├── docs/
├── DATABASE_CONTRACT.md
├── API_CONTRACT.md
├── ARCHITECTURE.md
├── HACKATHON_CONTEXT.md
├── README.md
├── .env.example
└── .gitignore
```

Do not create unnecessary folder layers.

---

# SECTION 13 — BACKEND MODULE CONTRACT

## CONFIG

```text
db.js
env.js
```

## MODELS

```text
User.js
Operation.js
Forecast.js
Capacity.js
Bottleneck.js
Recommendation.js
```

## ROUTES

```text
authRoutes.js
dashboardRoutes.js
operationRoutes.js
forecastRoutes.js
capacityRoutes.js
bottleneckRoutes.js
recommendationRoutes.js
```

## CONTROLLERS

Controllers should:

- receive validated requests
- call services
- format responses
- pass errors to middleware

Controllers should not contain large business algorithms.

## SERVICES

### authService

- login
- password verification
- JWT creation

### operationsService

- retrieval
- filtering
- trend aggregation

### forecastingService

- historical aggregation
- forecasting
- persistence
- retrieval

### workforceService

- required workforce calculation
- capacity-per-worker logic

### capacityService

- capacity calculations
- capacity gap
- utilization
- status/risk

### bottleneckService

- bottleneck detection
- severity
- status

### recommendationService

- source-area detection
- target-area detection
- redistribution
- persistence
- status update

### dashboardService

- consolidated dashboard aggregation

---

# SECTION 14 — FRONTEND CONTRACT

## REQUIRED PAGES

```text
/login
/dashboard
```

## LOGIN

Must contain:

- email
- password
- login action
- validation
- loading state
- error state

Use the seeded manager account for the demo.

## DASHBOARD

Required sections:

### KPI cards

- inbound
- outbound
- inventory
- required workforce
- available workforce
- capacity gap
- efficiency
- utilization

### Trends

- inbound
- outbound
- inventory
- efficiency
- utilization

### Forecast

Historical versus forecast workload.

### Workforce

Required versus available.

### Capacity

Area-level status.

### Bottlenecks

Area, severity, gap, utilization, reason.

### Recommendations

Source, target, resources, reason, priority, impact, status.

---

# SECTION 15 — TEAM RESPONSIBILITIES

There are 2 developers.

## DEVELOPER 1 — BACKEND/DATA

Own:

- MongoDB Atlas
- Mongoose schemas
- seed
- authentication
- JWT middleware
- REST APIs
- forecasting
- workforce logic
- capacity
- bottleneck detection
- recommendations
- backend deployment

## DEVELOPER 2 — FRONTEND

Own:

- CRA frontend
- Tailwind
- login page
- dashboard
- KPI cards
- charts
- capacity views
- bottleneck views
- recommendation views
- API client
- frontend integration

## INTEGRATION POINT

Both developers use this API contract as the shared interface.

Frontend development can use mock response objects matching the exact API contract while backend is being implemented.

Once backend is available, replace mocks with real API calls.

## BRANCH STRATEGY

Suggested:

```text
main
backend
frontend
```

Merge stable work frequently.

---

# SECTION 16 — 6-HOUR EXECUTION PLAN

## 00:00–00:30 — FOUNDATION

Both:

- inspect repository
- confirm existing setup
- install dependencies
- establish branches
- configure environment
- agree API contract

## 00:30–01:30 — CORE FOUNDATION

Developer 1:

- MongoDB connection
- schemas
- seed
- auth

Developer 2:

- React routing
- Tailwind
- login UI
- dashboard shell

## 01:30–03:00 — P0 BACKEND + FRONTEND

Developer 1:

- operations
- forecasting
- workforce
- capacity
- bottlenecks
- recommendations
- dashboard API

Developer 2:

- KPI cards
- trends
- forecast chart
- workforce/capacity views
- bottleneck section
- recommendations section

## 03:00–04:00 — INTEGRATION

Both:

- connect frontend to APIs
- fix response mismatches
- validate calculations
- test login
- test dashboard

## 04:00–04:30 — P0 STABILIZATION

- seed verification
- end-to-end test
- bug fixing
- visual cleanup

## 04:30 — P0 CHECKPOINT

**P0 must be working before P1 begins.**

Run P0 acceptance checklist.

If any critical P0 item fails:

**DO NOT START P1.**

Fix P0.

## 04:30–05:15 — P1

Only if P0 is accepted.

Implement selected P1 features that fit the remaining time.

## 05:15–05:30 — P1 STABILIZATION

Test P1 without breaking P0.

## 05:30 — P1 CHECKPOINT

Run P1 acceptance checklist.

## 05:30–06:00 — DEPLOYMENT + DEMO

- deploy
- verify
- prepare demo
- backup screenshots/data if necessary
- final smoke test

---

# SECTION 17 — P0 IMPLEMENTATION CHECKPOINT

Antigravity must treat P0 as a release milestone.

## P0 CHECKLIST

### Authentication

- [ ] Login page exists.
- [ ] Login API works.
- [ ] Password is hashed.
- [ ] JWT is generated.
- [ ] Protected routes reject unauthenticated requests.
- [ ] Logout clears frontend authentication.

### Database

- [ ] MongoDB Atlas connection works.
- [ ] All six collections/models exist.
- [ ] Seed script works.
- [ ] Indexes exist.
- [ ] Demo data is internally consistent.

### Operations

- [ ] Inbound data works.
- [ ] Outbound data works.
- [ ] Inventory data works.
- [ ] Historical trends work.

### Forecast

- [ ] Forecast is generated/retrieved.
- [ ] Forecast uses historical data.
- [ ] Forecast data is persisted/reused where appropriate.

### Workforce

- [ ] Required workforce is calculated.
- [ ] Available workforce is shown.
- [ ] Capacity gap is mathematically correct.

### Capacity

- [ ] Under-capacity works.
- [ ] Balanced works.
- [ ] Over-capacity works.
- [ ] Utilization works.

### Bottlenecks

- [ ] Bottleneck detection works.
- [ ] Severity works.
- [ ] Open bottlenecks display.

### Recommendations

- [ ] Excess-capacity area is identified.
- [ ] Shortage area is identified.
- [ ] Recommendation calculation is correct.
- [ ] Reason is understandable.
- [ ] Recommendation is displayed.
- [ ] Recommendation status can be updated.

### Dashboard

- [ ] All P0 KPIs load from backend.
- [ ] Charts load.
- [ ] No critical console errors.
- [ ] Loading states work.
- [ ] Empty/error states work.

### End-to-end

- [ ] Login → dashboard → forecast → workforce → bottleneck → recommendation works.

---

# SECTION 18 — P0 GIT CHECKPOINT

After every P0 acceptance criterion passes:

1. Run tests.
2. Run frontend production build.
3. Run backend.
4. Run seed.
5. Run health check.
6. Run login.
7. Run dashboard.
8. Perform complete demo flow.
9. Fix critical bugs.
10. Commit.

Recommended commit:

```text
feat: complete P0 logistics operations MVP
```

Recommended tag:

```text
p0-working
```

The P0 checkpoint must represent a **known working model**.

Do not start P1 until this checkpoint exists.

---

# SECTION 19 — P1 CONTRACT

P1 is an incremental enhancement to the stable P0 system.

Possible P1 features:

1. Peak/non-peak analysis.
2. Operational risk indicators.
3. Delivery-delay risk.
4. Simple traffic/weather contributing factors.

Do not implement all four if time is insufficient.

Prioritize the feature that gives the strongest demo/business value with the lowest integration risk.

---

# SECTION 20 — P1 ACCEPTANCE CHECKPOINT

Before committing P1:

- [ ] P0 still works.
- [ ] P1 feature works.
- [ ] P1 does not alter P0 API behavior unexpectedly.
- [ ] P1 does not corrupt existing data.
- [ ] P1 has loading/empty/error states.
- [ ] No new unnecessary infrastructure was introduced.
- [ ] No real-time architecture was introduced.
- [ ] No employee-level analytics was introduced.
- [ ] Full demo flow still works.

Recommended commit:

```text
feat: add P1 operational intelligence
```

Recommended tag:

```text
p1-working
```

---

# SECTION 21 — P2 GATE

Do NOT implement P2 automatically.

Only implement P2 if:

1. P0 is stable.
2. P1 is stable.
3. The user explicitly authorizes P2.
4. There is enough time.
5. P2 cannot destabilize the working model.

---

# SECTION 22 — TESTING CONTRACT

## BACKEND

Test:

### Authentication

- valid credentials
- invalid password
- unknown user
- inactive user
- missing credentials

### JWT

- missing token
- invalid token
- expired token if implemented

### Operations

- list
- date filtering
- operation type filtering
- area filtering
- invalid filter

### Forecast

- forecast retrieval
- forecast generation
- forecast reuse
- insufficient history

### Capacity

- required workforce
- available workforce
- capacity gap
- status
- utilization

### Bottleneck

- detection
- severity
- filtering

### Recommendation

- generation
- source/target matching
- resource calculation
- status update
- invalid ID
- invalid status

### Database

- connection
- seed
- validation
- unique email
- indexes

---

# SECTION 23 — SECURITY

Implement:

- bcrypt/bcryptjs
- JWT
- protected routes
- input validation
- NoSQL injection protection
- CORS
- environment variables
- safe errors
- no plaintext passwords
- no secrets in Git
- appropriate EC2 security group
- IAM for AWS access

Never put secrets or API keys in frontend source code.

---

# SECTION 24 — ERROR HANDLING & FALLBACKS

## MongoDB unavailable

Return controlled:

```text
503 DATABASE_UNAVAILABLE
```

where appropriate.

## Forecast history unavailable

Return:

```text
FORECAST_UNAVAILABLE
```

Do not fabricate a forecast.

## No bottlenecks

Display:

```text
No active bottlenecks
```

## No recommendations

Display:

```text
No recommendations available
```

## Frontend API unavailable

Display a clear error state.

## P1 external API unavailable

If P1 traffic/weather is implemented:

- use a permitted fallback such as synthetic/cached data
- do not block the P0 dashboard
- do not claim real-time information

---

# SECTION 25 — BIGGEST RISKS

## Risk 1 — Scope Explosion

**Impact:** Critical

**Mitigation:** P0-first development and explicit P1 gate.

**Fallback:** Stop P1/P2 and stabilize P0.

## Risk 2 — Frontend/Backend Contract Mismatch

**Impact:** High

**Mitigation:** Use this API contract as shared source of truth.

**Fallback:** Fix integration before adding features.

## Risk 3 — Forecasting Takes Too Long

**Impact:** High

**Mitigation:** Use lightweight deterministic forecasting.

**Fallback:** Moving-average-style forecast using seeded historical data.

## Risk 4 — Deployment Failure

**Impact:** High

**Mitigation:** Deploy before the final 30 minutes.

**Fallback:** Maintain a working local demo environment.

## Risk 5 — Inconsistent Demo Data

**Impact:** Critical

**Mitigation:** deterministic seed and mathematical validation.

**Fallback:** rerun/reset seed.

---

# SECTION 26 — DEMO STRATEGY

## DEMO LENGTH

Approximately 3–5 minutes.

## DEMO STORY

Start with the operational problem:

> “The logistics manager currently reacts to workload changes after capacity pressure appears. LogiPulse predicts workload, calculates capacity requirements, identifies bottlenecks, and recommends proactive redistribution.”

## DEMO FLOW

```text
1. Login
2. Open dashboard
3. Show inbound/outbound/inventory
4. Show trends
5. Show forecast
6. Show required vs available workforce
7. Show capacity gap
8. Show bottleneck
9. Show under/overutilized areas
10. Show recommendation
11. Accept/update recommendation
```

## KEY WOW MOMENT

Show:

```text
Shipping
Forecast = 4200
Required = 42
Available = 35
Gap = -7
Utilization = 120%
Risk = HIGH
```

Then:

```text
Receiving
Required = 10
Available = 15
Excess = 5
```

Then show:

```text
Recommendation:
Redistribute 5 workforce-capacity units
from Receiving to Shipping.
```

This demonstrates predictive planning rather than reactive reporting.

## TECHNICAL HIGHLIGHTS

Briefly explain:

- React dashboard
- Node/Express REST API
- MongoDB Atlas
- lightweight forecasting
- deterministic capacity calculation
- bottleneck detection
- proactive recommendation engine
- AWS EC2 deployment

## BUSINESS VALUE

The manager can see:

```text
What happened
      ↓
What is likely to happen
      ↓
What capacity is required
      ↓
Where the gap is
      ↓
What action can be taken
```

---

# SECTION 27 — DEFINITION OF DONE

The P0 application is DONE only when:

- [ ] P0 features work.
- [ ] Login works.
- [ ] JWT authentication works.
- [ ] MongoDB works.
- [ ] Seed works.
- [ ] Dashboard works.
- [ ] Inbound analytics work.
- [ ] Outbound analytics work.
- [ ] Inventory analytics work.
- [ ] Historical trends work.
- [ ] Forecast works.
- [ ] Workforce requirement works.
- [ ] Required vs available works.
- [ ] Capacity gap is mathematically correct.
- [ ] Utilization works.
- [ ] Under/overutilization works.
- [ ] Bottlenecks work.
- [ ] Recommendations work.
- [ ] Recommendation status update works.
- [ ] No employee-level analytics exists.
- [ ] Frontend/backend API contracts match.
- [ ] Error states work.
- [ ] Application runs locally.
- [ ] Application can be deployed.
- [ ] P0 Git checkpoint exists.
- [ ] Complete demo flow works.

P1 is DONE only after all P0 requirements continue to pass and the selected P1 features work.

---

# SECTION 28 — DO NOT BUILD

Explicitly do not build:

```text
Employee performance analytics
Employee rankings
Employee scores
Employee productivity dashboards
Employee profiles for performance analysis
Admin dashboard
Multiple roles
Registration
Forgot password
OAuth
Social login
Real-time tracking
GPS
Kafka
WebSockets
Socket.IO
Redis
Message queues
Microservices
Kubernetes
RAG
Vector database
AI agents
Complex LLM workflows
Mobile app
Enterprise integrations
Unnecessary AWS services
Unnecessary database collections
Unnecessary CRUD APIs
Unnecessary UI pages
```

Do not build something merely because it sounds technically impressive.

The objective is a working business solution.

---

# SECTION 29 — IMPLEMENTATION RULES FOR ANTIGRAVITY

## RULE 1

Inspect the existing repository before changing anything.

Understand:

- current folders
- current dependencies
- current frontend setup
- current backend setup
- existing code
- existing Git state

Preserve compatible work.

## RULE 2

Treat this document as the source of truth.

## RULE 3

Do not invent requirements.

## RULE 4

Do not silently change the MVP.

## RULE 5

Do not silently change database schemas.

## RULE 6

Do not silently change REST API contracts.

## RULE 7

Do not add technologies without a concrete reason.

## RULE 8

Prioritize working functionality over perfection.

## RULE 9

Keep architecture simple.

## RULE 10

After every major stage, verify the application still runs.

## RULE 11

Do not begin P1 until the P0 checkpoint passes.

## RULE 12

Do not begin P2 without explicit authorization.

## RULE 13

Never expose secrets.

## RULE 14

Do not spend excessive time refactoring stable code during the hackathon.

## RULE 15

Keep the application demo-ready throughout development.

## RULE 16

If a requirement is genuinely ambiguous or contradictory, stop and report it rather than inventing a new requirement.

## RULE 17

If an implementation shortcut is necessary, choose the simplest shortcut that preserves the business behavior.

## RULE 18

Do not replace real backend functionality with frontend hardcoded values merely to make the demo look complete.

Synthetic seed data is allowed; hardcoded dashboard results are not.

## RULE 19

Every calculation displayed to the user must be traceable to the documented business logic.

## RULE 20

The application must be usable at every completed checkpoint.

---

# SECTION 30 — STAGED BUILD PROTOCOL

This section is mandatory.

## STAGE 0 — REPOSITORY INSPECTION

Antigravity must:

1. inspect the repository
2. inspect existing Git branches/status
3. inspect existing package files
4. inspect existing frontend/backend
5. compare repository state against this document
6. identify what already exists
7. avoid unnecessary rewrites

Do not destroy compatible existing work.

---

# STAGE 1 — BUILD P0

Implement only:

```text
Authentication
Dashboard
Inbound
Outbound
Inventory
Historical trends
Efficiency
Forecast
Workforce requirement
Available vs required
Capacity gap
Utilization
Bottlenecks
Under/overutilization
Recommendations
Recommendation status
```

### P0 completion gate

Run:

```text
backend tests
frontend build
seed
health check
login
dashboard
end-to-end demo
```

Then verify every P0 checkbox.

If any critical P0 item fails:

```text
DO NOT MOVE TO P1
```

Fix it first.

### P0 Git checkpoint

Commit:

```text
feat: complete P0 logistics operations MVP
```

Tag:

```text
p0-working
```

This checkpoint must remain a recoverable working version.

---

# STAGE 2 — BUILD P1

Only after P0 is accepted.

Choose P1 features according to remaining time.

Recommended order:

1. Peak/non-peak analysis
2. Operational risk indicators
3. Delivery-delay risk
4. Traffic/weather contributing factors

Do not implement all if time is insufficient.

After P1:

- run full regression
- verify P0
- verify P1
- fix issues
- commit

Recommended commit:

```text
feat: add P1 operational intelligence
```

Tag:

```text
p1-working
```

---

# STAGE 3 — P2

Do not implement unless explicitly authorized.

---

# SECTION 31 — GIT CHECKPOINT & ROLLBACK RULES

At minimum maintain:

```text
p0-working
p1-working
```

If P1 breaks P0:

1. identify regression
2. fix it if quick
3. otherwise revert to `p0-working`
4. preserve the working P0 demo
5. do not sacrifice the working model for an optional feature

The priority is:

```text
Working P0 > Broken P0 + More Features
```

---

# SECTION 32 — FINAL MACHINE-READABLE CONTRACT

```text
PROJECT:
LogiPulse

PROBLEM:
Lack of predictive, process-level logistics capacity planning.

TARGET_USERS:
Logistics Manager / Operational Leader

P0_FEATURES:
Authentication
Dashboard
Inbound analytics
Outbound analytics
Inventory analytics
Historical trends
Process efficiency
Workload forecasting
Workforce requirement
Available vs required capacity
Capacity gap
Utilization
Bottleneck detection
Under/overutilization
Resource allocation recommendations
Recommendation status

P1_FEATURES:
Peak/non-peak analysis
Operational risk indicators
Delivery-delay risk
Traffic/weather contributing factors

P2_FEATURES:
What-if scenarios
Natural-language explanations

P3_FEATURES:
Employee-level productivity
Multiple roles
Admin
Registration
Forgot password
OAuth
Real-time streaming
GPS
Kafka
WebSockets
Redis
Microservices
Kubernetes
RAG
Vector DB
AI agents
Enterprise integrations
Mobile

FRONTEND:
React

FRONTEND_LANGUAGE:
TypeScript

FRONTEND_BUILD_TOOL:
Create React App

STYLING:
Tailwind CSS

BACKEND:
Node.js + Express

BACKEND_LANGUAGE:
JavaScript

API_STYLE:
REST

DATABASE:
MongoDB

ORM_ODM:
Mongoose

DATABASE_HOSTING:
MongoDB Atlas

AUTH:
JWT + bcrypt/bcryptjs

AI_REQUIRED:
No LLM required for P0

FORECASTING:
Lightweight statistical/time-series method

RAG:
No

VECTOR_DB:
No

AI_AGENT:
No

EXTERNAL_APIS:
None required for P0

STORAGE:
No file storage required

AWS_SERVICES:
EC2 + IAM

DEPLOYMENT:
Frontend + Node backend with MongoDB Atlas

CORE_COLLECTIONS:
users
operations
forecasts
capacity
bottlenecks
recommendations

API_BASE:
 /api

API_ENDPOINTS:
POST /api/auth/login
GET /api/health
GET /api/dashboard
GET /api/operations
GET /api/forecast
GET /api/capacity
GET /api/bottlenecks
GET /api/recommendations
PATCH /api/recommendations/:id

PRIMARY_DEMO_FLOW:
Login → Dashboard → Current Operations → Trends → Forecast → Required Workforce → Available Workforce → Capacity Gap → Bottleneck → Under/Overutilization → Recommendation → Recommendation Status

DEV1:
Backend, database, APIs, forecasting, workforce, capacity, bottlenecks, recommendations, deployment

DEV2:
Frontend, UI, charts, dashboard, API integration

TOTAL_TIME:
6 hours

P0_CHECKPOINT:
p0-working

P0_COMMIT:
feat: complete P0 logistics operations MVP

P1_CHECKPOINT:
p1-working

P1_COMMIT:
feat: add P1 operational intelligence

BIGGEST_RISK:
Scope expansion / integration failure

FALLBACK:
Stable seeded P0 demo
```

---

# SECTION 33 — FINAL VALIDATION

Before implementation is considered complete, validate:

1. Problem statement vs MVP.
2. Requirements vs features.
3. MVP vs architecture.
4. Architecture vs database.
5. Database vs API.
6. API vs frontend.
7. Forecasting requirement vs forecasting implementation.
8. Workforce logic vs capacity data.
9. Capacity logic vs bottleneck detection.
10. Bottleneck detection vs recommendations.
11. API responses vs frontend expectations.
12. AWS architecture vs deployment.
13. Features vs 6-hour timeline.
14. Team responsibilities vs implementation order.
15. P0 vs P1 boundaries.
16. Business rule vs database schema.
17. Business rule vs API surface.
18. No employee-level analytics exists anywhere.
19. No unnecessary real-time infrastructure exists.
20. No unnecessary AI infrastructure exists.

If a conflict is found:

- use the latest explicitly locked decision
- do not silently invent a replacement
- if genuinely unresolved, report it as a BLOCKER

---

# FINAL INSTRUCTION TO ANTIGRAVITY

Build the project from this document.

Do not merely scaffold files.

Do not stop after creating schemas.

Do not stop after creating APIs.

Do not stop after creating UI.

The objective is a **working end-to-end LogiPulse application**.

The required progression is:

```text
Inspect repository
      ↓
Implement P0
      ↓
Test P0
      ↓
Verify P0 acceptance criteria
      ↓
Commit + tag p0-working
      ↓
Implement P1
      ↓
Regression test P0
      ↓
Test P1
      ↓
Commit + tag p1-working
      ↓
Only if explicitly authorized → P2
```

The application must remain recoverable at every checkpoint.

**Never sacrifice a working P0 system for optional features.**

**Build P0 first. Make it genuinely work. Commit it. Then build P1.**
