
# Project Summary: Skilted Platform

## 1. Project Overview

Skilted is a modern, full-featured web platform designed to connect skilled professionals with job opportunities. It functions as a two-sided marketplace with distinct interfaces and functionalities for regular users (professionals) and administrators.

The platform is built as a monorepo, which is a modern software development strategy for managing code in a single repository. This improves code sharing, simplifies dependency management, and allows for streamlined development across the different parts of the application.

## 2. Core Features

The platform is divided into two main applications: a User-facing app and an Admin dashboard.

### User-Facing Application:
- **User Authentication:** Secure sign-up and login for professionals.
- **Detailed User Profiles:** Users can create and manage comprehensive profiles showcasing their skills, work history, education, certifications, and more.
- **Job Discovery:** Users can browse and search for job postings.
- **Bidding System:** Professionals can place bids on jobs they are interested in.
- **Saved Jobs:** Ability to save interesting jobs for future reference.
- **Real-time Chat:** Users can communicate directly with administrators via a built-in chat system.

### Admin Dashboard:
- **Secure Admin Login:** Separate and secure access for administrators.
- **Job Management:** Admins can create, update, and manage all job postings, including details like title, description, required technologies, and base bidding price.
- **User Management:** (Implied) Admins have oversight of the users on the platform.
- **Chat Interface:** Admins can communicate with multiple users from a centralized dashboard.

## 3. Technical Architecture

The project is built using a modern and robust technology stack to ensure scalability, performance, and a great user experience.

### Frontend (User & Admin Apps)
- **Framework:** **Next.js (React)** - A leading framework for building fast and user-friendly web applications.
- **Language:** **TypeScript** - For writing robust, error-free code.
- **Styling:** **Tailwind CSS** - For creating a modern and responsive user interface.

### Backend
- **Framework:** **Node.js** with **Express.js** - A fast and efficient combination for building powerful APIs.
- **Language:** **TypeScript**.
- **Real-time Communication:** **Socket.IO** - Powers the live chat feature between users and admins.
- **Background Jobs:** **BullMQ** and **Redis** are used to handle background tasks like sending email notifications, ensuring the app remains fast and responsive.
- **Authentication:** **JSON Web Tokens (JWT)** are used for secure and stateless user authentication.

### Database
- **Database System:** **PostgreSQL** - A powerful and reliable open-source relational database.
- **ORM (Object-Relational Mapping):** **Prisma** - Simplifies database access and ensures type-safe database queries, reducing the likelihood of errors.

### Development & Deployment
- **Monorepo Management:** **Turborepo** - Manages the entire project, streamlining the development workflow.
