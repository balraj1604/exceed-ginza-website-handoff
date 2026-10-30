# EXCEED Ginza — Website & Creative Handoff

**[Open the live website](https://exceed-ginza-preview-b.netlify.app/)** · **[Download the complete package](https://github.com/balraj1604/exceed-ginza-website-handoff/archive/refs/heads/main.zip)**

Latest Version B, packaged 30 October 2026. The website opens in Safari and other browsers without a ChatGPT account.

## Reviewing or improving the design?

**[Ryo — start here](START-HERE-RYO.md)** for the review brief, source material and instructions to submit design changes through a pull request.

## Everything in one place

| Part | Contents |
| --- | --- |
| **1. Live website** | [EXCEED Ginza — Version B](https://exceed-ginza-preview-b.netlify.app/) |
| **2. Code and assets** | [website/](website/) — complete static HTML, CSS, JavaScript, images, fonts and videos |
| **3. Agency references** | [Two supplied mobile patterns](references/agency/) and [Figma reference + HTML recreation](references/figma/) |
| **4. Shoya’s vision** | [Original Japanese story and diagrams](vision/original/), [latest feedback](vision/SHOYA-FEEDBACK.md), and [implementation brief](vision/PROJECT-STORY.md) |

## Run locally

No build step, npm install or API keys are required. Download/unzip this repository, open a terminal in its folder and run:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Then open:
- Website: http://127.0.0.1:8080/website/
- Agency pattern 2: http://127.0.0.1:8080/references/agency/pattern-2.html
- Agency pattern 3: http://127.0.0.1:8080/references/agency/pattern-3.html
- Figma HTML recreation: http://127.0.0.1:8080/references/figma/html-recreation/

[Technical handoff](docs/HANDOFF.md) · [Assets and reference notes](docs/ASSETS.md)

This repository is a dated handoff snapshot. The live Netlify preview is separately hosted; pushing to this repository does not automatically deploy it. Reference designs and third-party assets remain the property of their respective owners; this repository does not grant a blanket reuse licence.
