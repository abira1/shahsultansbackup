# GitHub Branch Protection Setup Instructions

Since branch protection rules must be set through GitHub's web interface or API, here are the exact settings to configure:

## Branch Protection Rules for `main` branch:

### Required Settings:
1. **Restrict pushes that create files**
   - Enabled: ✅

2. **Require a pull request before merging**
   - Enabled: ✅
   - Required number of reviewers: 1
   - Dismiss stale reviews: ✅
   - Require review from code owners: ✅

3. **Require status checks to pass before merging**
   - Enabled: ✅
   - Require up-to-date branches: ✅
   - Status checks: `build-and-test` (from CI workflow)

4. **Require conversation resolution before merging**
   - Enabled: ✅

5. **Restrict pushes that create files**
   - Enabled: ✅

6. **Do not allow bypassing the above settings**
   - Include administrators: ✅

## API Command (Alternative):
If you prefer to use GitHub CLI or API, here's the command:

```bash
# Using GitHub CLI (gh)
gh api repos/abira1/shahsultansbackup/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["build-and-test"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_code_owner_reviews":true}' \
  --field restrictions=null
```

## To Apply These Settings:
1. Go to: https://github.com/abira1/shahsultansbackup/settings/branches
2. Click "Add rule" for main branch
3. Apply the settings listed above
4. Save the protection rule