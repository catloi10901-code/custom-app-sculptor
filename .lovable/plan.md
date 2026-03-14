

## Plan: Make campaigns dynamic (database-driven) with admin management

### Current State
Campaigns are hardcoded in `CampaignsTab.tsx` with static data and i18n keys. The user wants to:
1. Rename campaigns
2. Edit descriptions, participant counts, goals
3. Manage all this from the admin panel

### Approach

**1. Create `campaigns` table** with columns: id, icon, title, description, participants, goal, is_active, sort_order, created_at, updated_at. RLS: public read, admin write.

**2. Seed initial data** — insert the 6 existing campaigns with the renamed titles:
- "72h cho hòa bình thế giới" (was World Peace)
- "40 ngày cầu nguyện" (was Healing & Recovery)
- Keep other 4 campaigns as-is

**3. Update `CampaignsTab.tsx`** — fetch campaigns from DB instead of hardcoded array. Remove i18n keys for campaign content (since admin edits directly).

**4. Create `AdminCampaigns.tsx`** — admin page to list, edit, and manage campaigns (title, description, icon, participants, goal, active status).

**5. Add admin route** — register `/admin/campaigns` in App.tsx and add nav item in AdminLayout.

### Technical Details

- Migration: CREATE TABLE campaigns with appropriate columns and RLS policies
- Insert tool: seed the 6 campaigns with Vietnamese text
- CampaignsTab: replace static array with `useEffect` + supabase query
- AdminCampaigns: table/card view with inline edit or modal edit for each campaign
- Campaign join tracking stays client-side for now (same as current behavior)

