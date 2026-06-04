# Technical Specification — Issue #11

## 1. Issue Overview

| Field       | Value                                                                 |
|-------------|-----------------------------------------------------------------------|
| Title       | Inside the footer, when user hover on "contact us" no text being displayed |
| Description | The "Contact Us" link in the footer lacked a hover tooltip, unlike "Privacy Policy" and "Cookie Policy" which both had tooltip popups |
| Labels      | None                                                                  |
| State       | Closed (fixed in commit `c3b3681`)                                    |
| Priority    | Low                                                                   |

## 2. Problem Analysis

**Root cause:** In `src/components/Footer.jsx`, the footer contains three policy/info links rendered with tooltip popups on hover: `Privacy Policy`, `Cookie Policy`, and `Contact Us`. The first two were wrapped in a `div.group.relative` container that activates an absolutely-positioned tooltip on hover. The `Contact Us` element, however, was only a bare `<Link>` with a background-highlight div — it had no tooltip text content.

This created an inconsistent UX where hovering "Contact Us" showed only a background glow effect but no informational popup, while the adjacent links showed tooltip cards.

**Evidence from code (`src/components/Footer.jsx`, lines 170–183):**
- `Privacy Policy` (line 144): `div.group.relative` + tooltip card with policy text
- `Cookie Policy` (line 159): `div.group.relative` + tooltip card with cookie text
- `Contact Us` (pre-fix): only `<Link>` with background-highlight, no tooltip

## 3. Proposed Solution

Apply the same `div.group.relative` + tooltip card pattern already used by `Privacy Policy` and `Cookie Policy` to the `Contact Us` link. No new architecture needed — this is a pure template patch using existing Tailwind utility classes and the established hover pattern.

**Trade-off:** The tooltip is purely presentational/informational (no action). A link tooltip naturally competes with the `<Link to="/contact">` navigation — the tooltip is marked `pointer-events-none` to avoid blocking the click target.

## 4. Step-by-Step Implementation

1. **Wrap `Contact Us` in `div.group.relative`** — replace the bare `<Link>` with a wrapper `div` using `className="group relative cursor-pointer"` so Tailwind's `group-hover` utilities can target child elements.
2. **Add background-highlight div** — mirror the `from-primary-600/20 to-purple-600/20` gradient overlay used by `Privacy Policy` and `Cookie Policy`, set `opacity-0 group-hover:opacity-100`.
3. **Add tooltip card** — absolutely positioned above the link (`bottom-full`), containing a title (`Contact Us`) and a short guidance message. Use `opacity-0 group-hover:opacity-100 pointer-events-none` to show/hide without blocking clicks.
4. **Add caret arrow** — add `border-t-gray-800` triangle at `top-full` of the tooltip to visually anchor it to the link.

## 5. Verification Strategy

### Manual Checks

- Hover "Contact Us" in footer → tooltip card appears with guidance text
- Move cursor away → tooltip disappears
- Click "Contact Us" → navigates to `/contact` (tooltip `pointer-events-none` does not block click)
- Hover "Privacy Policy" and "Cookie Policy" → still show their own tooltips (no regression)
- Resize to mobile breakpoint → footer layout remains intact

### Visual Consistency

- Tooltip styling (background color, border, shadow, text size, caret) matches `Privacy Policy` and `Cookie Policy` tooltips exactly

## 6. Files to Modify

| File Path                     | Nature of Change                                      |
|-------------------------------|-------------------------------------------------------|
| `src/components/Footer.jsx`   | Wrap `Contact Us` link with tooltip card (lines ~170–183) |

## 7. New Files to Create

None.

## 8. Existing Utilities to Leverage

| Utility                          | Benefit                                               |
|----------------------------------|-------------------------------------------------------|
| Tailwind `group` / `group-hover` | Hover state scoping without JavaScript                |
| `div.group.relative` pattern     | Already established in `Privacy Policy` / `Cookie Policy` — zero new patterns |
| `pointer-events-none`            | Prevents tooltip overlay from blocking link clicks    |

## 9. Acceptance Criteria

- Hovering "Contact Us" in the footer displays an informational tooltip card
- Tooltip content guides the user (e.g., account help, job listings, partnerships)
- Tooltip matches the visual style of the existing `Privacy Policy` and `Cookie Policy` tooltips
- Clicking the link still navigates to `/contact`
- No visual regressions on adjacent footer links

## 10. Out of Scope

- Adding actual contact form functionality
- Making the tooltip interactive (e.g., clickable links inside)
- Changing the `/contact` route or page content
- Adding tooltips to "Terms of Service" (no issue filed for that link)
