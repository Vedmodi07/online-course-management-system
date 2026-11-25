# LearnHub — Online Course Management System

A beginner-friendly Software Engineering mini project made with HTML, CSS and JavaScript.

## Features
- Login screen with Student, Instructor and Admin roles
- Dashboard with course and enrollment summary
- Course catalogue
- Student course enrollment and My Learning page
- Admin panel to add and delete courses
- Instructor panel to view courses assigned to their name
- Browser storage keeps demo courses and enrollments on the same device

## Run in VS Code
1. Extract `online-course-management-system.zip`.
2. Open the extracted folder in Visual Studio Code.
3. Open `index.html` in a browser, or use the VS Code Live Server extension.
4. Enter any name and password on the login page and choose a role.

## Demo login
There is no fixed username/password. For example:
- Student: name `Aman`, password `123`
- Instructor: name `Aarav Sharma`, password `123`
- Admin: name `Admin`, password `123`

To see the instructor page with a course, log in as `Aarav Sharma` and choose Instructor.

## Important project limitation
This is a front-end academic prototype. Login is a role-selection demonstration, not secure authentication. Data is stored in the browser using localStorage/sessionStorage. For a production system, add a backend, database, password hashing, and server-side role authorization.

## Suggested software engineering modules
1. User Authentication (demo)
2. Course Management
3. Student Enrollment
4. Instructor Management
5. Admin Management
