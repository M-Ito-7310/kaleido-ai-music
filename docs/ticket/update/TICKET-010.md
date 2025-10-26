# TICKET-010: Social Features

> Supabase Realtime、WebRTC、Web Share APIを使用したソーシャル機能

---

## 📋 Ticket Information

| Field | Value |
|-------|-------|
| **Ticket ID** | TICKET-010 |
| **Phase** | Phase 10 |
| **Status** | 🟡 Partial |
| **Priority** | 🟡 Medium |
| **Assignee** | Development Team |
| **Created Date** | 2025-10-25 |
| **Completed Date** | 2025-10-26 (Partial) |
| **Time Estimate** | 3-4 hours (full) |
| **Actual Time** | ~30 minutes (Web Share only) |

---

## 🎯 Objectives

- [x] Implement track sharing with Web Share API
- [ ] Create collaborative playlists with Supabase Realtime (deferred)
- [ ] Build Listen Together feature with WebRTC (deferred)
- [ ] Add comments and reactions system (deferred)
- [ ] Create user profile pages (deferred)

---

## 📦 Deliverables

### Files to Create
- `components/social/ShareButton.tsx`
- `components/social/CollaborativePlaylist.tsx`
- `components/social/ListenTogether.tsx`
- `components/social/CommentSection.tsx`
- `components/social/UserProfile.tsx`
- `lib/realtime/supabase.ts`
- `lib/webrtc/peerConnection.ts`

### Dependencies to Add
```json
{
  "@supabase/supabase-js": "^2.39.0",
  "peerjs": "^1.5.2"
}
```

---

## 🔗 Dependencies

### Blocked By
- TICKET-009 (recommendations for sharing)

---

## ✅ Acceptance Criteria

**Must Have**:
- [x] Web Share API integration
- [ ] Real-time collaborative playlists (deferred - requires Supabase setup)
- [ ] WebRTC synchronized playback (deferred - requires signaling server)
- [ ] Comments and reactions (deferred - requires backend)
- [ ] User profiles (deferred - requires authentication)

---

## 🔗 References

- Phase Documentation: [docs/update/Phase-10.md](../update/Phase-10.md)

---

## 📝 Implementation Notes

**Features Implemented** (Phase 1):

1. **ShareButton Component** ([components/social/ShareButton.tsx](../../components/social/ShareButton.tsx)):
   - Web Share API integration for native sharing on mobile devices
   - Clipboard fallback for desktop browsers
   - Two display variants: default (with text) and icon-only
   - Three size options: sm, md, lg
   - Visual feedback with "Copied!" state
   - Framer Motion animations
   - Accessible with ARIA labels

2. **MusicCard Integration**:
   - Share button added to card overlay (top-right corner)
   - Icon variant for space efficiency
   - Click propagation prevented to avoid navigation

3. **FullScreenPlayer Integration**:
   - Share button in header alongside 3D visualizer and settings
   - Consistent styling with other header buttons
   - Integrated with current track context

**Web Share API Features**:
- Native share sheet on mobile (iOS, Android)
- Shares track title, artist, description, and URL
- Automatic fallback to clipboard on desktop
- Error handling for user cancellation
- Success feedback with temporary "Copied!" message

**Deferred Features** (require backend infrastructure):

The following features require additional infrastructure setup and are deferred to future development:

1. **Collaborative Playlists** (requires Supabase):
   - Real-time database setup
   - User authentication system
   - Playlist ownership and permissions
   - Presence tracking
   - Database schema for playlists and members

2. **Listen Together** (requires WebRTC signaling):
   - Signaling server setup (Socket.io or Supabase Realtime)
   - Room management
   - Synchronized playback state
   - PeerJS integration
   - Network latency handling

3. **Comments & Reactions** (requires backend):
   - Comment storage (database)
   - User authentication
   - Real-time updates
   - Moderation system
   - Emoji reactions storage

4. **User Profiles** (requires authentication):
   - User authentication system (Supabase Auth or custom)
   - Profile data storage
   - Avatar upload/management
   - Privacy settings
   - Follow/follower system

**Rationale for Partial Implementation**:
- Web Share API provides immediate value without backend dependencies
- No environment variables or external services required
- Works entirely client-side
- Enables users to share tracks via native OS sharing
- Foundation for future social features

**Future Enhancements**:
- Share to specific social platforms (Twitter, Facebook, WhatsApp)
- Track sharing statistics
- Generate shareable preview cards (Open Graph)
- QR code generation for easy sharing
- Deep linking for mobile apps

---

**Last Updated**: 2025-10-26
**Status**: 🟡 Partial - Web Share API implemented, other social features deferred pending backend setup
