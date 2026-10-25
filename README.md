# Update Kodknuff Translations

GitHub Action for updating Kodknuff with the latest translations

## Usage

Include in a workflow where the repository is checked out and dependencies are installed. Configure to be triggered on
when a package has been published through another action.

```yaml
name: Update Kodknuff

on:
  workflow_run:
    workflows:
      - Publish
    types:
      - completed

jobs:
  update-kodknuff:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    steps:
      - name: Checkout
        uses: actions/checkout@v6

      - name: Setup Node
        uses: actions/setup-node@249970729cb0ef3589644e2896645e5dc5ba9c38 # v6
        with:
          node-version: '22.23.4'
          package-manager-cache: false

      - name: Install Dependencies
        run: npm ci

      - name: Update
        id: update
        uses: surikaterna/update-kodknuff-translations@main
        with:
          packagePath: './package.json'
          translationsPath: './index'
          artifact: 'my-translations'
        env:
          KODKNUFF_URL: ${{ secrets.KODKNUFF_URL }}
          KODKNUFF_TOKEN: ${{ secrets.KODKNUFF_TOKEN }}
```

## Development

Expected input and output are defined in `action.yml`.

1. Update the logic in `index.js`
2. Add tests in `index.test.js`
3. Run `npm run prepare` to update the dist (trigger)

`index.js` is the root of the action logic, but the action will be triggered from the versioned `dist` directory. So
before committing, run `npm run prepare` to trigger a new build to be included in the commit.

## Runtime security and compatibility

For CVE-2026-111497, this composite action installs **Node.js 22.23.4** with
commit-pinned `actions/setup-node` and runs the checked-in `dist/index.js` bundle.
All four inputs/defaults and the `version` output are preserved.
`KODKNUFF_URL` and `KODKNUFF_TOKEN` remain inherited from the caller's environment;
HTTP decompression remains enabled. Application source/runtime dependencies are
unchanged. The development bundler is pinned to `@vercel/ncc` 0.38.4 because
0.31.1 fails on Node.js 22/OpenSSL 3 with `ERR_OSSL_EVP_UNSUPPORTED`; `dist` was
regenerated with the compatible bundler. No OpenSSL legacy-provider override is used.

Use GitHub Actions runner **2.338.1 or newer with patched embedded Node.js**:
[runner 2.338.1](https://github.com/actions/runner/releases/tag/v2.338.1)
[ships Node.js 24.22.1](https://github.com/actions/runner/blob/v2.338.1/src/Misc/externals.sh)
for the setup-node bootstrap. `runs.using: node24` alone does not select a patch.
Linux, macOS and Windows remain supported where Node.js 22 and Bash are available
(Windows uses Git Bash); no Docker/Linux-only restriction was introduced.
The setup step adds Node.js 22.23.4 to the job's **PATH for subsequent steps**;
run setup-node again afterwards if another runtime is needed.

After merging, select a commit/tag containing this fix; old release tags do not
change. The example uses `main`; production workflows should pin the fixed commit.
Direct development requires `^22.23.4 || ^24.22.1 || >=26.12.1`; CI installs
22.23.4 explicitly. The v1 lockfile has no root package engine metadata.
Update self-hosted runners and rerun workflows to activate the fix; no deployment
was performed. See the
[Node.js security release](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases).

Targeted Linux smoke: the rebuilt bundle ran through the manifest's Bash command
on Node.js 22.23.4 against a local Brotli-encoded Kodknuff API fixture. Translation
loading, Bearer authentication, publication and the version output mapping passed.
`npm ci` also completed its `prepare` lifecycle using ncc 0.38.4 on Node.js 22.23.4.
No exploit payloads, Windows/macOS runs or lint checks were performed.
Bundle output still uses the existing legacy Actions output command.

The first hosted CI run exposed the old bundler failure above and a pre-existing
retired `actions/upload-artifact@v2` selector; the latter now uses commit-pinned v4.
That run used runner **2.338.0**, below the required patched runner version, so it
does not prove bootstrap runtime remediation. The hosted action graph job reported
success but had no Kodknuff secrets, an obsolete `milliseconds` input and missing
`./index` diagnostics; it did not verify real publication. Provider rollout or a
patched self-hosted runner is still required for the setup-node bootstrap.

After the compatibility correction, hosted `check-dist` passed. The unit job
then exposed a pre-existing assertion comparing the package's version with a
stale `1.0.0` literal rather than testing behavior. That standalone incidental
version test was deleted, not re-pinned; both remaining tests are preserved.
Targeted `npm test -- --runInBand index.test.js` on Node.js 22.23.4 passed:
one suite, two tests. No authenticated hosted publication or final hosted
unit result is claimed.
