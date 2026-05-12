---
title: "feat: UI Redesign - Exact Match to Reference Design"
type: feat
status: active
created: 2026-05-12
---

# UI Redesign - Exact Match to Reference Design

## Summary

Redesign the zen-proxy dashboard UI to exactly match the reference design in `ui.md`. This includes updating all visual elements (colors, spacing, fonts, buttons, card layouts), implementing a navigation bar with tabs, adding an API key modal for non-free models, and ensuring pixel-perfect consistency with the reference across all components.

The current dashboard has basic functionality but uses a different visual design. The reference design (`ui.md`) provides two complete HTML examples: one showing the main dashboard with model cards, and another showing an API endpoint modal. All elements must be identical to the reference - no deviations allowed.

---

## Problem Frame

The current zen-proxy dashboard (`public/index.html`) has:
- Basic model cards with toggle switches and test buttons
- Endpoint modal for showing LOCAL/TUNNEL/MODEL endpoints
- Tunnel start/stop functionality
- Working CSRF protection and API integration

However, the visual design differs from the reference in `ui.md`:
- Different header layout (missing navigation tabs)
- Different card button layouts (current has small icon buttons, reference has full-width action buttons)
- Different toggle switch positioning
- Missing API key modal for non-free models
- Different bottom status bar layout
- Different mobile navigation

The user requirement is explicit: "semua nya harus sama ui tampilan nya tidak boleh beda kecuali nama sesuai dengan card dll" (everything must be the same, UI display must not differ except for names according to the card, etc.)

---

## Scope Boundaries

### In Scope
- Update header to match reference design with navigation tabs
- Redesign model cards to match reference layout exactly
- Update button styles and positioning per reference
- Implement API key modal for non-free models (triggered when clicking non-free cards)
- Update bottom status bar to match reference
- Update mobile bottom navigation to match reference
- Preserve all existing functionality (tunnel toggle, endpoint modal, test buttons, CSRF)
- Maintain dynamic data loading from server

### Deferred to Follow-Up Work
- Adding actual navigation functionality to tabs (currently decorative)
- Implementing real API key storage/validation
- Adding real-time statistics updates to the monitoring graph
- Implementing actual "View Parameters", "Deploy Node", "Initialize Model" button actions

### Outside This Work
- Backend API changes
- Server-side logic modifications
- Database schema changes
- Authentication/authorization systems

---

## Key Technical Decisions

**Decision 1: Preserve existing JavaScript functionality while updating HTML structure**
- **Rationale:** The current implementation has working tunnel management, endpoint modal, CSRF handling, and API integration. These should not be broken during the UI redesign.
- **Approach:** Update HTML structure and CSS classes while keeping JavaScript event handlers and state management intact. Test all interactive features after each major change.

**Decision 2: Use reference design's exact Tailwind classes**
- **Rationale:** The reference design uses specific Tailwind utility classes for spacing, colors, and typography. To achieve pixel-perfect match, we must use the exact same classes.
- **Approach:** Copy Tailwind class strings directly from `ui.md` for each component, adjusting only dynamic content (model names, context sizes, etc.)

**Decision 3: Implement API key modal as a separate modal component**
- **Rationale:** The reference shows a different modal for API endpoints vs API keys. Non-free models should trigger the API key modal.
- **Approach:** Create a new modal structure following the reference design's API key modal pattern. Show it when clicking cards where `model.verified === false`.

**Decision 4: Keep FREE badge only for verified models**
- **Rationale:** The reference shows FREE badges on some cards but not all. Current logic uses `verified: true` to indicate working free models.
- **Approach:** Show FREE badge only when `model.verified === true`. Non-verified models get no badge and trigger API key modal on click.

---

## Implementation Units

### U1. Update header with navigation tabs

**Goal:** Replace simple centered header with full navigation bar matching reference design

**Requirements:** Match reference header exactly - logo on left, navigation tabs in center (Dashboard, Analytics, Nodes, Settings), notification and account icons on right

