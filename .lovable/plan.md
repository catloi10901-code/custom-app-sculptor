

## Fix: Enable realtime for prayers table

### Problem
The `prayers` table is not added to the Supabase realtime publication. The seed function works (295 prayers in DB), but the frontend realtime subscription in `PrayerWallTab.tsx` receives no events, so new prayers never appear without a manual refresh.

### Solution
Create a migration to add the `prayers` table to the `supabase_realtime` publication:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.prayers;
```

Single migration, no code changes needed. The existing realtime subscription in `PrayerWallTab.tsx` will start receiving INSERT/UPDATE/DELETE events immediately.

