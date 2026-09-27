const typed = document.getElementById("typed");
const phrases = [
  "a Mechatronics Engineering Student",
  "an Automation Enthusiast",
  "a Robotics Learner",
  "a Computer Vision Builder",
  "a 3D Design Enthusiast"
];
let p = 0, c = 0, deleting = false;

function typeLoop(){
  const word = phrases[p];
  typed.textContent = deleting ? word.slice(0, c--) : word.slice(0, c++);
  if(!deleting && c > word.length){ deleting = true; setTimeout(typeLoop, 1200); return; }
  if(deleting && c < 0){ deleting = false; p = (p + 1) % phrases.length; c = 0; }
  setTimeout(typeLoop, deleting ? 35 : 65);
}
typeLoop();

const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav-links");
menuBtn?.addEventListener("click", ()=>nav.classList.toggle("open"));
document.querySelectorAll(".nav-links a").forEach(a => a.addEventListener("click", ()=>nav.classList.remove("open")));

const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting) entry.target.classList.add("visible");
  });
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

document.getElementById("year").textContent = new Date().getFullYear();

document.getElementById("contactForm").addEventListener("submit", e=>{
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim() || "Portfolio Contact";
  const message = document.getElementById("message").value.trim();
  const body = `Name: ${name}%0AEmail: ${email}%0A%0A${encodeURIComponent(message)}`;
  window.location.href = `mailto:karthikm270706@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
});