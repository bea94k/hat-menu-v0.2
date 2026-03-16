# Mobile-Friendly Styling Plan  

## Scope and Guardrails
- Styling and layout only (no data-layer, schema, or feature logic changes).
- Apply one compact, mobile-friendly visual style across **all** breakpoints for now.
- Tablet and desktop should intentionally match the mobile-sized look/structure.
- Use existing Tailwind setup and existing components/pages.

## Definition of Done
- Core app flows are visually usable on small screens (320px–767px).
- The same compact layout and spacing is used consistently at 768px+ as well.
- No horizontal scrolling in normal app views.
- Touch targets are comfortably tappable (minimum 24 x 24 pixels) and forms are easy to complete at all sizes.

---

## Step-by-Step Plan (Commit-Sized)

## ✅ Step 1 — Page layout system (wrapper, H1, padding, text breaking, overflow)
**Commit goal:** Standardize page-level structure for consistent compact layout.

**Tasks**
1. Normalize page wrapper widths, side padding, and vertical spacing.
2. Adjust `h1` and key heading spacing/sizing to avoid crowding.
3. Ensure long text breaks correctly and eliminate horizontal overflow globally.

**Acceptance criteria**
- All main pages share consistent compact spacing.
- No horizontal scrolling in normal views.
- Headings and long strings wrap cleanly.

✅ Done:
- Shared layout wrapper that takes title as prop for H1.

---

## ✅ Step 2 — Forms foundation: shared inputs and buttons
**Commit goal:** Standardize the base form controls used across the app.

**Tasks**
1. Normalize shared input, textarea, select, and button sizing/spacing styles.
2. Ensure labels, helper text, and validation messages wrap cleanly.
3. Ensure tap/click targets meet minimum `24 x 24` size.

**Acceptance criteria**
- Form controls look consistent and readable at all widths.
- No clipping/overflow in shared form controls.

✅ Done:
- Reusable Button, Input, DateInput, Select, Label, FormInputError components in /primitives directory.
- Error display added to date inputs in menu creation.
- Cleaned up aria use.

---

## ✅ Step 3 — Add Recipe form layout pass
**Commit goal:** Make the add recipe form compact and easy to complete across breakpoints.

**Tasks**
1. Adjust section spacing and field grouping for a compact one-flow layout.
2. Ensure ingredient-related inputs/rows wrap and align correctly on narrow widths.
3. Keep actions clearly visible and easy to tap.

**Acceptance criteria**
- Add recipe form is readable and easy to complete from `320px+`.
- No horizontal scroll or text clipping in the form.

✅ Done:
- Spacing adjusted, no horizontal scrolling nor weird wrapping of text or elements.

---

## ✅ Step 4 — Add Menu form layout pass
**Commit goal:** Make the add menu form match the same compact form system.

**Tasks**
1. Align field spacing, section rhythm, and action placement with shared form styles.
2. Ensure all menu form content wraps without overflow.
3. Keep the compact style consistent with add recipe.

**Acceptance criteria**
- Add menu form has consistent spacing and readability at all widths.
- No horizontal scroll or overlapping form elements.

✅ Done:
- Spacing adjusted, no horizontal scrolling nor weird wrapping of text or elements.
- Recipe per day and its Up/Down/Change buttons visually grouped.

---

## ✅ Step 5 — Login form + Sign-in page form layout
**Commit goal:** Improve login form readability and spacing, including when rendered with navbar.

**Tasks**
1. Apply shared compact input/button standards to sign-in form.
2. Verify form and surrounding layout spacing on small screens.
3. Ensure form remains clear and balanced when navbar is visible.

**Acceptance criteria**
- Login form is clean, compact, and easy to use at `320px+`.
- No overlap between sign-in content and navigation.

✅ Done:
- Common primitives used in the form.
- Content centered horizontally and vertically, spacing adjusted.
- Navbar not visible in the sign in page anymore.

---

## ✅ Step 6 — Navbar responsiveness (including Sign-in page)
**Commit goal:** Ensure navbar stays usable and readable in all app contexts.

**Tasks**
1. Improve navbar wrapping/stacking behavior for compact layout.
2. Adjust spacing so links/actions do not crowd or clip.
3. Verify navbar behavior specifically on sign-in page and main app pages.

**Acceptance criteria**
- Navbar is readable and operable from `320px+`.
- No clipped nav items or layout jumps across pages.

✅ Done:
- No navbar on sign-in page.
- After auth, navbar split into top (sign out) and bottom (links to recipes and menus).
- Consistent styling especially for bottom button-looking links.
- No clipping or overflow (depends on the short wording).
- Both navbars height is 40px.

---

## ✅ Step 7 — Action-state buttons (loading/saving disabled state)
**Commit goal:** Improve UX feedback during in-progress actions.

**Tasks**
1. Ensure submit/action buttons are disabled while corresponding action is in progress.
2. Ensure form fields are disabled or set to read-only while corresponding action is in progress.
3. Verify behavior on add recipe, add menu, and login flows.
4. Apply consistent disabled/read-only visual styling for loading/saving states.

**Acceptance criteria**
- Buttons cannot be re-submitted while loading/saving.
- Form fields are non-editable (disabled or read-only) while loading/saving.
- Disabled/loading/read-only states are visually clear and consistent.

✅ Done:
- Add recipe, add menu, and sign-in forms now set form-wide loading state via `isSubmitting`.
- Form controls are disabled directly while submitting (inputs, date fields, ingredient inputs/selects, add/remove ingredient actions, and menu action buttons).
- Submit buttons are disabled while submitting and show loading labels (`Saving...` in recipe/menu forms, `Signing in...` in sign-in).
- Status regions use `role="status"` consistently for progress/success/error text.

---

## Step 8 — Recipe card readability pass
**Commit goal:** Improve recipe card legibility in compact layout.

**Tasks**
1. Tune internal spacing and text wrapping for recipe card content.
2. Ensure metadata/actions remain readable without crowding.
3. Prevent overflow from long recipe names/content.

**Acceptance criteria**
- Recipe cards remain readable and balanced at `320px+`.
- No clipping or horizontal overflow in card content.

---

## Step 9 — Menu card/list readability pass
**Commit goal:** Improve menu card/list legibility in compact layout.

**Tasks**
1. Tune spacing and text hierarchy for menu card/list items.
2. Ensure long menu names/content wrap safely.
3. Keep card/list action areas clear and non-crowded.

**Acceptance criteria**
- Menu cards/lists are readable and stable at `320px+`.
- No overflow or clipped text in menu list views.

---

## Step 10 — Typography tuning + responsive QA (320px and up)
**Commit goal:** Final typography pass and end-to-end small-screen validation.

**Tasks**
1. Evaluate typography density and scale down where needed for smaller screens.
2. Verify consistent type hierarchy across forms, cards, navbar, and page headings.
3. Run full visual QA at widths `320px`, `360px`, `390px`, `430px`, `768px`, and larger desktop widths.
4. Fix remaining styling-only issues found in QA.

**Acceptance criteria**
- Typography feels readable and proportionate on small screens.
- All targeted views pass visual QA from `320px+` with no horizontal scrolling.
