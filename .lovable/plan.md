

## Plan: Popup Prayer Form on "Cầu Nguyện →" Button Click

### Current Behavior
The `QuickPraySection` component has 3 cards (Peace, Poverty, Healing) with "Cầu Nguyện →" buttons that navigate to `/pray?topic=...` via `<Link>`.

### Proposed Changes

**1. Create `PrayerFormDialog` component** (`src/components/pray/PrayerFormDialog.tsx`)
- A reusable Dialog wrapper around the existing `PrayerForm` component
- Accepts `open`, `onOpenChange`, and optional `defaultTopic` props
- When `defaultTopic` is provided, pre-selects that topic in the form
- Uses the existing `Dialog` + `DialogContent` from UI components

**2. Update `PrayerForm` to accept optional `defaultTopic` prop**
- Add `defaultTopic?: string` to `PrayerFormProps`
- Initialize `formTopic` with `defaultTopic` instead of hardcoded `'peace'`

**3. Update `QuickPraySection`**
- Replace `<Link>` with `<button>` or `<div>` that opens the `PrayerFormDialog`
- Track `dialogOpen` state and `selectedTopic` state
- Clicking a card opens the dialog with the card's topic pre-selected
- On successful submission (`onSuccess`), close the dialog

This way all 3 buttons share one dialog instance, the form is the same `PrayerForm` that saves to the database normally, and the topic is pre-filled based on which card was clicked.

