# Ved Agrawal — architecture portfolio

Static website, no dependencies or build command. Open index.html locally to preview. All 23 source PDF pages are included as compressed WebP images. The flipbook uses a lightweight CSS page-turn effect, not a physical page-curl engine.

## Free deployment with GitHub Pages
1. Create a public repository on GitHub (e.g. ved-portfolio).
2. Extract the ZIP and upload the CONTENTS of the ved-portfolio folder, including assets, to the repository root. Commit to main. Do not upload the ZIP itself.
3. In Settings > Pages, choose Deploy from a branch, main, / (root), Save.
4. Wait for GitHub to publish and use the URL shown in Settings > Pages. Usually https://USERNAME.github.io/ved-portfolio/.

Alternatively import the repository in Vercel, select Other framework, no build command, output root, and deploy under the free personal-use plan if eligible.

## Updates
Edit content.js for project descriptions, titles, profile and email. Upload replacement WebP files in assets with the same names or update image paths. To replace the flipbook, export the revised PDF as numbered WebP images (page-01.webp etc.), update pages and project page arrays in content.js, then commit. Changes publish automatically after GitHub rebuilds. Edit style.css for colors and layout. No backend or browser admin dashboard is included; GitHub is the editing interface. No paid services or API keys required.

## Privacy
The original portfolio pages include personal contact details and date of birth on page 2. Review and redact page-02.webp before publishing if you do not want these public. The email link is also public. The original 91 MB PDF is not included; the flipbook uses page images. Review image crops and content before publication.
