// Root entrypoint for FarmAid.
// Delegates to the canonical backend server defined in Backend/server.js so that
// `npm start` from the repository root launches the full API (auth, users,
// livestock, health, consultations, knowledge, market, sync, notifications and
// admin). Keeping a single source of truth avoids route drift between the two
// server files that previously existed.
require('./Backend/server.js');