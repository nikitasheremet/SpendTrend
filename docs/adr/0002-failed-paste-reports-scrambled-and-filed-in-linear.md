# Failed Add Data Paste Reports are scrambled in the browser and filed as Linear issues

A Failed Add Data Paste Report needs the user's pasted bank HTML so we can reproduce the parser bug. We file each report as an issue in the SpendTrend Linear team through Linear's API, with the scrambled HTML, the plain-text clipboard and the full payload attached as files. An agent can then be pointed at the issue and debug it without connecting to the production database. Real bank data must not leave the user's browser, so the frontend scrambles the paste before it's sent:

- Digits 1–9 become random digits 1–9, and zeros stay zero.
- Letters become random letters of the same case, apart from an allowlist of words the parser relies on.
- Dates are kept as they are.
- Every attribute except `colspan`/`rowspan` is removed.

Scrambling can change how the paste parses. To catch that, the report runs the parser again on the scrambled HTML and includes a fidelity check that compares it with the original parse. The check holds no real values.

## Considered Options

- **Store reports in a Postgres table**: rejected. Reading a report would mean connecting to the production database, which is exactly the friction this feature is meant to remove.
- **Email reports over SMTP**: rejected. It puts bank data in an inbox, large pastes hit attachment limits, and agents can't pick reports up easily.
- **Write reports to a file on the Render instance**: rejected. The filesystem is wiped on every deploy, and a persistent disk costs extra.
- **Send the raw paste unscrambled**: rejected. Reports end up in a third-party tool, and the team has synced to a public GitHub repo in the past.
- **Scramble dates too**: rejected. Scrambled dates become invalid and would hide date-parsing bugs, and dates next to scrambled names and amounts reveal very little.

## Consequences

- The SpendTrend Linear team must not sync to GitHub again while it receives these reports, or the scrambled pastes become public.
- A bug that depends on the exact text of a merchant name, outside the allowlist, can't be reproduced from a report. The fidelity check shows when scrambling changed the parse.
- Reports count toward the Linear plan's limit on active issues.
- The rate limit (5 per user per hour) is kept in memory, so it resets on every deploy or restart.
