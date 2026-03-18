## Plan: HatMenu PWA Implementation

Make the app installable on device. Offline at least for read access.

**Steps**

[x] Use vite-plugin-pwa, configure it.
[ ] (only if needed, seems like the plugin itself has a dev mode) Set up local server with https-localhost to serve locally through HTTPS for quick testing of PWA updates.
[ ] (?) Add manifest metadata (`name`, `short_name`, `start_url`, `scope`, `display`, `theme_color`, `background_color`) and include app icons.
[ ] (?) Add iOS/mobile web app meta tags and manifest link in `hat-menu/index.html`.
[ ] (?) Register the service worker from startup in `hat-menu/src/main.tsx` using virtual module registration from `vite-plugin-pwa`.
[ ] Document, especially the occasional use of https-localhost.

[ ] Make updating the worker an onClick, not immediate. Create a banner.
[ ] Make an 'offline, changes might not be saved' banner.
[ ] Make bottom navigation buttons taller.
[ ] Add favicon.
[ ] The newest (1.2.0) version of vite-plugin-pwa uses (nested) high-vulnerability version of serialize-javascript. Try setting an override to that package version (remember to document it) and test if everything still works okay.

**Goals / expected result**
1. Service worker available. When new one available, it waits and is only applied when user clicks "refresh" **in the UI banner**.
2. Icons and colors appear in splash screen.
3. Test it all as desktop "app", then when deployed, test on mobile.

