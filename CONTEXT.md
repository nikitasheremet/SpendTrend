# SpendTrend

Personal spend tracking: users record expenses and incomes and see how their spending trends over time.

## Language

### App updates

**App Version**:
The semver number of the frontend build a user is running, e.g. `0.1.38`.
_Avoid_: Build number, release number

**Release Notes**:
The user-facing description of what one App Version added, split into Features and Bug Fixes. Most App Versions have none.
_Avoid_: Release entry, patch notes

**Changelog**:
The full collection of Release Notes across all App Versions, newest first. Before a deploy stamps them, unreleased Release Notes sit at the top (so only in dev and local, never in production) and pop up on every load, since they have no version to mark as seen.
_Avoid_: Release history, all release notes

**Last Seen Version**:
The App Version a user was last running when the app checked for unseen Release Notes.
_Avoid_: Last shown version, last read version

### Adding data

**Add Data Paste**:
Pasting bank data copied from a bank website into the Add Data page, which turns each transaction row into a draft expense or income.
_Avoid_: Bank import, copy import, expense import

**Failed Add Data Paste Report**:
A user's report that an Add Data Paste produced anything other than what they expected: no rows, missing rows, or rows with the wrong date, name, amount or expense/income type. It always describes the most recent Add Data Paste, and includes the bank, the user's own account of what went wrong and a scrambled copy of what they pasted.
_Avoid_: Bug report, import issue report, paste feedback
