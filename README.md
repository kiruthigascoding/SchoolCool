# School Cool - School Management System

School Cool is a web-based School Management System built using the MERN stack (MongoDB, Express.js, React, Node.js). The system is designed to streamline administrative tasks, including student and staff management, attendance tracking, grade management, and communication between parents, teachers, and administrators.

## Features

### 1. **User Authentication**
   - Supports user registration, login, and role-based access control.
   - Different user roles: Admin, Teacher, Student, and Parent.
   - Secure authentication using JWT tokens.

### 2. **Student Management**
   - Create, modify, and delete student records.
   - Store personal information, enrollment status, and academic history.
   
### 3. **Staff Management**
   - Manage staff details including personal information, employment status, and teaching assignments.
   
### 4. **Course Scheduling**
   - Create and manage class schedules.
   - Assign classes to instructors, allocate rooms, and set class timings.
   
### 5. **Attendance Tracking**
   - Teachers can record and track student attendance for each class.
   - Admins and parents can monitor overall attendance trends.

### 6. **Grade Management**
   - Teachers can input and manage student grades.
   - Generate report cards and progress reports for parents.

### 7. **Parent Portal**
   - Parents can access their children’s academic information such as attendance, grades, and teacher feedback.

### 8. **Communication Tools**
   - Direct messaging between teachers, students, and parents.
   - Group messaging for announcements and notifications.

### 9. **Resource Management**
   - Administrators can manage school resources (classrooms, labs, equipment).
   - Track usage and availability of resources.

### 10. **Dashboard and Reporting**
   - Personalized dashboards for different user roles.
   - Generate reports to monitor school performance and make data-driven decisions.

## Technologies Used

- **Frontend**: React, Redux, React Router, Axios
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **State Management**: UseState Hook
- **Styling**: CSS
- **Deployment**: Heroku

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/en/) (v14.x or higher)
- [MongoDB](https://www.mongodb.com/) (You can use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for a cloud database)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

### Installation

#### 1. Clone the repository:
```bash
git clone https://github.com/kiruthigascoding/SchoolCool.git
cd school_cool

cd backend
nodemon index.js

cd ../frontend
npm install
npm  run start



