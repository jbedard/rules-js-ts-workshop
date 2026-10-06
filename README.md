# rules_{js|ts}: JavaScript & TypeScript with Bazel — BazelCon 2026 workshop

A small React app (the product table from react.dev's
[Thinking in React](https://react.dev/learn/thinking-in-react)) split across
three pnpm workspace packages. You'll generate its Bazel `BUILD` files with
[Aspect Gazelle](https://github.com/aspect-build/aspect-gazelle), run its tests
with [`rules_jest`](https://github.com/aspect-build/rules_jest) using a small
Gazelle plugin written in Starlark (`tools/gazelle/jest.axl`), bundle and serve
it with webpack in watch mode, and convert it to TypeScript with
[`rules_ts`](https://github.com/aspect-build/rules_ts).

```
app/              @demo/app       App, FilterableProductTable, index (entry), webpack config
libs/ui/          @demo/ui        SearchBar, ProductTable, ProductRow, ProductCategoryRow
libs/products/    @demo/products  PRODUCTS data, filterProducts, groupByCategory
tools/gazelle/    the Gazelle target + the jest.axl Starlark plugin
```

`app` imports `@demo/ui` and `@demo/products`; `@demo/ui` imports `@demo/products`.
Every package has a `package.json` and an empty `BUILD.bazel` file for Gazelle to fill in.

## Prerequisites

Required:

- [Git](https://git-scm.com/downloads)
- [Bazelisk](https://bazel.build/install/bazelisk), installed as `bazel`
  ([releases](https://github.com/bazelbuild/bazelisk/releases)). It reads `.bazelversion` and downloads that Bazel.
  Or the [Aspect CLI](https://aspect.build/docs/cli/install) (`aspect`), which does the same and adds `aspect gazelle` and `aspect run --watch`.

Optional:

- [Node.js](https://nodejs.org/en/download) 22 and [pnpm](https://pnpm.io/installation) 10, only to run step 1 without Bazel.
  [nvm](https://github.com/nvm-sh/nvm) picks the Node version from `.nvmrc` (`nvm use`), and
  [corepack](https://nodejs.org/api/corepack.html) picks the pnpm version from `package.json` (`corepack enable`).
  From step 2 on, Bazel downloads its own Node (the version in `.nvmrc`) and pnpm.
- [ibazel](https://github.com/bazelbuild/bazel-watcher) for watch mode in step 4, unless you use `aspect run --watch`.

## Before the session

```sh
git clone https://github.com/jbedard/rules-js-ts-workshop.git && cd rules-js-ts-workshop
bazel fetch //...     # pre-download Bazel deps while the Wi-Fi is good
```

## Steps

Copy-paste snippets for every step are in [STEPS.md](STEPS.md).

| Step | What you do | Branch |
| ---- | ----------- | ------ |
| 1 | `pnpm install && pnpm start`: the app with plain pnpm + webpack, no Bazel; `pnpm test` runs the tests. No Node/pnpm? Skip running it and just look through the layout and `package.json` files. | `main` |
| 2 | `bazel run //tools/gazelle` fills in every empty `BUILD.bazel` file; `bazel build //...` | `step-2-gazelle` |
| 3 | Enable `aspect_rules_jest` and the `jest` Gazelle plugin, re-run Gazelle, `bazel test //...` ([snippets](STEPS.md#step-3)) | `step-3-jest` |
| 4 | Uncomment the Step 4 block in `MODULE.bazel`, then add a `webpack_bundle` + `webpack_devserver` to `app/BUILD.bazel` ([snippets](STEPS.md#step-4)); run with `ibazel` or `aspect run --watch` | `step-4-webpack` |
| 5a | Rename `.js` → `.ts`, add types, and rename `tsconfig.json.disabled` to `tsconfig.json`. Sources only: no Bazel changes yet ([snippets](STEPS.md#step-5a)) | `step-5a-typescript-sources` |
| 5b | Enable `aspect_rules_ts` (`MODULE.bazel`, `.bazelrc`), re-run Gazelle. TypeScript compiles in `ts_project` actions; the tests, the webpack targets and the webpack config don't change (and `pnpm start` stops working: webpack only bundles) ([snippets](STEPS.md#step-5b)) | `step-5b-typescript-bazel` |
| 6 | Add a new TypeScript package, `libs/price`; update `pnpm-lock.yaml` with the Bazel-managed pnpm; re-run Gazelle ([snippets](STEPS.md#step-6)) | `step-6-new-package` |
| 7 | Use SWC as a fast transpiler: enable [`aspect_rules_swc`](https://github.com/aspect-build/rules_swc), add a `ts_project` macro in `tools/ts`, point Gazelle at it with `map_kind` ([snippets](STEPS.md#step-7)) | `step-7-swc` |
| 8 | Enable `isolatedDeclarations` (fix the one file missing a return type), re-run Gazelle: `.d.ts` files are generated without waiting on dependencies ([snippets](STEPS.md#step-8)) | `step-8-isolated-declarations` |

Fell behind? Each step is merged into `main` as we finish it:

```sh
git stash -u && git pull origin main
```

## Handy commands

```sh
bazel run //tools/gazelle                 # update BUILD files
bazel run //tools/gazelle:gazelle.check   # fail if BUILD files are stale (CI)
aspect gazelle                            # same, via the Aspect CLI
aspect gazelle --watch                    # keep BUILD files in sync as you edit
bazel query //...                         # what did Gazelle generate?
```

## Links

Rulesets used in the workshop:

- [rules_js](https://github.com/aspect-build/rules_js): npm packages from `pnpm-lock.yaml`, `js_library`, `npm_package`
- [rules_jest](https://github.com/aspect-build/rules_jest): `jest_test`
- [rules_webpack](https://github.com/aspect-build/rules_webpack): `webpack_bundle`, `webpack_devserver`
- [rules_ts](https://github.com/aspect-build/rules_ts): `ts_project`
- [rules_swc](https://github.com/aspect-build/rules_swc): SWC as the TypeScript transpiler
- [rules_nodejs](https://github.com/bazel-contrib/rules_nodejs): the Node.js toolchain
- [Aspect Gazelle](https://github.com/aspect-build/aspect-gazelle): BUILD file generation;
  its [Orion README](https://github.com/aspect-build/aspect-gazelle/blob/main/language/orion/README.md) documents the Starlark plugin API used by `tools/gazelle/jest.axl`

The tools underneath:

- [pnpm](https://pnpm.io/installation), [webpack](https://webpack.js.org), [Jest](https://jestjs.io/docs/ecmascript-modules) (ES modules support),
  [TypeScript](https://www.typescriptlang.org) ([`isolatedDeclarations`](https://www.typescriptlang.org/tsconfig/#isolatedDeclarations)), [SWC](https://swc.rs)
