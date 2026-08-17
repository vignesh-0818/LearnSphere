const fs = require('fs');
const html = fs.readFileSync('courses.html', 'utf8');

const courses = [];
const rx = /<article class="card[^>]*data-category="([^"]+)"[^>]*data-class="([^"]+)"[^>]*>.*?<img src="([^"]+)".*?<h3>(.*?)<\/h3>.*?<p class="clamp-3">(.*?)<\/p>.*?<li class="meta"><i class="fa-regular fa-user"[^>]*><\/i>(.*?)<\/li>.*?<li class="meta"><i class="fa-regular fa-clock"[^>]*><\/i>(.*?)<\/li>.*?<span class="price-tag">(.*?)<\/span>.*?href="course-details\.html\?course=([^"]+)"/gs;

let m;
while ((m = rx.exec(html)) !== null) {
  courses.push({
    id: m[9],
    category: m[1],
    classRange: m[2],
    image: m[3],
    title: m[4],
    description: m[5],
    tutor: m[6],
    schedule: m[7],
    price: m[8]
  });
}

fs.writeFileSync('courses_data.json', JSON.stringify(courses, null, 2));
