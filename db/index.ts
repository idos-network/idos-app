// Export the database connection that chooses
// between SQLite (local) and PostgreSQL (Netlify)
export { db, schema, users, userQuests } from './connection';
