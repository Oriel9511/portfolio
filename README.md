# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Scroll Snapping & Gesture Navigation

This project features a custom slide-by-slide scroll snapping implementation that hijacks standard viewport scrolls to align the viewport to exactly one section at a time.

### Key Features
- **Centralized Slide Controller**: Manages state-driven transitions between slides (`hero`, `quote1`, `work`, `quote2`, `opensource`, `about`, `contact`).
- **Gesture Interception**: Captures mouse wheels (`wheel`), touch gestures (`touchstart`, `touchmove`, `touchend`), and keyboard arrows/Space inputs.
- **Transition Lock**: Prevents double-triggering or scroll bounces by locking scroll events during the 800ms slide-settling duration.
- **Internal Scrollers**: Bypasses slide-snapping transitions when scrolling inside containers marked with `data-internal-scroller="true"` (e.g., tall lists on mobile).
- **Navbar Integration**: Directly synchronizes the Navbar's active indicator and light/dark theme behavior with the centralized active slide index.
