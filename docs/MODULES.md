# Module Catalog

Each module under `assets/modules/` exports a consistent contract:

- `moduleKey` – unique snake_case identifier
- `moduleTitle` – human readable title
- `moduleGroup` – navigation group
- `fields` – ordered list of column/field names
- `seedRecords` – demo data for first load
- `createDefaultRecord(i)` – factory for new empty records
- `validateRecord(r)` – returns error map
- `normalizeRecord(r)` – fills missing keys
- `getFieldOptions(f)` – select options when applicable

Modules are registered in `assets/core/app.js` and rendered by a shared CRUD shell.
