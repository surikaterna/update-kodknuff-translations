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
        uses: actions/checkout@v2

      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '16.x'

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
