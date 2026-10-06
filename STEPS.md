# Workshop snippets

Copy and paste from here instead of typing. Each section matches a step in the
[README](README.md#steps). Uncommenting means deleting the leading `# ` on each
line of the named block.

## Step 3

Jest, through a Gazelle plugin.

`MODULE.bazel`: uncomment the Step 3 block:

```starlark
bazel_dep(name = "aspect_rules_jest", version = "0.26.0")
```

`BUILD.bazel` (root): change `disabled` to `enabled`:

```starlark
# gazelle:jest enabled
```

Then:

```sh
bazel run //tools/gazelle
bazel test //...
```

## Step 4

A webpack bundle and dev server.

`MODULE.bazel`: uncomment the Step 4 block (the `aspect_rules_webpack` `bazel_dep`).

`app/BUILD.bazel`: add, below the `load()` lines Gazelle wrote:

```starlark
# webpack.config.cjs is .cjs, so the js_files glob keeps it out of the app library.

load("@aspect_rules_webpack//webpack:defs.bzl", "webpack_bundle", "webpack_devserver")

js_library(
    name = "webpack_config",
    srcs = ["webpack.config.cjs"],
    deps = [
        ":node_modules/html-webpack-plugin",
    ],
)

# bazel build //app:bundle
webpack_bundle(
    name = "bundle",
    srcs = ["index.html"],
    chdir = package_name(),
    node_modules = ":node_modules",
    output_dir = True,
    webpack_config = ":webpack_config",
    deps = [":app"],
    # A development bundle by default. For a production (minified) one:
    # args = ["--mode=production"],
)

# ibazel run //app:devserver, or: aspect run --watch //app:devserver
webpack_devserver(
    name = "devserver",
    chdir = package_name(),
    data = [
        "index.html",
        ":app",
    ],
    node_modules = ":node_modules",
    webpack_config = ":webpack_config",
)
```

Then:

```sh
bazel build //app:bundle
bazel run //app:devserver            # then open http://localhost:8080
ibazel run //app:devserver           # or: aspect run --watch //app:devserver
```

## Step 5a

TypeScript sources: rename every `.js` to `.ts` (or do it in your editor) and enable the tsconfig.

```sh
for f in app/*.js libs/*/*.js; do mv "$f" "${f%.js}.ts"; done
mv tsconfig.json.disabled tsconfig.json
```

Then add types. For example, `libs/ui/ProductCategoryRow.ts`:

```ts
import { type ReactElement, createElement as h } from 'react';

export interface ProductCategoryRowProps {
  category: string;
}

export default function ProductCategoryRow({ category }: ProductCategoryRowProps): ReactElement {
  return h('tr', null, h('th', { colSpan: 2 }, category));
}
```

Skip the typing: `git stash -u && git pull origin main` once step 5a is merged.

## Step 5b

Build the TypeScript with `rules_ts`.

- `MODULE.bazel`: uncomment the Step 5 block (`aspect_rules_ts` and the `typescript` extension).
- `.bazelrc`: uncomment the two `@aspect_rules_ts` flags.

Then:

```sh
bazel run //tools/gazelle
git diff --stat
bazel build //...
```

## Step 6

A new package, `libs/price`, with the lockfile updated by Bazel's pnpm.

`libs/price/package.json`:

```json
{
  "name": "@demo/price",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "index.js",
  "devDependencies": {
    "@jest/globals": "^30.2.0"
  }
}
```

`libs/price/price.ts`:

```ts
export interface Priced {
  price: string;
}

// "$4" -> 4
export function parsePrice(price: string): number {
  const value = Number(price.replace(/^\$/, ''));
  if (Number.isNaN(value)) {
    throw new Error(`Invalid price: ${price}`);
  }
  return value;
}

// 4 -> "$4"
export function formatPrice(value: number): string {
  return `$${value}`;
}

export function totalPrice(items: readonly Priced[]): string {
  return formatPrice(items.reduce((sum, item) => sum + parsePrice(item.price), 0));
}
```

`libs/price/index.ts`:

```ts
export { formatPrice, parsePrice, totalPrice } from './price.js';
export type { Priced } from './price.js';
```

`libs/price/price.test.ts`:

```ts
import { describe, expect, test } from '@jest/globals';
import { formatPrice, parsePrice, totalPrice } from './price.js';

describe('parsePrice', () => {
  test('strips the dollar sign', () => {
    expect(parsePrice('$4')).toBe(4);
  });

  test('rejects garbage', () => {
    expect(() => parsePrice('four dollars')).toThrow('Invalid price');
  });
});

describe('totalPrice', () => {
  test('sums and formats', () => {
    expect(totalPrice([{ price: '$1' }, { price: '$2' }])).toBe(formatPrice(3));
  });

  test('is $0 for nothing', () => {
    expect(totalPrice([])).toBe('$0');
  });
});
```

`libs/price/BUILD.bazel`: create it empty; Gazelle fills it in.

`libs/ui/package.json`, under `dependencies`:

```json
"@demo/price": "workspace:*",
```

`libs/ui/ProductTable.ts`: import `totalPrice` and add a footer row:

```ts
import { totalPrice } from '@demo/price';
```

```ts
h('tfoot', null, h('tr', null, h('th', null, 'Total'), h('td', null, totalPrice(visible)))),
```

`.bazelignore`: add

```
libs/price/node_modules
```

`MODULE.bazel`: uncomment the Step 6 block (the `pnpm` extension). Then:

```sh
bazel run -- @pnpm -C $PWD install --lockfile-only
bazel run //tools/gazelle
bazel test //...
```

## Step 7

SWC as the transpiler, through a `ts_project` macro.

`MODULE.bazel`: uncomment the Step 7 block (`aspect_rules_swc` and `bazel_skylib`).

`tools/ts/BUILD.bazel`: create it empty.

`tools/ts/defs.bzl`:

```starlark
load("@aspect_rules_swc//swc:defs.bzl", "swc")
load("@aspect_rules_ts//ts:defs.bzl", _ts_project = "ts_project")
load("@bazel_skylib//lib:partial.bzl", "partial")

# SWC's equivalent of the compilerOptions in tsconfig.json; keep them in sync.
SWCRC = {
    "jsc": {
        "parser": {"syntax": "typescript"},
        "target": "es2022",
    },
    "module": {"type": "es6"},
}

def ts_project(name, **kwargs):
    _ts_project(
        name = name,
        transpiler = partial.make(swc, swcrc = SWCRC),
        **kwargs
    )
```

`BUILD.bazel` (root): add

```starlark
# gazelle:map_kind ts_project ts_project //tools/ts:defs.bzl
```

`.bazelrc`: delete

```
common --@aspect_rules_ts//ts:default_to_tsc_transpiler
```

Then:

```sh
bazel run //tools/gazelle
bazel test //...
```

## Step 8

Parallel `.d.ts` generation with `isolatedDeclarations`.

`tsconfig.json`, in `compilerOptions`:

```json
"isolatedDeclarations": true,
```

`bazel build //...` then reports the one file missing a return type. Fix
`libs/ui/ProductRow.ts`:

```ts
import { type ReactElement, createElement as h } from 'react';
export default function ProductRow({ product }: ProductRowProps): ReactElement {
```

Then:

```sh
bazel run //tools/gazelle
bazel test //...
```
