
## Media Preloading & Performance Optimization Plan

### Overview
I'll implement comprehensive preloading for all media assets (3 videos + background music) to eliminate delays and ensure smooth playback throughout the experience.

---

### Changes

#### 1. Add Preload Links in `index.html`
Add `<link rel="preload">` tags in the HTML head for critical media files:
- Preload `video1.mp4` with high priority (shown first)
- Preload `bg-music.mp3` for seamless audio start
- Prefetch `video2.mp4` and `video3.mp4` (loaded later, lower priority)

#### 2. Create Media Preloader Hook
Create `src/hooks/useMediaPreloader.ts`:
- Programmatically preloads all media using JavaScript
- Provides loading progress state
- Uses `HTMLVideoElement` and `HTMLAudioElement` with `preload="auto"`
- Caches references to avoid re-downloading

#### 3. Update `Index.tsx`
- Import and use the preloader hook
- Start preloading immediately on mount
- Optionally show a subtle loading indicator if media isn't ready

#### 4. Update Video Components with Preload Hints
**VideoPlayer.tsx:**
- Add `preload="auto"` attribute
- Use `poster` frame for instant visual feedback

**CelebrationVideoPlayer.tsx:**
- Add `preload="auto"` attribute
- Pre-create video elements for video2 and video3 in the DOM (hidden)

#### 5. Update `BackgroundMusic.tsx`
- Ensure `preload="auto"` is set (already done)
- Add event listener for `canplaythrough` to know when ready

---

### Technical Details

```text
+---------------------------+
|       index.html          |
+---------------------------+
| <link preload video1>     |  ← High priority, loads first
| <link preload bg-music>   |  ← Needed soon after envelope
| <link prefetch video2>    |  ← Lower priority, needed later
| <link prefetch video3>    |  ← Lower priority, needed last
+---------------------------+

+---------------------------+
|   useMediaPreloader.ts    |
+---------------------------+
| - Preloads all 4 assets   |
| - Tracks loading progress |
| - Returns isReady boolean |
+---------------------------+
           ↓
+---------------------------+
|       Index.tsx           |
+---------------------------+
| - Calls useMediaPreloader |
| - Assets cached in memory |
+---------------------------+
```

---

### File Changes Summary

| File | Action |
|------|--------|
| `index.html` | Add preload/prefetch link tags |
| `src/hooks/useMediaPreloader.ts` | **Create** - hook for JS-based preloading |
| `src/pages/Index.tsx` | Import and use preloader hook |
| `src/components/valentine/VideoPlayer.tsx` | Add preload="auto" and poster |
| `src/components/valentine/CelebrationVideoPlayer.tsx` | Add preload="auto", prefetch future videos |
| `src/components/valentine/BackgroundMusic.tsx` | Already has preload="auto" (verify) |

---

### Notes on Media Size
The videos are user-uploaded MP4s. For optimal performance:
- The preloading strategy caches them in browser memory
- Using `prefetch` for later videos prevents blocking initial load
- No compression is applied server-side (would require video processing service)

This approach ensures all media is ready before it's needed, eliminating playback delays while keeping the initial experience snappy.
