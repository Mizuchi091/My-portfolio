# Justin Kyle Pendre — Personal Portfolio

A responsive personal portfolio for **Justin Kyle Pendre**, a fourth-year Computer Engineering student at **ICCT Colleges (Institute of Creative Computer Technology)**. The site presents academic experience, developing technical skills, projects, and contact links in a technology-inspired interface.

- **GitHub profile:** https://github.com/Mizuchi091
- **Repository:** https://github.com/Mizuchi091/My-portfolio
- **GitHub Pages URL:** https://mizuchi091.github.io/My-portfolio/

> GitHub Pages can take a few minutes to publish after a push. If the website does not show the latest changes, check the repository's **Settings → Pages** and refresh with `Ctrl + F5`.

## Project structure

```text
my-portfolio/
├── index.html
├── README.md
├── css/
│   └── style.css
├── js/
│   └── script.js
└── assets/
    └── images/
        ├── profile.jpg
        ├── project-1.jpg
        ├── project-2.jpg
        └── database-design.png
```

Keep `index.html` at the repository root for the current GitHub Pages setup. Preserve folder names and relative paths so CSS, JavaScript, and images load correctly from the project URL.

## Features

- Responsive single-page portfolio layout
- About, Skills, Projects, GitHub, Education, Experience, and Contact sections
- Dark and light appearance modes
- Preset accent colors and a custom accent-color option
- Rotating hero headline text
- Project cards with category filters
- Subtle interface animations and a lightweight hero particle effect
- Responsive navigation and reduced-motion support
- Local image assets with fallback placeholders where supported
- Built with HTML, CSS, and vanilla JavaScript; no build step or package installation is required

## Preview locally

1. Open the `my-portfolio` folder in VS Code.
2. Open `index.html` in a browser. You can also use a local preview extension such as Live Server if installed.
3. Test desktop and mobile widths, navigation, project filters, appearance controls, and links.

The portfolio does not require Node.js, npm, a backend, API keys, or a database to display.

## Update the content

Most portfolio text and section content is in `index.html`.

- **Name, introduction, skills, education, experience, and section copy:** Edit the relevant content in `index.html`.
- **Rotating hero headlines and interactive behavior:** Review `js/script.js`.
- **Colors, layout, responsive styling, and animation:** Review `css/style.css`.
- **Project cards:** Edit the project-card markup in `index.html`. Keep each card's category attributes consistent with the available filters.
- **Project links:** Replace placeholders with real repository or demo URLs only when those links exist.
- **Contact email:** The link `mailto:justinkylependre@gmail.com` opens the visitor's email application; it is not a server-backed contact form.

Keep descriptions accurate to your current experience. Describe **Synced N — Church Music Ministry Schedule & Lineup Management System** as in progress or a concept until its planned features have been implemented. Do not present academic AutoCAD floor-plan practice as professional employment.

## Add or replace images

Place your own image files in `assets/images/` and use the exact filenames referenced by the HTML.

| File | Intended use |
|---|---|
| `profile.jpg` | Profile portrait |
| `project-1.jpg` | Project image |
| `project-2.jpg` | Project image |
| `database-design.png` | ERD or database-design project image |

Replace these files with your own images while keeping the same filenames, or update the matching image paths in `index.html`. Use images you have permission to publish and meaningful alternative text for informative images.

## Publish changes to GitHub Pages

The project repository is `https://github.com/Mizuchi091/My-portfolio`.

After editing files in VS Code, open the terminal in the project folder and run:

```powershell
git status
git add .
git commit -m "Update portfolio content"
git push
```

If there are no changes to commit, Git will report that the working tree is clean. Do not create an empty commit.

To verify Pages settings:

1. Open the repository on GitHub.
2. Select **Settings → Pages**.
3. Under **Build and deployment**, confirm the source is **Deploy from a branch**, the branch is `main`, and the folder is `/ (root)` if that is your configured publishing setup.
4. Check the Pages deployment status and open the published URL after the build finishes.

## Accessibility and performance

- Use descriptive link text and meaningful alternative text for images.
- Keep keyboard focus visible and test navigation without a mouse.
- Respect the user's reduced-motion preference.
- Avoid large animation libraries and unnecessary dependencies, especially if performance becomes an issue.
- Test changes on desktop and mobile screen sizes.

## Maintainer

**Justin Kyle Pendre**  
GitHub: https://github.com/Mizuchi091  
Email: justinkylependre@gmail.com
