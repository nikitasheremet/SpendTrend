# Release Notes are per-version JSON files stamped by CI

The App Version is only assigned when `dev` is merged to `main` for a deploy: the deploy workflow runs `npm version patch` before it builds. So one App Version is one deploy, and its Release Notes cover every change merged to `dev` since the last deploy. Authors can't know the version their change will ship in. So Release Notes are written to `releaseNotes/unreleased.json`, and each PR adds its bullets to that file. When the deploy workflow bumps the version, it renames the file to `releaseNotes/<newVersion>.json` in the same commit and then merges `main` back into `dev`. The version lives only in the filename and never inside the file. CI never edits JSON, and the filename and contents can't disagree.

## Considered Options

- **One Vue component per version**: rejected. It puts content inside markup and doesn't enforce the fixed Features / Bug Fixes layout.
- **One HTML file per version, shown with `v-html`**: rejected. The layout would drift between files, and every file would need sanitising.
- **Authors guess the next version number**: rejected. It breaks when PRs merge close together.
- **Bump the App Version on every merge to `dev`**: rejected. Each App Version would hold a single change, so Release Notes would be one bullet each, and a version wouldn't match what users actually receive in a deploy.
- **One fragment file per PR, merged by CI on deploy**: rejected for now. It avoids merge conflicts when PRs edit `unreleased.json` in parallel, but it means CI has to write JSON. Work here is mostly one ticket at a time, so conflicts should be rare.

## Consequences

- A deploy with no `unreleased.json` has no Release Notes, and that App Version is skipped.
- Two PRs that both edit `unreleased.json` in parallel can conflict in git and must be resolved by hand.
- The bump commit lands on `main` and must be merged back into `dev`, otherwise `dev` keeps a stale `unreleased.json` and the next deploy conflicts.
- Bullets are plain text. Inline HTML (shown with `v-html` and cleaned by DOMPurify) can be added later without changing existing files.
