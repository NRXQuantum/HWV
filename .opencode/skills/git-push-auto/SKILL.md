---
name: Git Push Auto
description: Stage all changes, create an "Auto-commit" commit, and push whenever the user says "push".
---

When the user says **"push"** (case-insensitive, ignoring surrounding whitespace), immediately run these commands in order from the current repository directory:

```sh
git add .
git commit -m "Auto-commit"
git push
```

Do not ask for confirmation before running them. If a command fails, report the error. If there is nothing to commit, continue with `git push` and mention that no new commit was created.
