# Release Notes are per-version JSON files stamped by CI

The App Version is only assigned after a merge to `dev`, when the auto-bump workflow runs `npm version patch`. That means an author can't know the version their change will ship in. So Release Notes are written to `releaseNotes/unreleased.json`, and the bump workflow renames that file to `releaseNotes/<newVersion>.json` in the same commit. The version lives only in the filename and never inside the file. CI never edits JSON, and the filename and contents can't disagree.

## Considered Options

- **One Vue component per version**: rejected. It puts content inside markup and doesn't enforce the fixed Features / Bug Fixes layout.
- **One HTML file per version, shown with `v-html`**: rejected. The layout would drift between files, and every file would need sanitising.
- **Authors guess the next version number**: rejected. It breaks when PRs merge close together, and deploys from `main` can jump several versions.

## Consequences

- Most App Versions have no Release Notes file. That's expected, and those versions are skipped.
- Two PRs that both add `unreleased.json` and merge before CI runs will clash and must be fixed by hand.
- Bullets are plain text. Inline HTML (shown with `v-html` and cleaned by DOMPurify) can be added later without changing existing files.
