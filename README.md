# Justin Kyle Pendre — Personal Portfolio

A responsive, single-page personal portfolio built with HTML5, CSS, and vanilla JavaScript. It is designed for GitHub Pages and runs without a build step, backend, API key, package installation, or external JavaScript library.

## Project structure

```text
my-portfolio/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   └── images/
│       ├── .gitkeep
│       ├── profile.jpg          # your portrait (optional)
│       ├── project-1.jpg        # Synced N screenshot (optional)
│       ├── project-2.jpg        # AutoCAD floor-plan screenshot (optional)
│       └── database-design.png  # ERD image (optional)
└── README.md
```

The image files listed above are examples of filenames the website looks for. Add your own images; they are not generated or bundled with the project. The `.gitkeep` file simply keeps the otherwise-empty images folder in Git.

## Preview locally

1. Open the project folder in VS Code.
2. Open `index.html` directly in a browser, or use a local preview extension such as Live Server.
3. Try the appearance panel, dark/light modes, accent colors, mobile navigation, project filters, scrolling effects, and contact links.

No `npm install` or build command is required.

## Add or replace images

1. Put your portrait in `assets/images/` and name it `profile.jpg`.
2. To show a Synced N screenshot, add `project-1.jpg` to `assets/images/`.
3. To show your AutoCAD floor plan, add `project-2.jpg` to `assets/images/`.
4. To show your Entity Relationship Diagram (ERD), add `database-design.png` to `assets/images/`. The ERD project card already references this filename.
5. If you prefer different filenames, update the corresponding `src` value in `index.html`.

Images are optional. If an image is missing or cannot be loaded, the page uses a code-drawn placeholder instead of intentionally showing a broken-image icon. Use your own images; the project does not include AI-generated images, downloaded artwork, anime characters, or video-game artwork.

## Update your content

- **Hero headline and introduction:** Edit the hero section in `index.html`.
- **Rotating headline phrases:** Edit the `headlineOptions` array in `js/script.js`.
- **Skills:** Update the skill cards in `index.html`. Keep descriptions accurate to your actual experience.
- **Projects:** Edit the project cards inside `#project-grid` in `index.html`. Each card uses a `data-category` attribute to control filtering. Available filters are `software`, `academic`, and `database`. A project can belong to more than one category by separating category names with spaces, for example `data-category="academic database"`.
- **Synced N:** This is an in-progress project for a Church Music Ministry Schedule & Lineup Management System. Do not describe planned functionality as finished until it has been implemented.
- **ERD project:** The ERD card uses `assets/images/database-design.png`. Replace that file with your actual diagram when ready.
- **Repository and demo links:** Add project-specific GitHub or live-demo links only when the real URLs exist. The portfolio's GitHub profile link is `https://github.com/Mizuchi091`.
- **Education:** The education section lists ICCT Colleges (Institute of Creative Computer Technology), Bachelor of Science in Computer Engineering, and fourth-year student status. Add dates only if you want to publish them.
- **Contact details:** The email link is `mailto:justinkylependre@gmail.com`. It opens the visitor's configured email application; there is no backend contact form.
- **Footer:** The copyright year updates automatically.

## Appearance settings

The appearance panel supports dark mode, light mode, five preset accent colors, and a custom color picker. Theme and accent preferences are saved in `localStorage` when browser storage is available. The site continues to work if storage is unavailable.

To change the default appearance, edit the CSS custom properties near the top of `css/style.css`.

## Accessibility and performance

- Semantic HTML sections and a skip-to-content link
- Keyboard-accessible controls and visible focus styles
- Responsive navigation and project filters
- Support for the `prefers-reduced-motion` setting
- Lazy-loaded project images
- Lightweight CSS effects and a small particle canvas in the hero section
- Particle animation pauses when the hero is off-screen or the browser tab is hidden
- The decorative custom cursor is limited to compatible pointer devices; the normal pointer remains available
- No framework or third-party JavaScript dependency

## Publish with GitHub Pages

1. Copy the project files into the root of your GitHub repository. Keep `index.html` at the repository root and preserve the `css/`, `js/`, and `assets/` folders.
2. Review your local changes in VS Code or your Git client.
3. Commit and push the files to the branch you use for GitHub Pages.
4. On GitHub, open **Settings → Pages**.
5. Under **Build and deployment**, select **Deploy from a branch**, choose your publishing branch (commonly `main`) and the repository root (`/`), then save.
6. Open the published URL shown in the Pages settings after GitHub finishes building the site.
7. For future updates, edit the files, commit, and push again. GitHub Pages republishes from the configured source.

The website uses relative paths for local CSS, JavaScript, and images, so it can work from a project URL such as `https://mizuchi091.github.io/My-portfolio/` as well as from a custom domain. Keep the repository name and capitalization consistent with the URL shown in your GitHub Pages settings.

## Before publishing

Add your portrait and any project screenshots or diagrams you want to show. Verify project descriptions and links, and preview the site on desktop and mobile before committing. This project has not been pushed to GitHub or deployed as part of this package.
