// The one known user every local database gets, so agents can sign in without Google
// (ADR-0004). It exists only in local databases, which is why its password can be public.
export const LOCAL_USER = {
  name: 'Local Agent',
  email: 'agent@spendtrend.local',
  password: 'local-agent-password',
}
