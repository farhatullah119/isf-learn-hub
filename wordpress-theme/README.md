# ISF Learning Hub – WordPress Theme

Place the `afghanistan-flag.png` image in `assets/` folder before zipping.

## Installation
1. Copy `afghanistan-flag.png` into `wordpress-theme/assets/`
2. (Optional) Add a `screenshot.png` (1200×900px) in the theme root
3. Zip the `wordpress-theme` folder
4. In WordPress Admin → Appearance → Themes → Add New → Upload Theme → select the zip
5. Activate the theme

## Files
- `style.css` – Theme stylesheet with WordPress headers
- `functions.php` – Enqueues fonts, CSS, JS; registers menus & custom logo
- `header.php` – `<head>`, navbar, `wp_head()`
- `footer.php` – Footer, `wp_footer()`
- `index.php` – Full single-page layout
- `assets/js/main.js` – Smooth-scroll JS
