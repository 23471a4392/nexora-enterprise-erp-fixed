# Enterprise Rules Engine

The `enterprise_rules_*.js` files contain configurable business rules used for governance, validation, and workflow extension.

Each rule object has:

- `id` – unique rule identifier
- `enabled` – boolean toggle
- `priority` – ordering hint (1–10)
- `scope` – typically "enterprise"
- `action` – e.g. "validate"
- `message` – human readable description

Helper exports:

- `enabledRules()` – returns only enabled rules
- `findRule(id)` – lookup by id

In a production deployment these would be loaded from a rules service and evaluated by a policy engine.
