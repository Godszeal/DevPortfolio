# DevPortfolio

A static, JSON-driven developer portfolio. GitHub Pages hosts `index.html`; the page loads the runtime and custom CSS from jsDelivr, while all editable portfolio content lives in [`data.json`](./data.json).

## Live site and repository

After GitHub Pages finishes its first deployment, the default site URL is:

```text
https://godszeal.github.io/DevPortfolio/
```

Repository: <https://github.com/Godszeal/DevPortfolio>

## GitHub Pages setup

This repository includes [`.github/workflows/pages.yml`](./.github/workflows/pages.yml). It deploys automatically whenever changes are pushed to `main`.

1. Open the repository on GitHub and go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Push a change or select **Actions → Deploy static site to GitHub Pages → Run workflow**.
4. Wait for the workflow to complete. GitHub will show the generated Pages URL in the workflow summary and under **Settings → Pages**.

The workflow publishes the repository root as a static site. No Node.js build step is required.

### Why the page previously stayed on “Loading”

The repository did not yet have a Pages deployment, and the CDN runtime was resolving its configuration through a repository URL fallback. The current setup explicitly loads `./data.json` relative to the Pages site, so the browser requests:

```text
https://godszeal.github.io/DevPortfolio/data.json
```

This also works automatically on a custom domain.

## Custom domain setup

### Option A: `www.example.com` or another subdomain

1. In your DNS provider, create a **CNAME** record:

   | Type | Name | Target |
   |---|---|---|
   | CNAME | `www` | `godszeal.github.io` |

2. Open **Settings → Pages** in this repository.
3. Enter `www.example.com` under **Custom domain** and click **Save**.
4. Enable **Enforce HTTPS** after GitHub finishes issuing the certificate.

### Option B: an apex domain such as `example.com`

Create these **A** records at the DNS provider:

| Type | Name | Target |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |

Optionally add an IPv6 **AAAA** record for each GitHub Pages address listed in the [official GitHub documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site). Then add `example.com` in **Settings → Pages → Custom domain** and enable HTTPS.

If you want both the apex and `www`, configure both DNS records and choose one as the primary Pages custom domain. DNS changes can take several minutes to propagate.

### Custom-domain troubleshooting

- Use `dig www.example.com` or an online DNS checker to confirm the CNAME points to `godszeal.github.io`.
- Do not point the CNAME at a repository URL such as `godszeal.github.io/DevPortfolio`.
- Make sure the custom domain is entered in GitHub Pages, not only in DNS.
- Keep **Enforce HTTPS** disabled until the certificate becomes available, then enable it.
- If a custom domain is configured through the GitHub UI, GitHub may create a `CNAME` file automatically. Do not delete it.

## How to edit the website

Edit [`data.json`](./data.json), commit the change to `main`, and wait for the Pages workflow to finish. The HTML, JavaScript, and CSS do not need to be edited for normal content changes.

You can edit in either of these ways:

- Open `data.json` on GitHub, click the pencil icon, edit, and commit directly to `main`.
- Clone the repository, edit locally, then run `git add data.json && git commit -m "Update portfolio content" && git push origin main`.

The deployment workflow runs automatically after the push. The CDN runtime and CSS are pinned to a verified commit, while the JSON is loaded from the current Pages origin, so your content updates with each deployment.

## `data.json` schema

`data.json` is one JSON object. JSON rules are strict: use double quotes around keys and string values, commas between properties, and no trailing comma after the final property in an object or array.

### Top-level properties

| Property | Type | Purpose |
|---|---|---|
| `seo` | object | Browser title, search metadata, social sharing, favicon, and JSON-LD. |
| `logo` | object | Navbar logo text or image. |
| `personal` | object | Name, role, contact details, avatar, availability, and CV link. |
| `hero` | object | Hero greeting, rotating role text, biography, and CTA buttons. |
| `stats` | array | Numeric/value cards shown below the hero. |
| `badges` | object | Floating experience and project badges beside the avatar. |
| `socials` | array | Social links reused in the hero, contact, and footer. |
| `about` | object | About copy, details, and feature highlights. |
| `skills` | object | Skill categories, proficiency levels, and additional technologies. |
| `projects` | object | Project cards, screenshots, descriptions, technology tags, and links. |
| `experience` | object | Career timeline entries. |
| `education` | array | Education cards. |
| `certifications` | object | Certification/award cards and section subtitle. |
| `openSource` | object | GitHub contribution total, repositories, and profile link. |
| `blog` | object | Blog cards and all-posts link. |
| `testimonials` | array | Testimonial cards and ratings. |
| `contact` | object | Contact section subtitle and contact methods. |
| `nav` | object | Navbar links and their order. |
| `ui` | object | All remaining labels, headings, form copy, placeholders, and splash messages. |

### SEO and branding

```json
"seo": {
  "siteTitle": "Your Name — Your Role",
  "siteDescription": "A short description for search engines and social previews.",
  "keywords": "developer, portfolio, javascript",
  "author": "Your Name",
  "canonicalUrl": "https://example.com",
  "ogImage": "https://example.com/social-preview.jpg",
  "twitterHandle": "@yourhandle",
  "themeColor": "#6366f1",
  "favicon": "https://example.com/favicon.png",
  "jsonLd": {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Your Name",
    "url": "https://example.com",
    "sameAs": ["https://github.com/yourusername"]
  }
},
"logo": {
  "text": "&lt;/Dev&gt;",
  "image": "",
  "alt": "Your logo"
}
```

