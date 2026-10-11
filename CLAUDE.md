# Working with the owner of this repo

- The owner wants to be as hands-off as possible. Do every step you can yourself (code, commits, pushes, Google Drive files, config). Only hand over steps that truly need their own login or approval, and when you do, give short numbered click-by-click instructions with direct links.
- Don't ask them to paste secrets (API keys) into chat or into code; keys go in Apps Script → Script properties.
- Prefer free or lowest-cost options (e.g. the smallest AI model) unless told otherwise.

# Project notes
- `index.html` is the guest page, served by GitHub Pages from `main` / root.
- Sign-ups and invite text live in the Google Sheet "Friendsgiving 2026" (ID `1DqKRaJ7trLaMsTyTH7bHHzt-tJOgeT3uiokQ94zqj2Y`), read and written through the Apps Script web app in `google-apps-script/Code.gs`. Its `/exec` URL goes in `config.js`.
