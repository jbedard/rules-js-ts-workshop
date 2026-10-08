# Workshop snippets

Code to copy and paste, by step. The instructions are on the slides and in the
[README](README.md#steps).

## Step 3

<details>
<summary>Jest</summary>

`MODULE.bazel`

```starlark
bazel_dep(name = "aspect_rules_jest", version = "0.26.0")
```

`BUILD.bazel` (root)

```starlark
# gazelle:jest enabled
```

```sh
bazel run //tools/gazelle
bazel test //...
```

</details>

## Step 4

<details>
<summary>webpack</summary>

`BUILD.bazel` (root)

```starlark
# A webpack_config js_library in every package with a webpack config (step 4).
# gazelle:js_files webpack_config **/webpack.config.cjs
```

```sh
bazel run //tools/gazelle
```

`MODULE.bazel`

```starlark
bazel_dep(name = "aspect_rules_webpack", version = "0.19.0")
```

`app/BUILD.bazel`: add the bundle

```starlark
# Hand-written webpack targets (step 4). Gazelle leaves them alone.

load("@aspect_rules_webpack//webpack:defs.bzl", "webpack_bundle", "webpack_devserver")

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
```

```sh
bazel build //app:bundle
ls bazel-bin/app/bundle
```

`app/BUILD.bazel`: add the devserver

```starlark
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

```sh
ibazel run //app:devserver   # or: aspect run --watch //app:devserver
```

</details>

## Step 5a

<details>
<summary>TypeScript sources</summary>

```sh
for f in app/*.js libs/*/*.js; do mv "$f" "${f%.js}.ts"; done
mv tsconfig.json.disabled tsconfig.json
```

`libs/ui/ProductCategoryRow.ts` (an example of adding types)

```ts
import { type ReactElement, createElement as h } from 'react';

export interface ProductCategoryRowProps {
  category: string;
}

export default function ProductCategoryRow({ category }: ProductCategoryRowProps): ReactElement {
  return h('tr', null, h('th', { colSpan: 2 }, category));
}
```

</details>

## Step 5b

<details>
<summary>rules_ts</summary>

`MODULE.bazel`

```starlark
bazel_dep(name = "aspect_rules_ts", version = "3.10.1")

typescript = use_extension("@aspect_rules_ts//ts:extensions.bzl", "typescript")
typescript.deps(version_from = "//:package.json")
use_repo(typescript, "npm_typescript")
```

`.bazelrc`

```
common --@aspect_rules_ts//ts:default_to_tsc_transpiler
common --@aspect_rules_ts//ts:skipLibCheck=always
```

```sh
bazel run //tools/gazelle
bazel build //...
```

</details>

## Step 6

<details>
<summary>libs/price</summary>

`MODULE.bazel`

```starlark
pnpm = use_extension(
    "@aspect_rules_js//npm:extensions.bzl",
    "pnpm",
    dev_dependency = True,
)
pnpm.pnpm(pnpm_version_from = "//:package.json")
use_repo(pnpm, "pnpm")
```

```sh
bazel run -- @pnpm --version
```

`libs/price/package.json`

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

`libs/price/price.ts`

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

`libs/price/index.ts`

```ts
export { formatPrice, parsePrice, totalPrice } from './price.js';
export type { Priced } from './price.js';
```

`libs/price/price.test.ts`

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

`libs/ui/package.json`

```json
"@demo/price": "workspace:*",
```

`libs/ui/ProductTable.ts`: add the import

```ts
import { totalPrice } from '@demo/price';
```

`libs/ui/ProductTable.ts`: add the `tfoot` as the table's last child, after the `tbody`

```ts
  return h(
    'table',
    null,
    h('thead', …),
    h('tbody', …),
    h('tfoot', null, h('tr', null, h('th', null, 'Total'), h('td', null, totalPrice(visible)))),
  );
```

```sh
bazel run -- @pnpm -C $PWD install --lockfile-only
```

`.bazelignore`

```
libs/price/node_modules
```

```sh
touch libs/price/BUILD.bazel
bazel run //tools/gazelle
bazel test //...
ibazel run //app:devserver   # a Total row: $11
```

</details>

## Step 7

<details>
<summary>SWC</summary>

`BUILD.bazel` (root)

```starlark
# gazelle:map_kind ts_project ts_project //tools/ts:defs.bzl
```

```sh
bazel run //tools/gazelle
git diff   # every ts_project now loads from //tools/ts:defs.bzl
```

`MODULE.bazel`

```starlark
bazel_dep(name = "aspect_rules_swc", version = "2.7.6")
bazel_dep(name = "bazel_skylib", version = "1.9.2")
```

`tools/ts/defs.bzl`: replace the TODO

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

`.bazelrc`: delete

```
# tsc also transpiles, until SWC takes over in step 7.
common --@aspect_rules_ts//ts:default_to_tsc_transpiler
```

```sh
bazel test //...
```

</details>

## Step 8

<details>
<summary>isolatedDeclarations</summary>

`tsconfig.json`

```json
"isolatedDeclarations": true,
```

`libs/ui/ProductRow.ts`

```ts
import { type ReactElement, createElement as h } from 'react';
export default function ProductRow({ product }: ProductRowProps): ReactElement {
```

```sh
bazel run //tools/gazelle
bazel test //...
```

</details>
