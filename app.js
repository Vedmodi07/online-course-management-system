const defaultCourses = [
  {id:1,title:"Web Development Fundamentals",category:"Development",instructor:"Aarav Sharma",duration:"6 weeks",icon:"💻"},
  {id:2,title:"Python Programming",category:"Programming",instructor:"Priya Verma",duration:"8 weeks",icon:"🐍"},
  {id:3,title:"UI/UX Design Basics",category:"Design",instructor:"Rohan Mehta",duration:"4 weeks",icon:"🎨"}
];
let courses = JSON.parse(localStorage.getItem("lh_courses") || "null") || defaultCourses;
let enrollments = JSON.parse(localStorage.getItem("lh_enrollments") || "[]");
let currentUser = JSON.parse(sessionStorage.getItem("lh_user") || "null");
const $ = id => document.getElementById(id);
const save = () => { localStorage.setItem("lh_courses",JSON.stringify(courses)); localStorage.setItem("lh_enrollments",JSON.stringify(enrollments)); };
const roleName = r => r.charAt(0).toUpperCase()+r.slice(1);

$("login-form").addEventListener("submit",e=>{
  e.preventDefault();
  currentUser={name:$("name").value.trim(),role:$("role").value};
  sessionStorage.setItem("lh_user",JSON.stringify(currentUser)); showApp();
});
$("logout").addEventListener("click",()=>{
  sessionStorage.removeItem("lh_user"); currentUser=null;
  $("app").classList.add("hidden"); $("login-screen").classList.remove("hidden");
});
document.querySelectorAll(".nav-link[data-page]").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".nav-link").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active"); render(btn.dataset.page);
}));

function showApp(){
  if(!currentUser)return;
  $("login-screen").classList.add("hidden"); $("app").classList.remove("hidden");
  $("user-name").textContent=currentUser.name; $("user-role").textContent=roleName(currentUser.role);
  $("avatar").textContent=currentUser.name.charAt(0).toUpperCase();
  document.querySelectorAll(".role-only").forEach(el=>el.classList.toggle("hidden",!["admin","instructor"].includes(currentUser.role) || (el.dataset.page==="admin"&&currentUser.role!=="admin") || (el.dataset.page==="instructor"&&currentUser.role!=="instructor")));
  render("dashboard");
}
function stats(){
  return `<div class="stats"><div class="stat"><span>Available Courses</span><strong>${courses.length}</strong></div><div class="stat"><span>My Enrollments</span><strong>${enrollments.filter(x=>x.student===currentUser.name).length}</strong></div><div class="stat"><span>Your Role</span><strong style="font-size:20px">${roleName(currentUser.role)}</strong></div></div>`;
}
function courseCards(list){
  if(!list.length)return `<p class="empty">No courses available yet.</p>`;
  return `<div class="course-grid">${list.map(c=>`<article class="course-card"><div class="course-art">${c.icon||"📘"}</div><span class="tag">${c.category}</span><h4>${c.title}</h4><p>Instructor: ${c.instructor}<br>Duration: ${c.duration}</p><button class="primary" onclick="enroll(${c.id})">${enrollments.some(x=>x.courseId===c.id&&x.student===currentUser.name)?"Enrolled":"Enroll Now"}</button></article>`).join("")}</div>`;
}
function render(page){
  const names={dashboard:"Dashboard",courses:"Explore Courses","my-learning":"My Learning",admin:"Admin Panel",instructor:"Instructor Panel"};
  $("page-heading").textContent=names[page]||"Dashboard";
  let html="";
  if(page==="dashboard"){
    html=`<div class="welcome"><h3>Hello, ${escapeHtml(currentUser.name)} 👋</h3><p>Welcome to LearnHub. Continue learning and build new skills.</p></div>${stats()}<div class="section-head"><h3>Popular Courses</h3></div>${courseCards(courses.slice(0,3))}`;
  }else if(page==="courses"){
    html=`<div class="section-head"><h3>All Courses</h3><span class="muted">${courses.length} courses</span></div>${courseCards(courses)}`;
  }else if(page==="my-learning"){
    const mine=courses.filter(c=>enrollments.some(x=>x.courseId===c.id&&x.student===currentUser.name));
    html=`<div class="panel"><h3>My Enrolled Courses</h3>${mine.length?courseCards(mine):'<p class="empty">You have not enrolled in any courses. Visit Courses to get started.</p>'}</div>`;
  }else if(page==="admin"){
    html=`<div class="welcome"><h3>Administrator Dashboard</h3><p>Add courses and manage the course catalogue.</p></div>${stats()}<div class="panel"><h3>Add a New Course</h3><form id="course-form"><div class="form-row"><label>Course title<input name="title" required placeholder="e.g. Java Programming"></label><label>Category<input name="category" required placeholder="e.g. Programming"></label><label>Instructor name<input name="instructor" required placeholder="Instructor name"></label><label>Duration<input name="duration" required placeholder="e.g. 5 weeks"></label></div><div class="form-actions"><button class="primary">Add Course</button></div></form></div><div class="panel"><h3>Course Catalogue</h3>${courseTable(true)}</div>`;
    setTimeout(()=>{const f=$("course-form");if(f)f.addEventListener("submit",addCourse)},0);
  }else if(page==="instructor"){
    const mine=courses.filter(c=>c.instructor.toLowerCase()===currentUser.name.toLowerCase());
    html=`<div class="welcome"><h3>Instructor Workspace</h3><p>View the courses assigned to you.</p></div><div class="panel"><h3>Courses Assigned to ${escapeHtml(currentUser.name)}</h3>${mine.length?courseTable(false,mine):'<p class="empty">No courses are assigned to your name yet. Ask the admin to add a course using your name as instructor.</p>'}</div><div class="panel"><h3>Instructor Responsibilities</h3><p class="muted">Prepare course material, guide students, and monitor learning progress.</p></div>`;
  }
  $("page-content").innerHTML=html;
}
function courseTable(canDelete,list=courses){
  return `<div class="table-wrap"><table><thead><tr><th>Course</th><th>Category</th><th>Instructor</th><th>Duration</th>${canDelete?"<th>Action</th>":""}</tr></thead><tbody>${list.map(c=>`<tr><td>${escapeHtml(c.title)}</td><td>${escapeHtml(c.category)}</td><td>${escapeHtml(c.instructor)}</td><td>${escapeHtml(c.duration)}</td>${canDelete?`<td><button class="primary" onclick="deleteCourse(${c.id})">Delete</button></td>`:""}</tr>`).join("")}</tbody></table></div>`;
}
function addCourse(e){
  e.preventDefault();const d=new FormData(e.target);
  courses.push({id:Date.now(),title:d.get("title"),category:d.get("category"),instructor:d.get("instructor"),duration:d.get("duration"),icon:"📘"});
  save();render("admin");
}
function deleteCourse(id){courses=courses.filter(c=>c.id!==id);enrollments=enrollments.filter(x=>x.courseId!==id);save();render("admin")}
function enroll(id){
  if(!enrollments.some(x=>x.courseId===id&&x.student===currentUser.name)){enrollments.push({courseId:id,student:currentUser.name});save();render("courses")}
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
if(currentUser)showApp();
