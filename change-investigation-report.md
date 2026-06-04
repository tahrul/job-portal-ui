# Change Investigation Report

**Target**: `src/components/Footer.jsx:171-182`  
**Investigation Date**: 2026-06-04  
**Repository**: job-portal-ui (local, branch: master)  
**Branch**: master

---

## Investigation Summary

| Detail                  | Value                                                |
| ----------------------- | ---------------------------------------------------- |
| File(s) Analyzed        | `src/components/Footer.jsx`                          |
| Lines Investigated      | 171–182 (Contact Us link + hover tooltip block)      |
| Total Commits on File   | 4                                                    |
| Unique Authors          | 2 (tahrul, claude[bot])                              |
| File Age (First Commit) | 2026-06-02                                           |
| Last Modified           | 2026-06-03 by claude[bot]                            |

---

## Author Breakdown

| # | Author       | Email                                              | Commits | Lines Owned | First Contribution | Last Contribution |
|---|--------------|----------------------------------------------------|---------|-------------|--------------------|--------------------|
| 1 | tahrul       | tahrul@gmail.com                                   | 3       | 186 (93%)   | 2026-06-02         | 2026-06-02         |
| 2 | claude[bot]  | 41898282+claude[bot]@users.noreply.github.com      | 1       | 14 (7%)     | 2026-06-03         | 2026-06-03         |

**Primary Owner**: tahrul (93% of current lines by volume; authored 3 of 4 commits)  
**Most Recent Contributor**: claude[bot] on 2026-06-03 (the commit that introduced lines 171–182)  
**CODEOWNERS**: Not configured

---

## Change Timeline

### `c3b3681` — 2026-06-03

- **Author**: claude[bot] <41898282+claude[bot]@users.noreply.github.com>
- **Co-author**: tahrul <tahrul@users.noreply.github.com>
- **Message**: `fix: add hover tooltip to Contact Us link in footer`
- **Body**: Co-authored-by: tahrul <tahrul@users.noreply.github.com>
- **Ticket References**: None (merged via PR #12)
- **Lines Changed**: +14 / -7
- **What Changed**:
  > The "Contact Us" footer link was restructured from a bare `<Link>` with `group` directly on it, to a wrapping `<div class="group relative cursor-pointer">` that houses both the `<Link>` and a new tooltip `<div>`. The tooltip (lines 178–182) is the net-new code: it shows a styled popover with the label "Contact Us" and a description on hover. This mirrors the existing Cookie Policy and Privacy Policy tooltip pattern. The `-inset-2` class was also replaced with an inline `style={{inset: '-0.5rem'}}` on the hover highlight overlay.

### `de1f25a` — 2026-06-02

- **Author**: tahrul <tahrul@gmail.com>
- **Message**: `Fix missing Privacy Policy hover tooltip in Footer (#6)`
- **Body**: Wraps the Privacy Policy link in a group container and adds an on-hover tooltip matching the existing Cookie Policy pattern. Closes #3
- **Ticket References**: `#6` (PR), `#3` (issue)
- **Lines Changed**: Affected Footer.jsx but not lines 171–182 (those were still the plain `<Link>` at this point)
- **What Changed**:
  > Established the tooltip pattern for Privacy Policy. Lines 171–182 existed then as a plain `<Link to="/contact">` without a tooltip wrapper — the fix that added the tooltip for Contact Us came one day later in `c3b3681`.

### `7aa5e57` — 2026-06-02

- **Author**: tahrul <tahrul@gmail.com>
- **Message**: `Initial commit: Job Portal React UI App`
- **Ticket References**: None
- **What Changed**:
  > First version of Footer.jsx. The Contact Us link was created as a simple `<Link>` without any hover tooltip infrastructure.

---

## Line-by-Line Blame (Lines 171–182, Current State)

All 12 lines introduced in a single commit:

| Lines   | Code (truncated)                                                    | Author      | Date       | Commit Message                                 |
|---------|---------------------------------------------------------------------|-------------|------------|------------------------------------------------|
| 171–177 | `<Link to="/contact" className="relative hover:text-white ...`      | claude[bot] | 2026-06-03 | fix: add hover tooltip to Contact Us link...   |
| 178     | `<div className="absolute bottom-full ... shadow-2xl">`             | claude[bot] | 2026-06-03 | fix: add hover tooltip to Contact Us link...   |
| 179     | `<p className="font-semibold ...">Contact Us</p>`                   | claude[bot] | 2026-06-03 | fix: add hover tooltip to Contact Us link...   |
| 180     | `<p className="leading-relaxed">Have questions or feedback?...</p>` | claude[bot] | 2026-06-03 | fix: add hover tooltip to Contact Us link...   |
| 181     | `<div className="absolute top-full ... border-t-gray-800"></div>`   | claude[bot] | 2026-06-03 | fix: add hover tooltip to Contact Us link...   |
| 182     | `</div>` (tooltip container close)                                  | claude[bot] | 2026-06-03 | fix: add hover tooltip to Contact Us link...   |

All 12 lines share the same blame commit: `c3b3681`.

---

## Linked Tickets & References

| Ticket | Commit    | Author      | Date       | Commit Subject                                          |
|--------|-----------|-------------|------------|---------------------------------------------------------|
| PR #12 | `c3b3681` | claude[bot] | 2026-06-03 | fix: add hover tooltip to Contact Us link in footer     |
| PR #6  | `de1f25a` | tahrul      | 2026-06-02 | Fix missing Privacy Policy hover tooltip in Footer (#6) |
| #3     | `de1f25a` | tahrul      | 2026-06-02 | Closes #3 (Privacy Policy tooltip issue)                |

---

## Insights

- **Churn Assessment**: Low churn. The file has 4 commits over 2 days, all in a short initial development burst. No churn risk apparent.
- **Bus Factor**: Low risk. tahrul owns 93% of lines but claude[bot] (acting as an AI coding assistant) authored the specific lines 171–182. Both are effectively the same team member working in tandem.
- **Stale Code Risk**: N/A — file is brand new (2 days old as of investigation date).
- **Review Gaps**: The `c3b3681` commit (which introduced all 12 investigated lines) has no standalone ticket reference — it was merged via PR #12. The PR title matches the commit message, so the intent is documented, but no issue number was formally linked in the commit body. Consider linking issues in commit bodies for traceability.
- **Pattern Note**: Lines 171–182 follow the same tooltip pattern established for Cookie Policy (and later Privacy Policy in `de1f25a`). The three footer links are now consistent in behavior. If the tooltip pattern ever needs updating, all three should be changed together.
