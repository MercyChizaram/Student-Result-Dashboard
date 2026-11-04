# Student Result Dashboard

A simple Student Result Dashboard built with **Next.js, TypeScript, and Tailwind CSS**.

This project was created as a practical refreshment exercise to revisit fundamental frontend development concepts and understand how they work together in a Next.js application.

## Technologies Used

- Next.js
- TypeScript
- Tailwind CSS
- React

## Features

- Displays student records.
- Shows student names, courses, IDs, and scores.
- Automatically identifies students who passed or failed.
- Displays total students, passed students, and failed students.
- Uses responsive layouts with Tailwind CSS.
- Uses a score progress bar for each student.

## Concepts Practised

- TypeScript types and arrays of objects.
- Array methods: `.map()` and `.filter()`.
- Conditional rendering.
- JSX and template literals.
- Tailwind CSS utility classes.
- Next.js App Router.
- Root layout using `layout.tsx`.

## Project Structure

```text
student-dashboard/
└── src/
    └── app/
        ├── globals.css
        ├── layout.tsx
        └── page.tsx
```

The dashboard logic and interface are contained in a single `page.tsx` file to keep the exercise simple.

## Getting Started

Clone the repository:

```bash
git clone ["copy the url"](https://github.com/KdanTechnies/nextjs-student-result-dashboard.git)
```

Move into the project:

```bash
cd student-dashboard
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Learning Objective

The goal of this project is to strengthen understanding of TypeScript, Next.js, and Tailwind CSS through a small practical application rather than simply memorising syntax.

---

**Built as a frontend development practice project.**
