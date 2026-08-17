/* ==========================================================================
   LearnSphere — shared behaviour
   Theme (light/dark), Direction (LTR/RTL), navigation, accordions, filters,
   dashboards, countdown, forms. One script for the whole template.
   ========================================================================== */
(function () {
  "use strict";

  var STORE_THEME = "learnsphere-theme";
  var STORE_DIR = "learnsphere-dir";
  var root = document.documentElement;

  /* ---------- Theme ------------------------------------------------------ */
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem(STORE_THEME, theme); } catch (e) {}
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    });
  }

  /* ---------- Direction (real RTL, not text-align) ----------------------- */
  function applyDir(dir) {
    root.setAttribute("dir", dir);
    root.setAttribute("lang", dir === "rtl" ? "ar" : "en");
    try { localStorage.setItem(STORE_DIR, dir); } catch (e) {}
    document.querySelectorAll("[data-dir-toggle]").forEach(function (btn) {
      var label = btn.querySelector("[data-dir-label]");
      if (label) label.textContent = dir === "rtl" ? "LTR" : "RTL";
      btn.setAttribute("aria-label", dir === "rtl" ? "Switch to left-to-right layout" : "Switch to right-to-left layout");
    });
  }

  // Applied as early as possible (script is loaded with `defer` in <head>).
  var storedTheme = null, storedDir = null;
  try {
    storedTheme = localStorage.getItem(STORE_THEME);
    storedDir = localStorage.getItem(STORE_DIR);
  } catch (e) {}
  applyTheme(storedTheme || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  applyDir(storedDir || "ltr");

  document.addEventListener("click", function (e) {
    var themeBtn = e.target.closest("[data-theme-toggle]");
    if (themeBtn) {
      applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
      return;
    }
    var dirBtn = e.target.closest("[data-dir-toggle]");
    if (dirBtn) {
      applyDir(root.getAttribute("dir") === "rtl" ? "ltr" : "rtl");
      return;
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    /* ---------- Mobile navigation drawer --------------------------------- */
    var drawer = document.querySelector("[data-nav-drawer]");
    var backdrop = document.querySelector("[data-nav-backdrop]");
    var openers = document.querySelectorAll("[data-nav-open]");
    var closers = document.querySelectorAll("[data-nav-close]");

    function setDrawer(open) {
      if (!drawer) return;
      drawer.classList.toggle("is-open", open);
      if (backdrop) backdrop.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
      openers.forEach(function (b) { b.setAttribute("aria-expanded", open ? "true" : "false"); });
      if (open) {
        var first = drawer.querySelector("a, button");
        if (first) first.focus();
      }
    }
    openers.forEach(function (b) { b.addEventListener("click", function () { setDrawer(true); }); });
    closers.forEach(function (b) { b.addEventListener("click", function () { setDrawer(false); }); });
    if (backdrop) backdrop.addEventListener("click", function () { setDrawer(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { setDrawer(false); setDashSidebar(false); }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 992) setDrawer(false);
    });

    /* ---------- Dropdowns (click on touch / keyboard) -------------------- */
    document.querySelectorAll("[data-dropdown-trigger]").forEach(function (trigger) {
      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation(); // Prevent immediate closing
        var menu = trigger.parentElement.querySelector(".dropdown-menu");
        if (!menu) return;
        var open = menu.classList.toggle("is-open");
        trigger.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });

    document.addEventListener("click", function (e) {
      document.querySelectorAll("[data-dropdown-trigger]").forEach(function (trigger) {
        var menu = trigger.parentElement.querySelector(".dropdown-menu");
        if (menu && menu.classList.contains("is-open")) {
          // If the click is inside the dropdown, do nothing (allow links to be clicked)
          if (menu.contains(e.target)) return;
          menu.classList.remove("is-open");
          trigger.setAttribute("aria-expanded", "false");
        }
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        document.querySelectorAll("[data-dropdown-trigger]").forEach(function (trigger) {
          var menu = trigger.parentElement.querySelector(".dropdown-menu");
          if (menu && menu.classList.contains("is-open")) {
            menu.classList.remove("is-open");
            trigger.setAttribute("aria-expanded", "false");
            trigger.focus(); // Return focus
          }
        });
      }
    });

    /* ---------- Dashboard sidebar ---------------------------------------- */
    var dashSide = document.querySelector("[data-dash-side]");
    function setDashSidebar(open) {
      if (!dashSide) return;
      dashSide.classList.toggle("is-open", open);
      if (backdrop) backdrop.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    }
    document.querySelectorAll("[data-dash-toggle]").forEach(function (b) {
      b.addEventListener("click", function () { setDashSidebar(!dashSide.classList.contains("is-open")); });
    });
    if (backdrop) backdrop.addEventListener("click", function () { setDashSidebar(false); });

    /* ---------- Sticky header shadow ------------------------------------- */
    var header = document.querySelector(".site-header");
    var toTop = document.querySelector("[data-back-to-top]");
    function onScroll() {
      var y = window.scrollY;
      if (header) header.classList.toggle("is-stuck", y > 8);
      if (toTop) toTop.classList.toggle("is-visible", y > 420);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

    /* ---------- Password visibility -------------------------------------- */
    document.querySelectorAll("[data-toggle-password]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var input = btn.parentElement.querySelector("input");
        if (!input) return;
        var show = input.type === "password";
        input.type = show ? "text" : "password";
        btn.innerHTML = show ? '<i class="fa-regular fa-eye-slash" aria-hidden="true"></i>' : '<i class="fa-regular fa-eye" aria-hidden="true"></i>';
        btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
      });
    });

    /* ---------- Accordions ------------------------------------------------ */
    document.querySelectorAll(".acc-trigger").forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var panel = document.getElementById(trigger.getAttribute("aria-controls"));
        var open = trigger.getAttribute("aria-expanded") === "true";
        trigger.setAttribute("aria-expanded", open ? "false" : "true");
        if (panel) panel.classList.toggle("is-open", !open);
      });
    });

    
    /* ---------- Filter chips ---------------------------------------------- */
    document.querySelectorAll("[data-filter-group]").forEach(function (group) {
      var targetSel = group.getAttribute("data-filter-target");
      group.addEventListener("click", function (e) {
        var chip = e.target.closest("[data-filter]");
        if (!chip) return;
        group.querySelectorAll("[data-filter]").forEach(function (c) {
          c.classList.toggle("is-active", c === chip);
          c.setAttribute("aria-pressed", c === chip ? "true" : "false");
        });
        var value = chip.getAttribute("data-filter");
        document.querySelectorAll(targetSel + " [data-category]").forEach(function (item) {
          var cats = (item.getAttribute("data-category") || "").split(" ");
          item.style.display = (value === "all" || cats.indexOf(value) > -1) ? "" : "none";
        });
      });
    });

    /* ---------- Live search filter ---------------------------------------- */
    document.querySelectorAll("[data-search-input]").forEach(function (input) {
      var targetSel = input.getAttribute("data-search-target");
      input.addEventListener("input", function () {
        var q = input.value.trim().toLowerCase();
        document.querySelectorAll(targetSel + " [data-search-text]").forEach(function (item) {
          var text = (item.getAttribute("data-search-text") || "").toLowerCase();
          item.style.display = text.indexOf(q) > -1 ? "" : "none";
        });
      });
    });

    /* ---------- Dashboard Tabs -------------------------------------------- */
    document.querySelectorAll("[data-tab-trigger]").forEach(function(trigger) {
      trigger.addEventListener("click", function(e) {
        e.preventDefault();
        var targetId = trigger.getAttribute("data-tab-trigger");
        
        var nav = trigger.closest(".dash-nav");
        if (nav) {
          nav.querySelectorAll(".dash-link").forEach(function(l) { l.classList.remove("is-active"); });
          trigger.classList.add("is-active");
        }
        
        document.querySelectorAll("[data-tab-content]").forEach(function(pane) {
          pane.style.display = "none";
        });
        var targetPane = document.querySelector('[data-tab-content="' + targetId + '"]');
        if (targetPane) {
          targetPane.style.display = "block";
        }
        
        if (typeof setDashSidebar === 'function' && window.innerWidth < 992) {
          setDashSidebar(false);
        }
      });
    });

    
    /* ---------- Course Details dynamic load ------------------------------- */
    var courseParams = new URLSearchParams(window.location.search);
    var courseName = courseParams.get("course");
    if (window.location.pathname.indexOf("course-details.html") > -1) {
            var courseData = {
        "mathematics-mastery": {
          title: "Mathematics Mastery",
          subject: "Mathematics",
          desc: "Algebra, geometry and trigonometry taught step by step, with weekly problem-solving drills and board-paper practice.",
          breadcrumb: "Mathematics Mastery",
          about: "This is our most requested batch. Over 22 weeks students rebuild the algebra and geometry foundations that board papers depend on, then move into timed practice using past questions. Every session ends with a five-minute recap quiz so gaps surface immediately.",
          image: "assets/images/course-math.jpg",
          grade: "Classes 9–10",
          duration: "22 weeks",
          timing: "Mon, Wed, Fri · 16:00 – 17:30",
          size: "Max 8 students",
          tutor: "Ms. Amelia Hart",
          price: "$95",
          tutorImg: "assets/images/tutor-1.jpg",
          tutorCred: "M.Sc. Mathematics · 12 years",
          tutorDesc: "Amelia breaks difficult topics into small, provable steps and keeps every student working at the board.",
          dynamicHtml: `
              <h2>What students will learn</h2>
              <ul class="check-list">
                <li><i class="fa-solid fa-circle-check" aria-hidden="true"></i><span>Solve linear, simultaneous and quadratic equations with confidence</span></li>
                <li><i class="fa-solid fa-circle-check" aria-hidden="true"></i><span>Apply coordinate geometry to distance, section and area problems</span></li>
                <li><i class="fa-solid fa-circle-check" aria-hidden="true"></i><span>Prove standard triangle and circle theorems without memorising blindly</span></li>
                <li><i class="fa-solid fa-circle-check" aria-hidden="true"></i><span>Use trigonometric ratios and identities in height-and-distance questions</span></li>
                <li><i class="fa-solid fa-circle-check" aria-hidden="true"></i><span>Manage a full board paper within the time limit</span></li>
              </ul>
              <h2>Curriculum</h2>
              <ul style="list-style:none;padding:0;display:grid;gap:.7rem;">
                  <li style="display:flex;gap:.8rem;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;"><span class="min-w-0"><i class="fa-regular fa-circle-dot" aria-hidden="true" style="color:var(--primary);margin-inline-end:.5rem;"></i>Module 1 · Number systems and algebraic foundations</span><span class="badge badge-muted">3 weeks</span></li>
                  <li style="display:flex;gap:.8rem;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;"><span class="min-w-0"><i class="fa-regular fa-circle-dot" aria-hidden="true" style="color:var(--primary);margin-inline-end:.5rem;"></i>Module 2 · Linear and quadratic equations</span><span class="badge badge-muted">4 weeks</span></li>
                  <li style="display:flex;gap:.8rem;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;"><span class="min-w-0"><i class="fa-regular fa-circle-dot" aria-hidden="true" style="color:var(--primary);margin-inline-end:.5rem;"></i>Module 3 · Coordinate geometry</span><span class="badge badge-muted">3 weeks</span></li>
                  <li style="display:flex;gap:.8rem;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;"><span class="min-w-0"><i class="fa-regular fa-circle-dot" aria-hidden="true" style="color:var(--primary);margin-inline-end:.5rem;"></i>Module 4 · Triangles, circles and constructions</span><span class="badge badge-muted">4 weeks</span></li>
              </ul>
          `
        },
        "general-science-lab": {
          title: "General Science Lab",
          subject: "Science",
          desc: "Concept-first science with simple experiments that make physics, chemistry and biology click.",
          breadcrumb: "General Science Lab",
          about: "Our General Science Lab is designed to bridge the gap between textbook theory and real-world application. Over 20 weeks, students engage in hands-on learning to understand the fundamental laws of nature, chemical reactions, and biological systems.",
          image: "assets/images/course-science.jpg",
          grade: "Classes 6–8",
          duration: "20 weeks",
          timing: "Tue, Thu · 17:00 – 18:15",
          size: "Max 10 students",
          tutor: "Mr. Daniel Okafor",
          price: "$85",
          tutorImg: "assets/images/tutor-2.jpg",
          tutorCred: "B.Sc. Physics · 8 years",
          tutorDesc: "Daniel makes complex scientific concepts accessible through everyday analogies and practical demonstrations.",
          dynamicHtml: `
              <h2>What students will learn</h2>
              <ul class="check-list">
                <li><i class="fa-solid fa-circle-check" aria-hidden="true"></i><span>Understand basic physical laws and forces in action</span></li>
                <li><i class="fa-solid fa-circle-check" aria-hidden="true"></i><span>Perform safe, simple chemical experiments</span></li>
                <li><i class="fa-solid fa-circle-check" aria-hidden="true"></i><span>Learn the structure of plant and animal cells</span></li>
              </ul>
          `
        },
        "english-language-literature": {
          title: "English Language & Literature",
          subject: "English & Social",
          desc: "Reading comprehension, essay structure, grammar and vocabulary expansion.",
          breadcrumb: "English Language",
          about: "A comprehensive course designed to build strong communication skills. We cover everything from foundational grammar to advanced reading comprehension and creative writing, ensuring students can express their ideas clearly and confidently.",
          image: "assets/images/course-english.jpg",
          grade: "Classes 6–8",
          duration: "24 weeks",
          timing: "Sat, Sun · 10:00 – 11:30",
          size: "Max 12 students",
          tutor: "Ms. Sofia Marino",
          price: "$80",
          tutorImg: "assets/images/tutor-3.jpg",
          tutorCred: "M.A. English · 15 years",
          tutorDesc: "Sofia fosters a love for reading and helps students find their unique writing voice.",
          dynamicHtml: `
              <h2>What students will learn</h2>
              <ul class="check-list">
                <li><i class="fa-solid fa-circle-check" aria-hidden="true"></i><span>Master essential grammar and punctuation rules</span></li>
                <li><i class="fa-solid fa-circle-check" aria-hidden="true"></i><span>Write well-structured essays and creative pieces</span></li>
              </ul>
          `
        },
        "computer-science-basics": {
          title: "Computer Science Basics",
          subject: "Computer Science",
          desc: "Block-to-Python progression, logic building, and school project support.",
          breadcrumb: "Computer Science",
          about: "This course introduces students to the world of programming and computer logic. Using Python and Scratch, students will learn to build basic applications, understand algorithmic thinking, and prepare for future tech studies.",
          image: "assets/images/course-cs.jpg",
          grade: "Classes 9–10",
          duration: "16 weeks",
          timing: "Sat · 10:00 – 12:00",
          size: "Max 10 students",
          tutor: "Mr. Ethan Blake",
          price: "$90",
          tutorImg: "assets/images/tutor-4.jpg",
          tutorCred: "B.Tech Computer Science · 6 years",
          tutorDesc: "Ethan is passionate about demystifying code and empowering students to create their own tech solutions.",
          dynamicHtml: `
              <h2>What students will learn</h2>
              <ul class="check-list">
                <li><i class="fa-solid fa-circle-check" aria-hidden="true"></i><span>Write basic scripts and programs in Python</span></li>
                <li><i class="fa-solid fa-circle-check" aria-hidden="true"></i><span>Understand loops, variables, and conditional logic</span></li>
              </ul>
          `
        },
        "physics-board-exams": {
          title: "Physics for Board Exams",
          subject: "Science",
          desc: "Derivations, numericals and past-paper practice built around the board exam blueprint.",
          breadcrumb: "Physics for Board Exams",
          about: "An intensive physics course designed to maximize board exam scores by focusing on derivations, numerical problem-solving, and rigorous past-paper analysis.",
          image: "assets/images/course-physics.jpg",
          grade: "Classes 11–12",
          duration: "20 weeks",
          timing: "Mon, Wed · 18:00 – 19:30",
          size: "Max 8 students",
          tutor: "Mr. Daniel Okafor",
          price: "$120",
          tutorImg: "assets/images/tutor-2.jpg",
          tutorCred: "B.Sc. Physics · 8 years",
          tutorDesc: "Daniel makes complex scientific concepts accessible through everyday analogies and practical demonstrations.",
          dynamicHtml: `
              <h2>What students will learn</h2>
              <ul class="check-list">
                <li><i class="fa-solid fa-circle-check" aria-hidden="true"></i><span>Master complex physics derivations</span></li>
                <li><i class="fa-solid fa-circle-check" aria-hidden="true"></i><span>Solve high-level numerical problems quickly</span></li>
              </ul>
          `
        },
        "foundation-numeracy": {
          title: "Foundation Numeracy",
          subject: "Mathematics",
          desc: "Playful, confidence-building number work with small groups and lots of encouragement.",
          breadcrumb: "Foundation Numeracy",
          about: "A gentle introduction to numbers for young learners. We build strong foundations through playful interaction and positive reinforcement.",
          image: "assets/images/course-numeracy.png",
          grade: "Classes 1–5",
          duration: "12 weeks",
          timing: "Tue, Fri · 15:00 – 16:00",
          size: "Max 6 students",
          tutor: "Ms. Amelia Hart",
          price: "$65",
          tutorImg: "assets/images/tutor-1.jpg",
          tutorCred: "M.Sc. Mathematics · 12 years",
          tutorDesc: "Amelia breaks difficult topics into small, provable steps and keeps every student working at the board.",
          dynamicHtml: `
              <h2>What students will learn</h2>
              <ul class="check-list">
                <li><i class="fa-solid fa-circle-check" aria-hidden="true"></i><span>Develop confidence with numbers and counting</span></li>
                <li><i class="fa-solid fa-circle-check" aria-hidden="true"></i><span>Understand basic arithmetic operations</span></li>
              </ul>
          `
        },
        "chemistry-concepts": {
          title: "Chemistry Concepts",
          subject: "Science",
          desc: "Organic, inorganic and physical chemistry with structured revision cycles.",
          breadcrumb: "Chemistry Concepts",
          about: "A thorough exploration of chemistry designed for higher classes. We cover organic, inorganic, and physical chemistry with practical examples.",
          image: "assets/images/course-chemistry.png",
          grade: "Classes 11–12",
          duration: "24 weeks",
          timing: "Tue, Thu · 18:00 – 19:30",
          size: "Max 10 students",
          tutor: "Ms. Priya Raman",
          price: "$115",
          tutorImg: "assets/images/tutor-3.jpg",
          tutorCred: "M.Sc. Chemistry · 10 years",
          tutorDesc: "Priya specializes in making organic chemistry intuitive and memorable.",
          dynamicHtml: `
              <h2>What students will learn</h2>
              <ul class="check-list">
                <li><i class="fa-solid fa-circle-check" aria-hidden="true"></i><span>Understand organic chemistry mechanisms</span></li>
                <li><i class="fa-solid fa-circle-check" aria-hidden="true"></i><span>Master physical chemistry calculations</span></li>
              </ul>
          `
        },
        "social-science-civics": {
          title: "Social Science & Civics",
          subject: "English & Social",
          desc: "History, geography and civics with mind-maps, timelines and short-answer technique.",
          breadcrumb: "Social Science",
          about: "This course helps students navigate history and geography using visual aids like mind-maps and timelines to make retaining facts much easier.",
          image: "assets/images/course-social.png",
          grade: "Classes 6–10",
          duration: "18 weeks",
          timing: "Wed, Sat · 11:00 – 12:15",
          size: "Max 12 students",
          tutor: "Ms. Sofia Marino",
          price: "$75",
          tutorImg: "assets/images/tutor-3.jpg",
          tutorCred: "M.A. English & History · 15 years",
          tutorDesc: "Sofia brings history to life and helps students structure their answers effectively.",
          dynamicHtml: `
              <h2>What students will learn</h2>
              <ul class="check-list">
                <li><i class="fa-solid fa-circle-check" aria-hidden="true"></i><span>Create effective mind-maps for history</span></li>
                <li><i class="fa-solid fa-circle-check" aria-hidden="true"></i><span>Master short-answer techniques for exams</span></li>
              </ul>
          `
        }
      };

      if (!courseName || !courseData[courseName]) {
        var heroTitle = document.getElementById("course-hero-title");
        if (heroTitle) heroTitle.textContent = "Course Not Found";
        var main = document.getElementById("main");
        if (main) main.innerHTML = "<div class='container' style='padding:4rem 0;text-align:center;'><h2>Sorry, we couldn't find that course.</h2><p>The course you are looking for does not exist or has been removed.</p><a href='courses.html' class='btn btn-primary'>View All Courses</a></div>";
        document.getElementById("course-breadcrumb").textContent = "Not Found";
      } else {
        var data = courseData[courseName];
        
        var d = function(id, text) { 
            var el = document.getElementById(id); 
            if(el) el.textContent = text; 
        };
        var s = function(id, attr, val) { 
            var el = document.getElementById(id); 
            if(el) el.setAttribute(attr, val); 
        };
        
        d("course-hero-title", data.title);
        d("course-hero-desc", data.desc);
        d("course-breadcrumb", data.breadcrumb);
        d("course-about-desc", data.about);
        d("course-meta-subject", data.subject);
        d("course-meta-grade", data.grade);
        d("course-meta-duration", data.duration);
        d("course-meta-timing", data.timing);
        d("course-meta-size", data.size);
        d("course-meta-tutor", data.tutor);
        d("course-meta-price", data.price);
        d("course-tutor-name", data.tutor);
        d("course-tutor-cred", data.tutorCred);
        d("course-tutor-desc", data.tutorDesc);
        
        s("course-hero-img", "src", data.image);
        s("course-main-img", "src", data.image);
        s("course-tutor-img", "src", data.tutorImg);
        
        var dynContent = document.getElementById("course-dynamic-content");
        if(dynContent) {
            dynContent.innerHTML = data.dynamicHtml;
        }
        
        var relatedGrid = document.getElementById("related-courses-grid");
        if (relatedGrid) {
            var allCourseIds = Object.keys(courseData);
            var relatedIds = allCourseIds.filter(function(id) { return id !== courseName; });
            relatedIds = relatedIds.slice(0, 3);
            
            var relatedHtml = "";
            relatedIds.forEach(function(id) {
                var c = courseData[id];
                var searchCat = c.subject.toLowerCase();
                relatedHtml += '<article class="card card-hover reveal" data-category="' + searchCat + '" data-search-text="' + c.title + ' ' + c.grade + ' ' + c.tutor + '">';
                relatedHtml += '  <div class="card-media">';
                relatedHtml += '    <img src="' + c.image + '" alt="' + c.title + ' class at LearnSphere" loading="lazy" width="1000" height="700">';
                relatedHtml += '    <span class="badge badge-float">' + c.grade + '</span>';
                relatedHtml += '  </div>';
                relatedHtml += '  <div class="card-body">';
                relatedHtml += '    <h3>' + c.title + '</h3>';
                relatedHtml += '    <p class="clamp-3">' + c.desc + '</p>';
                relatedHtml += '    <ul class="meta-row" style="list-style:none;padding:0;margin:.25rem 0 0;">';
                relatedHtml += '      <li class="meta"><i class="fa-regular fa-user" aria-hidden="true"></i>' + c.tutor + '</li>';
                relatedHtml += '      <li class="meta"><i class="fa-regular fa-clock" aria-hidden="true"></i>' + c.timing + '</li>';
                relatedHtml += '    </ul>';
                relatedHtml += '    <div class="card-foot">';
                relatedHtml += '      <span class="price-tag">' + c.price + ' / month</span>';
                relatedHtml += '      <a class="btn btn-outline btn-sm" href="course-details.html?course=' + id + '">View Details<i class="fa-solid fa-arrow-right ico-dir" aria-hidden="true"></i></a>';
                relatedHtml += '    </div>';
                relatedHtml += '  </div>';
                relatedHtml += '</article>';
            });
            relatedGrid.innerHTML = relatedHtml;
        }
      }
    }

    /* ---------- Demo forms ------------------------------------------------ */
    var toast = document.querySelector("[data-toast]");
    function showToast(message) {
      if (!toast) return;
      var p = toast.querySelector("p");
      if (p) p.textContent = message;
      toast.classList.add("is-visible");
      window.setTimeout(function () { toast.classList.remove("is-visible"); }, 3800);
    }
    document.querySelectorAll("[data-demo-form]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }
        showToast(form.getAttribute("data-demo-form") || "Thanks! This is a demo form — no data was sent.");
        form.reset();
      });
    });

    /* ---------- Countdown -------------------------------------------------- */
    var countdown = document.querySelector("[data-countdown]");
    if (countdown) {
      var target = new Date(countdown.getAttribute("data-countdown")).getTime();
      var tick = function () {
        var diff = Math.max(0, target - Date.now());
        var d = Math.floor(diff / 86400000);
        var h = Math.floor(diff / 3600000) % 24;
        var m = Math.floor(diff / 60000) % 60;
        var s = Math.floor(diff / 1000) % 60;
        var map = { days: d, hours: h, minutes: m, seconds: s };
        Object.keys(map).forEach(function (k) {
          var el = countdown.querySelector('[data-unit="' + k + '"]');
          if (el) el.textContent = String(map[k]).padStart(2, "0");
        });
      };
      tick();
      window.setInterval(tick, 1000);
    }

    /* ---------- Reveal on scroll ------------------------------------------ */
    var revealables = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && revealables.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      revealables.forEach(function (el) { io.observe(el); });
    } else {
      revealables.forEach(function (el) { el.classList.add("is-visible"); });
    }

    /* ---------- Current year ---------------------------------------------- */
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
    /* ---------- Course Filtering & Pagination ----------------------------- */
    (function() {
      var courseGrid = document.getElementById("course-grid");
      if (!courseGrid) return;
      
      var searchInput = document.getElementById("course-search");
      var filterGroup = document.getElementById("course-filters");
      var pagination = document.getElementById("course-pagination");
      
      // Normalize class-range values: strip "classes" prefix/spaces, convert
      // en-dash/em-dash to a plain hyphen, so "Classes 9–10", "9-10" and
      // "classes 9 - 10" all compare equal. Exact match only (no substring
      // matching), so a value like "1" can never accidentally match "11-12".
      function normalizeClass(raw) {
        if (!raw) return "";
        return String(raw)
          .toLowerCase()
          .replace(/classes/g, "")
          .replace(/[\u2013\u2014]/g, "-") // en dash / em dash -> hyphen
          .replace(/\s+/g, "")
          .trim();
      }
      
      var state = {
        classFilter: normalizeClass(new URLSearchParams(window.location.search).get("class") || ""),
        categoryFilter: "all",
        searchQuery: "",
        page: 1,
        itemsPerPage: 6
      };
      
      // Init category from URL if present — but a class-filtered page only
      // ever shows "All Courses", so ignore any category param in that case.
      var urlCategory = new URLSearchParams(window.location.search).get("category");
      if (urlCategory && !state.classFilter) {
        state.categoryFilter = urlCategory;
      }
      
      function updateHeadings() {
        var eyebrow = document.querySelector(".section-head.start .eyebrow");
        var h2 = document.querySelector(".section-head.start h2");
        if (state.classFilter) {
          if (eyebrow) eyebrow.innerText = "Filtered View";
          if (h2) h2.innerText = "Classes " + state.classFilter;
        } else {
          if (eyebrow) eyebrow.innerText = "All courses";
          if (h2) h2.innerText = "Choose a subject batch";
        }
      }
      
      function render() {
        var allCards = Array.from(courseGrid.querySelectorAll("article.card"));
        var filtered = [];
        
        // 1. Filter
        allCards.forEach(function(card) {
          var cardClass = normalizeClass(card.getAttribute("data-class") || "");
          var cardCat = (card.getAttribute("data-category") || "").split(" ");
          var cardText = (card.getAttribute("data-search-text") || "").toLowerCase();
          
          // Exact match on the normalized class range (never a substring
          // match), so selecting "1-5" never pulls in "11-12" courses.
          var matchClass = !state.classFilter || cardClass === state.classFilter;
          var matchCat = state.categoryFilter === "all" || cardCat.indexOf(state.categoryFilter) > -1;
          var matchSearch = !state.searchQuery || cardText.indexOf(state.searchQuery) > -1;
          
          if (matchClass && matchCat && matchSearch) {
            filtered.push(card);
          }
        });
        
        // 2. Pagination
        var totalPages = Math.max(1, Math.ceil(filtered.length / state.itemsPerPage));
        if (state.page > totalPages) state.page = totalPages;
        if (state.page < 1) state.page = 1;
        
        var startIndex = (state.page - 1) * state.itemsPerPage;
        var endIndex = startIndex + state.itemsPerPage;
        
        // 3. Display
        allCards.forEach(function(card) {
          card.style.display = "none";
        });
        
        filtered.slice(startIndex, endIndex).forEach(function(card) {
          card.style.display = "";
        });
        
        // 4. Empty State
        var emptyMsg = document.getElementById("course-empty-msg");
        if (filtered.length === 0) {
          if (!emptyMsg) {
            emptyMsg = document.createElement("p");
            emptyMsg.id = "course-empty-msg";
            emptyMsg.className = "text-center";
            emptyMsg.style.gridColumn = "1 / -1";
            emptyMsg.innerText = "No courses available in this category.";
            courseGrid.appendChild(emptyMsg);
          }
          emptyMsg.style.display = "";
        } else if (emptyMsg) {
          emptyMsg.style.display = "none";
        }
        
        // 5. Render Pagination HTML
        if (pagination) {
          pagination.innerHTML = "";
          if (totalPages > 1) {
            var prevLi = document.createElement("li");
            var prevBtn = document.createElement("a");
            prevBtn.href = "#";
            prevBtn.innerHTML = '<i class="fa-solid fa-arrow-left ico-dir" aria-hidden="true"></i>Prev';
            if (state.page === 1) prevLi.classList.add("disabled");
            prevBtn.addEventListener("click", function(e) {
              e.preventDefault();
              if (state.page > 1) { state.page--; render(); }
            });
            prevLi.appendChild(prevBtn);
            pagination.appendChild(prevLi);
            
            for (var i = 1; i <= totalPages; i++) {
              var li = document.createElement("li");
              if (i === state.page) {
                li.innerHTML = '<span class="is-current" aria-current="page">' + i + '</span>';
              } else {
                var a = document.createElement("a");
                a.href = "#";
                a.innerText = i;
                (function(pageNum) {
                  a.addEventListener("click", function(e) {
                    e.preventDefault();
                    state.page = pageNum;
                    render();
                  });
                })(i);
                li.appendChild(a);
              }
              pagination.appendChild(li);
            }
            
            var nextLi = document.createElement("li");
            var nextBtn = document.createElement("a");
            nextBtn.href = "#";
            nextBtn.innerHTML = 'Next<i class="fa-solid fa-arrow-right ico-dir" aria-hidden="true"></i>';
            nextBtn.addEventListener("click", function(e) {
              e.preventDefault();
              if (state.page < totalPages) { 
                state.page++; 
                render(); 
              } else {
                window.location.href = "coming-soon.html";
              }
            });
            nextLi.appendChild(nextBtn);
            pagination.appendChild(nextLi);
          }
        }
        
        // Sync filter buttons
        if (filterGroup) {
          // On a class-filtered page, only "All Courses" is shown — the
          // subject buttons (Mathematics, Science, etc.) are hidden, not
          // removed, so the main Courses page (no ?class=) is unaffected.
          filterGroup.querySelectorAll("[data-filter]").forEach(function(btn) {
            var val = btn.getAttribute("data-filter");
            var isActive = val === state.categoryFilter;
            btn.classList.toggle("is-active", isActive);
            btn.setAttribute("aria-pressed", isActive ? "true" : "false");
            btn.style.display = (state.classFilter && val !== "all") ? "none" : "";
          });
        }
        
        // Update URL
        var url = new URL(window.location);
        if (state.classFilter) url.searchParams.set("class", state.classFilter);
        else url.searchParams.delete("class");
        
        if (state.categoryFilter !== "all") url.searchParams.set("category", state.categoryFilter);
        else url.searchParams.delete("category");
        
        window.history.replaceState({}, "", url);
      }
      
      // Events
      if (filterGroup) {
        filterGroup.addEventListener("click", function(e) {
          var btn = e.target.closest("[data-filter]");
          if (!btn) return;
          if (state.classFilter && btn.getAttribute("data-filter") !== "all") return;
          state.categoryFilter = btn.getAttribute("data-filter");
          state.page = 1;
          render();
        });
      }
      
      if (searchInput) {
        searchInput.addEventListener("input", function() {
          state.searchQuery = searchInput.value.trim().toLowerCase();
          state.page = 1;
          render();
        });
      }
      
      updateHeadings();
      render();
    })();

  });
})();
