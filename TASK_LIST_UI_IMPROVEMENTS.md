# UI Improvements Task List

**Version:** 1.0  
**Status:** In Progress  
**Created:** 2026-01-05

---

## Tasks

- [x] **Task 1:** Add more frequent (but meaningful) updates at the beginning of levels about what users should expect
  - ✅ Expanded level update system to show informative messages at key level intervals (1, 3, 5, 8, 12, 15, 20, 30, 40, 60, 75, 100)
  - ✅ Messages are meaningful and help users understand what to expect at each stage
  - ✅ Integrated with existing modal system (reuses inferno-feature-modal structure)
  - ✅ Works for all game modes, not just Inferno mode

- [x] **Task 2:** Fix desktop zoom being too aggressive at later stages causing blocks to go outside viewport
  - ✅ Increased `AUTO_ZOOM_MULTIPLIER_DESKTOP` from 1.5 to 1.8
  - ✅ Increased `DESKTOP_ZOOM_PADDING_MULTIPLIER` from 1.2 to 1.4
  - ✅ Increased elevation factor from 0.08 to 0.12
  - ✅ Increased safety margin from 1.02 to 1.05
  - ✅ Platform-specific: desktop only (mobile unchanged)

- [x] **Task 3:** Remove debug button
  - ✅ Removed debug button from HTML
  - ✅ Removed `setupDebugButton()` function and all calls
  - ✅ Removed `logDebugState()` function
  - ✅ Removed debug button references from `setupButtonWatcher()`
  - ✅ Removed keyboard shortcut (Ctrl+Shift+D)
  - ✅ Cleaned up `debugButtonClickHandler` variable

- [x] **Task 4:** Make pause button circular and slightly bigger
  - ✅ Added `pause-button-circular` class to pause button
  - ✅ Updated CSS: `border-radius: 50%`, `width/height: 52px` (increased from 44px)
  - ✅ Increased icon font size from 16px to 18px
  - ✅ Maintains visual consistency with other buttons

---

## Progress

**Started:** 2026-01-05  
**Completed:** 2026-01-05

All tasks have been successfully completed and tested. No linter errors.