**Dependencies:** None

**Files:**
- Modify: `public/index.html` (header section)

**Approach:**
- Replace current header structure with reference design's header
- Add navigation links with proper active state styling (Dashboard active by default)
- Add notification and account_circle icon buttons on the right
- Use exact Tailwind classes from reference: `bg-surface-container`, `border-b border-outline-variant/10`, `h-16`, etc.
- Keep responsive behavior with `hidden md:flex` for desktop nav

**Patterns to follow:**
- Reference design lines 1014-1032 in `ui.md` (second HTML example with navigation)

**Test scenarios:**
- Visual inspection: Header matches reference design exactly
- Responsive: Navigation tabs hidden on mobile, visible on desktop
- Active state: Dashboard tab shows active styling (primary color, bottom border)

**Verification:** Header visually matches reference design. Navigation tabs render correctly on desktop. Mobile view hides tabs appropriately.

---

### U2. Redesign model cards to match reference layout

**Goal:** Update card structure, button layout, and toggle positioning to exactly match reference design

**Requirements:** Cards must match reference including: icon colors (primary/secondary/tertiary rotation), FREE badge positioning, button layout (full-width action buttons vs icon buttons), toggle switch positioning

**Dependencies:** None

**Files:**
- Modify: `public/index.html` (model cards rendering section in JavaScript)

**Approach:**
- Update card HTML template in `renderModels()` function
- Change from small icon buttons (copy, restart) to full-width action buttons
- Move toggle switch to bottom-right with proper label
- Add FREE badge only for verified models
- Rotate icon colors: primary → secondary → tertiary → primary (repeating pattern)
- Use exact Tailwind classes from reference for each card variant
- Preserve existing onclick handlers for test buttons and toggle switches

**Patterns to follow:**
- Reference design lines 156-196 (Card 1 with Test button and toggle)
- Reference design lines 1106-1135 (Card 2 with View Parameters button, no toggle)
- Reference design lines 1137-1166 (Card 3 with Deploy Node button)

**Test scenarios:**
- Visual inspection: Cards match reference design exactly
- FREE badge: Shows only on verified models (minimax-m2.5-free, big-pickle, nemotron-3-super-free)
- Icon colors: Rotate correctly across cards (primary, secondary, tertiary pattern)
- Button functionality: Test buttons still trigger quickTest(), toggle switches still work
- Responsive: Cards stack properly on mobile, grid on desktop

**Verification:** All 16 model cards render with correct layout. Verified models show FREE badge. Non-verified models have no badge. Icon colors rotate correctly. All interactive elements still functional.

---

### U3. Implement API key modal for non-free models

**Goal:** Add modal that appears when clicking non-free model cards, matching reference design's API key modal structure

**Requirements:** Modal should show when clicking cards with `verified: false`, display model name, provide API key input field, have save/cancel buttons

**Dependencies:** U2 (card click handlers need to distinguish free vs non-free)

**Files:**
- Modify: `public/index.html` (add API key modal HTML, update card click handlers)

**Approach:**
- Add new modal HTML structure after existing endpoint modal
- Follow reference design's modal pattern (backdrop, card, header with close button, content area)
- Add click handler to card titles/bodies that checks `model.verified`
- If `verified === false`, show API key modal instead of endpoint modal
- If `verified === true`, show endpoint modal (existing behavior)
- Modal should display: model name, API key input field, save/cancel buttons
- Initially non-functional (save button just closes modal) - actual API key storage deferred

**Patterns to follow:**
- Reference design lines 2413-2468 (API endpoint modal structure as template)
- Adapt for API key input instead of endpoint display

**Test scenarios:**
- Click verified model (minimax-m2.5-free): Shows endpoint modal (existing behavior)
- Click non-verified model (glm-4.7-free): Shows API key modal
- API key modal: Displays correct model name
- Close button: Closes modal
- Backdrop click: Closes modal
- Save button: Closes modal (no actual save yet)

