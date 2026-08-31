# Nexora Enterprise ERP

A large modular Enterprise ERP frontend prototype built with vanilla ES modules.

## Modules

HRMS, Finance, Inventory, Procurement, CRM & Sales, Projects, Documents, Workflow, Support, Assets, Analytics, Administration and Security.

## Working features

- Dashboard with summary cards and charts
- Full CRUD: create, edit, delete
- Search / filter
- Pagination
- Status fields with visual badges
- CSV export per module
- Full JSON backup / restore
- LocalStorage persistence
- Responsive UI
- Module navigation
- Configurable schemas and validation
- Enterprise business rules engine (multiple rule sets)

## Install

```bash
# Clone or extract the repository
cd nexora-enterprise-erp

# Optional: install dev dependencies for tests
npm install
```

No runtime npm packages are required to run the application.

## Build

```bash
npm run build
```

This is a static ES-module frontend; there is no compile step. Assets are served as-is.

## Run

### Option A – Python (recommended, zero deps)

```bash
python3 -m http.server 8000
# or
npm start
```

Open http://localhost:8000

### Option B – Node serve

```bash
npm run serve
```

### Option C – Docker

```bash
docker build -t nexora-erp .
docker run -p 8080:80 nexora-erp
```

Open http://localhost:8080

## Tests

```bash
npm install
npm test
```

Tests live under `tests/` and use Jest. Coverage reports are written to `coverage/`.

## Project structure

```
├── index.html
├── package.json
├── package-lock.json
├── Dockerfile
├── README.md
├── docs/
│   └── ARCHITECTURE.md
├── assets/
│   ├── core/
│   │   ├── app.js
│   │   ├── styles.css
│   │   ├── enterprise-config.js
│   │   └── enterprise_rules_*.js
│   └── modules/
│       └── *.js          # one file per ERP module
└── tests/
    └── modules.test.js
```

## License

Proprietary – All rights reserved. UNLICENSED.
