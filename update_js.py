import re
from pathlib import Path

js_path = Path(r"c:\Users\vv356\Downloads\LearnSphere-Tutoring-HTML-Template\LearnSphere-Tutoring-HTML-Template\assets\js\main.js")
with open(js_path, "r", encoding="utf-8") as f:
    js_content = f.read()

# I will replace the entire courseData object in main.js
new_courseData = """      var courseData = {
        "mathematics-mastery": {
          title: "Mathematics Mastery",
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
      };"""

js_content = re.sub(r'var courseData = \{.*?\}\s*;\s*if \(\!courseName \|\| \!courseData\[courseName\]\)', new_courseData + '\n\n      if (!courseName || !courseData[courseName])', js_content, flags=re.DOTALL)

with open(js_path, "w", encoding="utf-8") as f:
    f.write(js_content)
    
print("Updated main.js with new course data.")
