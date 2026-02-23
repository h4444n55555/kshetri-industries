# Kshetri Industries — Static Site

This folder contains a standalone static HTML/CSS site for Kshetri Industries.

- Open `index.html` in a browser to preview locally.
- Files:
  - `index.html` — Homepage
  - `products.html` — Products listing
  - `about.html` — About the company
  - `contact.html` — Contact and simple form
  - `styles.css` — Shared styles
  - `assets/logo.svg` — Placeholder logo

No server or build step is required.

  Deployment options
  ------------------

  - GitHub Pages (automatic): I added a GitHub Actions workflow at `.github/workflows/deploy-static-site.yml` that will publish the `static-site` folder to the `gh-pages` branch whenever you push to `main`. To use it, push this repository to GitHub and ensure the repository's default branch is `main`.

  - Netlify: The `netlify.toml` file in the repo points Netlify to the `static-site` folder as the publish directory. Drag-and-drop `static-site.zip` to Netlify, or connect your Git repository and the site will publish automatically.

  - Manual ZIP: Run the `create-static-zip.ps1` script at the repo root to produce `static-site.zip`, then upload that ZIP to your host or Netlify's drag-and-drop deploy.

  Commands
  --------

  PowerShell (Windows) - create ZIP:
  ```
  .\create-static-zip.ps1
  ```

  Preview locally: open `static-site/index.html` in a browser, or run a local static server such as:
  ```
  npx http-server static-site
  ```

