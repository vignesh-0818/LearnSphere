LearnSphere — Tutoring Centre HTML Template
==========================================

A complete, production-ready static HTML template for a school tutoring
centre. No build step required: open index.html in a browser or serve the
folder with any static web server.

Structure
---------
index.html            Home 1 — general tutoring centre landing page
home-2.html           Home 2 — academic success / exam preparation layout
about.html            About the centre, mission, vision, history, team
courses.html          Course listing with grade + subject filters and search
course-details.html   Single course: curriculum, timings, tutor, fees, FAQs
tutors.html           Tutor profiles with search
results.html          Student results and achievements (demo data)
pricing.html          Monthly plans, subject-wise fees, one-to-one rates
blog.html             Blog grid with categories, search and pagination
blog-details.html     Single article with sidebar, tags and share buttons
contact.html          Contact details, enquiry form and map
login.html            Student login
register.html         Student registration
admin-login.html      Staff login
admin-register.html   Staff account request
forgot-password.html  Password reset request
404.html              Not found
coming-soon.html      Coming soon / maintenance with countdown
student/index.html    Student dashboard
admin/index.html      Admin dashboard
assets/css/main.css   Complete design system (tokens, theme, RTL, components)
assets/js/main.js     Theme, direction, navigation, filters, forms, countdown
assets/images/        Local image assets (photography, logo)

Theme system
------------
The theme is set with the data-theme attribute on <html> ("light" or
"dark") and stored in localStorage. Every colour is a CSS custom property,
so no component hardcodes a colour. Hero sections always carry a fixed dark
scrim, so hero text is readable in both themes.

RTL / LTR system
----------------
Direction is set with the dir attribute on <html> and stored in
localStorage. Layout mirroring is real, not text-align: all direction
sensitive spacing uses CSS logical properties (margin-inline-*,
padding-inline-*, inset-inline-*, border-inline-*, text-align: start/end).
Form icons, select arrows, checkboxes, breadcrumb separators, pagination
arrows, drawer slide direction and both dashboard sidebars mirror
automatically. Arrow glyphs that must point the other way carry the
.ico-dir class.

Customising
-----------
1. Colours, radii and fonts: edit the token blocks at the top of
   assets/css/main.css (:root and html[data-theme="dark"]).
2. Brand name and logo: replace assets/images/logo.svg and the brand markup
   in the header/footer of each page.
3. Images: drop replacements into assets/images/ using the same filenames,
   or update the src attributes.

Third-party resources
---------------------
Google Fonts (Inter, Plus Jakarta Sans) and Font Awesome 6 are loaded from
CDN. Swap them for local copies if you need a fully offline build.

Note
----
All content, statistics, results and testimonials are demo placeholders for
template presentation. Forms are front-end only and submit nowhere.
