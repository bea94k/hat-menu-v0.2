## Plan: HatMenu PWA Implementation

Make the app installable on device. Offline at least for read access.

**Steps**

[x] Use vite-plugin-pwa, configure it.
[x] (through vite-plugin-pwa and vite.config.ts) Add manifest metadata (`name`, `short_name`, `start_url`, `scope`, `display`, `theme_color`, `background_color`) and include app icons.
[x] (through vite-plugin-pwa and vite.config.ts) Add iOS/mobile web app meta tags and manifest link in `hat-menu/index.html`.
[x] (through vite-plugin-pwa, default) Register the service worker from startup in `hat-menu/src/main.tsx` using virtual module registration from `vite-plugin-pwa`.
[x] Document, especially local testing.

[x] Make updating the worker an onClick, not immediate. Create a banner.
[nope] What does the "ready to work offline" really mean? Fetching data won't work, saving new data won't work.
[nope] Make an 'offline, changes might not be saved' banner.
[x] Make bottom navigation buttons taller.
[x] Add favicon.
[ ] The newest (1.2.0) version of vite-plugin-pwa uses (nested) high-vulnerability version of serialize-javascript. Try setting an override to that package version (remember to document it) and test if everything still works okay.

**Goals / expected result**
1. Service worker available. When new one available, it waits and is only applied when user clicks "refresh" **in the UI banner**.
2. Icons and colors appear in splash screen.
3. Test it all as desktop "app", then when deployed, test on mobile.

