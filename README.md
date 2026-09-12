# React + TypeScript + Vite

## Project architecture

Organize feature code as **layer → slice → segment**:
`src/<layer>/<slice>/<segment>/`. Create only the segments a slice needs: `lib`,
`model`, `api`, and `ui`.

| Layer            | Responsibility                                              |
| ---------------- | ----------------------------------------------------------- |
| `app`            | Bootstrap, providers, and application composition           |
| `pages`          | Screen layout and composition of widgets and scenes         |
| `widgets`        | DOM interface blocks such as file source, tree, and details |
| `scene`          | 3D presentation, geometry, camera, and picking              |
| `store`          | Shared mutable application state                            |
| `infrastructure` | External formats, file loading, parsing, and mapping        |
| `domain`         | Framework-independent mine topology and pure selectors      |
| `shared`         | Reusable code and styles without mine-specific knowledge    |

Examples: `pages/mine-viewer/ui/`, `scene/mine/ui/`, `infrastructure/mim/api/`,
and `domain/mine/model/`. `ui` is a segment, not a separate layer. Application
entry files stay in `app`; application-wide configuration such as the UI theme
lives in the `app/config` segment. The `app` layer groups files directly by
segment without feature slices. Icons stay in `assets/icons`, and global CSS
stays in `assets/styles`.

The `shared` layer groups reusable code by purpose:

```text
shared/
├── components/
│   ├── info-layout/
│   ├── load-layout/
│   └── panel/
├── types/
├── utils/
└── constants/
```

Each component directory keeps its own `ui` files and public `index.ts`.
Component-specific props stay with the component. Put reusable types in `types`,
pure helpers in `utils`, and shared constant values in `constants`. Application
configuration such as the theme stays in `app/config`.

Pages compose independent widgets and scenes. Both can use stores and domain
objects; neither imports the other or infrastructure. Stores orchestrate loading
through infrastructure, which builds domain objects. `shared` cannot import
application layers; domain code may consume only its pure helpers and types,
never shared UI or browser adapters.

The current code contains a page, five widgets, a scene placeholder, and shared
layouts and a `Panel` component. The scene placeholder is still DOM UI; WebGL
rendering is future work. Domain types, infrastructure, and stores are planned.
Create their directories when implementing them. File selection currently
remains local state in the page.

Content states live in independent component folders:
`shared/components/info-layout` exports `InfoLayout` for a centered icon, title,
description, and optional action; `shared/components/load-layout` exports
`LoadLayout` for a centered spinner and loading message. There is no shared base
layout; pages compose layouts, widgets, and scenes and choose the content state.
The current page places `InfoLayout` inside the scene placeholder. `LoadLayout`
is available for future asynchronous operations.

`shared/components/panel` exports `Panel`, which owns the section styles and
optional header. Widgets pass `title`, `extra`, `children`, and an optional
`className` instead of importing its CSS module.

## Project conventions

- Configure the application theme in `src/app/config/theme.ts`. It uses a
  monochrome palette with `#111111` as the primary color, white panels, and gray
  surfaces. Component CSS consumes Ant Design `--ant-*` variables so panels,
  content states, and modal dialogs share the same theme.

- Use kebab-case for application source filenames: `app.tsx`,
  `mine-viewer-page.tsx`, `mine-store.ts`, `map-mim-to-domain.ts`.
- Keep React component, class, and type names in PascalCase.
- Declare React components as arrow functions with named exports, for example
  `export const App = () => (...)`. Do not use function declarations or
  `export default` for components; import them by name, such as
  `import { App }`.
- Expose components through `index.ts` at the slice root using explicit named
  re-exports. External consumers import from that entry point, for example
  `import { LoadModal } from '@/widgets/load'`, without reaching into its `ui`
  directory. Within a slice, use direct relative imports instead of importing
  from its own `index.ts`.
- Shared components follow the same public entry point convention, for example
  `import { Panel } from '@/shared/components/panel'`.
- The bootstrap `App` component is an exception: `main.tsx` imports it directly
  from `@/app/app`, without `app/index.ts`.
- Use the `@/` alias for imports across slices and for global assets; it maps to
  `src/` in both Vite and TypeScript. Keep co-located styles and internal
  re-exports relative. Import sorting recognizes `@/` as application code.
- Write component CSS in `*.module.css` files with kebab-case basenames and
  kebab-case class names, for example `mine-viewer-page.module.css` and
  `.viewer-header`. Import component styles as `styles` and use
  `className={styles['viewer-header']}`.
- Define document-wide base styles in plain `src/assets/styles/index.css` and
  import it from `src/app/app.tsx`. This is the exception to the CSS Modules
  rule.
- Scope Ant Design overrides in CSS Modules under a local class and wrap library
  selectors in `:global(...)`.
- Keep conventional documentation and tooling filenames such as `README.md`,
  `AGENTS.md`, `package.json`, and `vite.config.ts` unchanged.

This template provides a minimal setup to get React working in Vite with HMR and
some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react)
  uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc)
  uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev
& build performances. To add it, see
[this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the
configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname
      }
      // other options...
    }
  }
])
```

You can also install
[eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and
[eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for
React-specific lint rules:

```js
// eslint.config.js
import reactDom from 'eslint-plugin-react-dom'
import reactX from 'eslint-plugin-react-x'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname
      }
      // other options...
    }
  }
])
```
