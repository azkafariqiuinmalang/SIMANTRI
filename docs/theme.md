# Themes

All public pages, authentication screens, farmer/PPL dashboards, review/regional pages, and administrator pages share light/dark/system preferences. Existing exhibition photographs, logos, illustrations, and intentionally dark Dunia Brambang galleries are preserved rather than inverted.

- `src/lib/theme.ts`: strict preference normalization, resolution, and fixed pre-paint bootstrap script.
- `ThemeProvider`: hydration-safe preference store, `simantri.theme` localStorage persistence, cross-tab sync, session fallback when storage is blocked, and live OS preference updates. No cookies, authentication, APIs, or database changes.
- `ThemeSwitcher`: keyboard/touch-accessible native three-option selector with an existing Lucide icon. Public/admin pages use the persistent control beside the language selector; dashboard pages use the header. Labels support Indonesian and Javanese.
- `src/app/theme.css`: charcoal surfaces, semantic foreground/accent tokens, component states and Tailwind's attribute-driven dark variant. Original light utilities remain unchanged; paired dark utilities preserve responsive and interaction variants.

Default preference is system; choosing light keeps the existing light presentation regardless of the device. An inline head script applies the resolved theme before first paint. Only the root HTML attribute uses hydration suppression; content is still checked normally.

Validation: `node --test tests/*.test.cjs`, `npx tsc --noEmit`, `npm run lint`, and `npm run build`. Theme tests check strict defaults, bootstrap with blocked storage, and AA text contrast of semantic foreground pairs on neutral surfaces. Browser QA checks persistence, OS changes, language independence, form-state preservation, and mobile widths. Authenticated screens require a signed-in session for end-to-end visual inspection; no authentication bypass is introduced.