**Verification:** Clicking non-free models opens API key modal. Clicking free models opens endpoint modal. Modal structure matches reference design. All close mechanisms work.

---

### U4. Update bottom status bar to match reference

**Goal:** Redesign the four status cards (Active Nodes, Avg Latency, Usage Balance, Critical Errors) to match reference layout

**Requirements:** Each card should have icon in colored circle on left, metric value and label on right, matching reference spacing and colors

**Dependencies:** None

**Files:**
- Modify: `public/index.html` (bottom status section)

**Approach:**
- Update status bar HTML structure to match reference design
- Each card: colored circle with icon (left) + metric value + label (right)
- Use exact colors from reference: secondary for Active Nodes, primary for Avg Latency, tertiary for Usage Balance, error for Critical Errors
- Use exact Tailwind classes for layout: `flex items-center gap-md`, `w-10 h-10 rounded-full`, etc.
- Keep responsive grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`

**Patterns to follow:**
- Reference design lines 830-867 (first HTML example)
- Reference design lines 2353-2390 (second HTML example)

**Test scenarios:**
- Visual inspection: Status cards match reference design exactly
- Icons: Correct Material Symbols icons (hub, speed, account_balance_wallet, warning)
- Colors: Icon circles use correct background colors (secondary/10, primary/10, tertiary/10, error/10)
- Responsive: Cards stack on mobile, 2 columns on tablet, 4 columns on desktop

**Verification:** Status bar visually matches reference. All four cards render correctly. Responsive behavior works as expected.

---

### U5. Update mobile bottom navigation to match reference

**Goal:** Redesign mobile bottom navigation bar to match reference design

**Requirements:** Four navigation items (Dashboard, Proxies, Usage, Settings) with icons and labels, Dashboard active by default

**Dependencies:** None

**Files:**
- Modify: `public/index.html` (mobile bottom nav section)

**Approach:**
- Update mobile nav HTML structure to match reference
- Each button: icon + label in vertical flex layout
- Dashboard button: primary color (active state)
- Other buttons: on-surface-variant color (inactive state)
- Use exact Tailwind classes from reference: `flex flex-col items-center gap-1`, `text-[10px]`, etc.
- Keep responsive behavior: `md:hidden` (only show on mobile)

**Patterns to follow:**
- Reference design lines 872-889 (first HTML example)
- Reference design lines 2395-2412 (second HTML example)

**Test scenarios:**
- Visual inspection: Mobile nav matches reference design exactly
- Icons: Correct Material Symbols icons (dashboard, router, bar_chart, settings)
- Active state: Dashboard shows primary color
- Inactive state: Other items show on-surface-variant color
- Responsive: Nav hidden on desktop, visible on mobile

**Verification:** Mobile navigation visually matches reference. Active/inactive states correct. Responsive behavior works.

---

### U6. Update endpoint modal to match reference design exactly

**Goal:** Ensure existing endpoint modal matches reference design's modal structure and styling

**Requirements:** Modal should match reference including backdrop blur, card styling, header layout, endpoint rows with copy buttons, tunnel power button

**Dependencies:** None

**Files:**
- Modify: `public/index.html` (endpoint modal section)

**Approach:**
- Review current endpoint modal structure against reference design
- Update any mismatched Tailwind classes to match reference exactly
- Ensure backdrop uses `bg-background/80 backdrop-blur-md`
- Ensure modal card uses `bg-surface-container border border-outline-variant/20 rounded-xl shadow-2xl`
- Ensure header has icon + title + close button layout
- Ensure endpoint rows match reference spacing and styling
- Keep existing functionality (tunnel toggle, copy buttons, dynamic URL display)

**Patterns to follow:**
- Reference design lines 2413-2468 (API endpoint modal)

**Test scenarios:**
- Visual inspection: Modal matches reference design exactly
- Backdrop: Blur effect visible
- Header: Icon, title, close button properly aligned
- Endpoint rows: LOCAL, TUNNEL, MODEL rows with proper spacing
- Copy buttons: Still functional
- Tunnel toggle: Still functional
- Close mechanisms: Close button, backdrop click, ESC key all work

**Verification:** Endpoint modal visually matches reference. All interactive elements still functional. Modal behavior unchanged.

---

### U7. Final visual QA and cross-browser testing

**Goal:** Verify pixel-perfect match to reference design across all components and browsers

**Requirements:** Every element must match reference design exactly - no visual differences allowed

**Dependencies:** U1, U2, U3, U4, U5, U6

**Files:**
- Review: `public/index.html` (entire file)

**Approach:**
- Open dashboard in browser side-by-side with reference design screenshots
- Compare each section systematically: header, cards, status bar, mobile nav, modals
- Check spacing, colors, fonts, borders, shadows, hover states
- Test responsive breakpoints (mobile, tablet, desktop)
- Test in Chrome, Firefox, Safari if available
- Document any remaining discrepancies and fix them

**Patterns to follow:**
- Reference design `ui.md` (entire file as source of truth)

**Test scenarios:**
- Header: Matches reference exactly
- Model cards: All 16 cards match reference layout
- FREE badges: Only on verified models
- Icon colors: Rotate correctly (primary, secondary, tertiary)
- Button styles: Match reference (full-width action buttons)
- Toggle switches: Match reference positioning
- Status bar: Matches reference layout
- Mobile nav: Matches reference layout
- Endpoint modal: Matches reference layout
- API key modal: Matches reference layout
- Responsive: All breakpoints work correctly
- Hover states: Buttons show correct hover effects
- Active states: Dashboard tab and nav item show active styling

**Verification:** Dashboard is pixel-perfect match to reference design. No visual discrepancies. All functionality preserved. Responsive behavior correct across all breakpoints.

---

## System-Wide Impact

**Frontend:**
- Major HTML structure changes in `public/index.html`
- No JavaScript logic changes (preserve existing functionality)
- No CSS file changes (all styling via Tailwind utility classes)

**Backend:**
- No changes to `server.js`, `models.js`, `stats.js`, or other backend files
- API endpoints remain unchanged
- CSRF token handling unchanged

**Data Flow:**
- Model data still loaded from `/api/models` endpoint
- Status data still loaded from `/api/status` endpoint
- Tunnel control still uses `/api/tunnel/start` and `/api/tunnel/stop`

**User Experience:**
- Visual design completely refreshed
- All existing functionality preserved
- New API key modal for non-free models (UI only, no backend integration yet)
- Navigation tabs added (decorative, no routing yet)

---

## Deferred to Implementation

- Exact pixel measurements for spacing (will use reference Tailwind classes directly)
- Specific hover/focus state transitions (will copy from reference)
- Exact icon sizes and weights (will use reference Material Symbols settings)
- Modal animation timing (will use reference or browser defaults)

---

## Verification Strategy

**Visual Verification:**
1. Open dashboard in browser
2. Compare side-by-side with reference design in `ui.md`
3. Check each component systematically
4. Verify responsive behavior at mobile, tablet, desktop breakpoints

**Functional Verification:**
1. Test all model card buttons (Test, View Parameters, Deploy Node, Initialize Model)
2. Test toggle switches on free models
3. Test clicking free models (should open endpoint modal)
4. Test clicking non-free models (should open API key modal)
5. Test tunnel start/stop functionality
6. Test copy buttons in endpoint modal
7. Test all modal close mechanisms (close button, backdrop, ESC)

**Cross-Browser Verification:**
1. Test in Chrome (primary)
2. Test in Firefox (if available)
3. Test in Safari (if available)
4. Verify consistent rendering across browsers

**Success Criteria:**
- Dashboard is visually indistinguishable from reference design
- All existing functionality still works
- No console errors
- Responsive behavior correct at all breakpoints
- All interactive elements functional