Set `logo.image` to a public image URL to display an image logo. Leave it empty to use `logo.text`.

### Personal and hero content

`personal` controls identity and reusable contact values. `hero` controls the first screen. `typingRoles` must be an array of strings; `primaryCTA` and `secondaryCTA` each need a `label` and `href`.

```json
"personal": {
  "name": "Jane Doe",
  "initials": "JD",
  "role": "Frontend Engineer",
  "tagline": "Building useful products with thoughtful interfaces",
  "email": "jane@example.com",
  "phone": "+1 555 123 4567",
  "location": "London, UK",
  "availability": "Available for selected projects",
  "cvUrl": "https://example.com/jane-doe-cv.pdf",
  "avatar": "https://example.com/avatar.jpg"
},
"hero": {
  "greeting": "Hi, I'm",
  "typingRoles": ["Frontend Engineer", "UI Engineer", "Open Source Contributor"],
  "bio": "A short introduction shown in the hero section.",
  "primaryCTA": {"label": "View My Work", "href": "#projects"},
  "secondaryCTA": {"label": "Contact Me", "href": "#contact"}
}
```

### Arrays and repeated cards

Repeated sections are arrays. Add, remove, or reorder objects to change what appears on the page. Common item fields are:

- `stats`: `value`, `label`, `icon`
- `socials`: `icon`, `url`, `label`
- `education`: `degree`, `school`, `location`, `period`, `description`, `icon`
- `testimonials`: `quote`, `name`, `role`, `avatar`, `rating`
- `blog.items`: `title`, `excerpt`, `date`, `readTime`, `image`, `tags`, `readMoreUrl`

Use Font Awesome class names for icons, such as `fa-code`, `fa-github`, or `fa-solid fa-envelope`, matching the existing examples in `data.json`.

### Skills

Each skill category has a name, icon, and `items` array. Skill levels should be numbers from `0` to `100`; they control the animated progress bar.

```json
"skills": {
  "subtitle": "My technical toolkit",
  "categories": [
    {
      "name": "Frontend",
      "icon": "fa-layer-group",
      "items": [
        {"name": "JavaScript", "level": 90},
        {"name": "CSS", "level": 85}
      ]
    }
  ],
  "otherTech": ["Git", "Figma", "Docker"]
}
```

### Projects

Each project in `projects.items` supports a card and a lightbox detail view:

```json
{
  "title": "Project name",
  "category": "Web App",
  "description": "Short card description.",
  "image": "https://example.com/project-cover.jpg",
  "screenshots": ["https://example.com/screenshot-1.jpg"],
  "fullDescription": "Longer description shown in the project lightbox.",
  "challenges": ["Challenge one"],
  "outcomes": ["Outcome one"],
  "tech": ["React", "Node.js"],
  "liveUrl": "https://example.com/project",
  "repoUrl": "https://github.com/yourusername/project",
  "featured": true
}
```

`featured` controls whether a project is included in the initial featured view. Images and links must be publicly accessible over HTTPS.

### Experience, certifications, open source, and contact

Keep the existing object shape in `data.json` when editing these sections. For timeline entries, preserve the fields used by the current examples (`company`, `role`, `period`, `location`, `description`, `achievements`, and `icon`). Certification entries use their current fields such as `title`, `issuer`, `date`, `image`, and `url`. Open-source repositories use fields such as `name`, `description`, `language`, `stars`, `forks`, and `url`. Contact methods use `label`, `value`, `href`, and `icon`.

### UI copy

The `ui` object contains text that is not tied to a portfolio record: section headings, labels, button text, form placeholders, footer text, and splash messages. `splashMessages` is an array of strings. The token `{name}` is replaced with `personal.name`.

```json
"ui": {
  "splashMessages": ["Loading...", "Building UI...", "Welcome, {name}!"],
  "projectsTitle": "Selected Work",
  "contactSubmitLabel": "Send enquiry",
  "formMessagePlaceholder": "Tell me what you are building..."
}
```

### Safe editing checklist

1. Make a copy of `data.json` before large edits.
2. Do not remove required arrays or objects; edit their values instead.
3. Keep skill levels between `0` and `100`.
4. Use valid public HTTPS URLs for images, CVs, social profiles, and project links.
5. Validate the file with a JSON validator before committing.
6. After pushing, check the **Actions** tab and wait for the Pages deployment to finish.
7. If the old content remains visible, hard-refresh the browser; the HTML/runtime are cached by the CDN, while the site content comes from the latest Pages `data.json`.

## Project files

| File | Role |
|---|---|
| `index.html` | Minimal GitHub Pages document shell. |
| `data.json` | Editable portfolio content and UI copy. |
| `app.js` | CDN-loaded rendering and interaction runtime. |
| `app.css` | CDN-loaded custom styles. |
| `.github/workflows/pages.yml` | Automatic GitHub Pages deployment. |

## License and attribution

Review the repository license and third-party asset licenses before using this portfolio publicly.
