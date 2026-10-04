# rules_{js|ts}: JavaScript & TypeScript with Bazel — BazelCon 2026 workshop

A small React app (the product table from react.dev's
[Thinking in React](https://react.dev/learn/thinking-in-react)) split across
three pnpm workspace packages. Over four steps you'll generate its Bazel `BUILD`
files with [Aspect Gazelle](https://github.com/aspect-build/aspect-gazelle),
bundle and serve it with webpack in watch mode, convert it to TypeScript with
[`rules_ts`](https://github.com/aspect-build/rules_ts), and run its tests with [`rules_jest`](https://github.com/aspect-build/rules_jest) — using a small Gazelle plugin
written in Starlark (`tools/gazelle/jest.axl`).

```
app/              @demo/app       App, FilterableProductTable, index (entry), webpack config
libs/ui/          @demo/ui        SearchBar, ProductTable, ProductRow, ProductCategoryRow
libs/products/    @demo/products  PRODUCTS data, filterProducts, groupByCategory
tools/gazelle/    the Gazelle target + the jest.axl Starlark plugin
```

`app` imports `@demo/ui` and `@demo/products`; `@demo/ui` imports `@demo/products`.
Every package has a `package.json` and an empty `BUILD.bazel` file — Gazelle fills them in.

## Prerequisites

- [Bazelisk](https://github.com/bazelbuild/bazelisk) (installed as `bazel`), or the
  [Aspect CLI](https://aspect.build/docs/cli/install) (`aspect`)
- Optional: Node.js 22 (`nvm use` reads `.nvmrc`) and pnpm 10 (`corepack enable`), only to run step 1.
  Bazel downloads its own Node, the version in `.nvmrc`, from step 2 on.
- Optional: [ibazel](https://github.com/bazelbuild/bazel-watcher) for step 3

## Before the session

```sh
git clone https://github.com/jbedard/rules-js-ts-workshop.git && cd rules-js-ts-workshop
bazel fetch //...     # pre-download Bazel deps while the Wi-Fi is good
```

## Steps

| Step | What you do | Catch-up branch |
| ---- | ----------- | --------------- |
| 1 | `pnpm install && pnpm start`: the app with plain pnpm + webpack, no Bazel. No Node/pnpm? Skip running it and just look through the layout and `package.json` files. | `main` |
| 2 | `bazel run //tools/gazelle` fills in every empty `BUILD.bazel` file; `bazel build //...` | `step-2-gazelle` |
| 3 | Add a `webpack_bundle` + `webpack_devserver` to `app/BUILD.bazel`; run with `ibazel` or `aspect run --watch` | `step-3-webpack` |
| 4a | Rename `.js` → `.ts`, add types, and rename `tsconfig.json.disabled` to `tsconfig.json`. Sources only: no Bazel changes yet | `step-4a-typescript-sources` |
| 4b | Enable `aspect_rules_ts` (`MODULE.bazel`, `.bazelrc`), delete the `.js` directives from the root `BUILD.bazel`, re-run Gazelle. TypeScript compiles in `ts_project` actions; the webpack config doesn't change (and `pnpm start` stops working: webpack only bundles) | `step-4b-typescript-bazel` |
| 5 | Add a new TypeScript package, `libs/price`; update `pnpm-lock.yaml` with the Bazel-managed pnpm; re-run Gazelle | `step-5-new-package` |
| 6 | Enable `aspect_rules_jest` and the `jest` plugin, re-run Gazelle, `bazel test //...` | `step-6-jest` |
| 7 | Use SWC as a fast transpiler: enable [`aspect_rules_swc`](https://github.com/aspect-build/rules_swc), add a `ts_project` macro in `tools/ts`, point Gazelle at it with `map_kind` | `step-7-swc` |
| 8 | Enable `isolatedDeclarations` (fix the one file missing a return type), re-run Gazelle: `.d.ts` files are generated without waiting on dependencies | `step-8-isolated-declarations` |

Fell behind? Each completed step is also merged into `main`:

```sh
git stash -u            # or: git reset --hard
git pull origin main    # or: git checkout step-N-...
```

## Handy commands

```sh
bazel run //tools/gazelle                 # update BUILD files
bazel run //tools/gazelle:gazelle.check   # fail if BUILD files are stale (CI)
aspect gazelle                            # same, via the Aspect CLI
aspect gazelle --watch                    # keep BUILD files in sync as you edit
bazel query //...                         # what did Gazelle generate?
```
