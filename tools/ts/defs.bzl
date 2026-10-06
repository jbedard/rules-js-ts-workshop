"""Our ts_project: rules_ts, with SWC producing the JavaScript.

Gazelle generates calls to this macro instead of @aspect_rules_ts's, because of
the `# gazelle:map_kind ts_project ts_project //tools/ts:defs.bzl` directive in
the root BUILD.bazel file. tsc still runs, but only to type-check and emit .d.ts files.
"""

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
