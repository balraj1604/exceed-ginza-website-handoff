# Ryo — website review and design handoff

## Start here

1. **[View the current website](https://exceed-ginza-preview-b.netlify.app/)** on desktop and mobile.
2. Read [Shoya’s latest direction](vision/SHOYA-FEEDBACK.md) and [the project story](vision/PROJECT-STORY.md).
3. See [the original Japanese brand story and diagrams](vision/original/), [the agency’s two mobile designs](references/agency/) and [the Figma reference](references/figma/).
4. All editable code and bundled assets are in [website/](website/). [Technical notes](docs/HANDOFF.md) explain the file structure.

## What we would like your feedback on

Please share your honest view of the overall design and how clearly the story comes across. In particular:

- Hero typography, positioning and navigation.
- Visual hierarchy, number/statistic layout and readability.
- Ginza showroom presentation, developer logos and property imagery.
- Section spacing, alignment and transitions.
- Mobile layout and ease of finding the next action.
- Whether the page communicates the business today and Shoya’s future vision clearly.

Feedback is welcome even without code changes. [Open a GitHub issue](https://github.com/balraj1604/exceed-ginza-website-handoff/issues/new), include the section name, desktop/mobile width, a screenshot if useful, and the change you suggest. You can also send your notes directly to Balraj.

## Design direction to retain

You are welcome to improve the design. Preserve the existing content and distinguish current services from future ambitions. Keep the architecture-led visual style, high-quality property imagery, soft faded transitions and no arrows on buttons. Heavy cinematic scroll animation can wait for phase two. The current hero image and four-developer presentation are intentional; explain any proposed replacement in your review.

## Make changes and return them to this repository

You do not need direct write access to contribute. With your own GitHub account:

1. **Fork** this repository to your account, then clone your fork.
2. Create a branch, for example `ryo/design-review`.
3. Run `python3 -m http.server 8080 --bind 127.0.0.1` from the repository folder. Open `http://127.0.0.1:8080/website/`.
4. Edit files in `website/`. Keep `index.html` and its `variant-b.html` alias consistent if you change homepage markup. Preserve CSS load order until you intentionally consolidate it.
5. Review desktop and mobile. Check navigation, developer tabs, FAQ controls, links, video controls and reduced-motion behaviour.
6. Commit and push your branch to your fork. Open a **pull request** into `balraj1604/exceed-ginza-website-handoff`, base branch **main**.
7. Include what you changed, why, desktop/mobile screenshots and any remaining issues.

Balraj can review the proposal before merging it. A pull request or a merge does not automatically change the live Netlify website; publishing is a separate step. No hosting credentials are needed for your review or contribution.

The repository contains the selected project materials, not a full WhatsApp chat export. The original source text contains older details; follow the later corrections documented in Shoya’s feedback and the project brief.
