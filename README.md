
# Making Your SmartLMS Project Deployment-Ready

This guide explains why your project currently shows a blank page on services like Vercel and provides step-by-step instructions to migrate it to a production-ready **Next.js** application.

## The "Why": Development vs. Production

Your current setup is a **development environment**. It relies on an in-browser compiler to translate `.tsx` files into JavaScript on the fly. This is great for rapid development but is not how production websites work.

Production platforms like Vercel need **pre-built, static files**. Browsers only understand HTML, CSS, and plain JavaScript—not `.tsx` or JSX. To fix the blank page, we need to introduce a **build step** that compiles and optimizes your code *before* deployment. The best way to do this is by using a framework like Next.js.

## Migration Guide: From React SPA to Next.js

Follow these steps to convert your application into a real Next.js project that you can deploy successfully.

### Step 1: Create a New Next.js Project

Open your computer's terminal and run the following command. This will scaffold a new project with all the necessary configurations.

```bash
npx create-next-app@latest smartlms-app --typescript --tailwind --eslint
```

When prompted, you can accept the default options. This creates a new folder named `smartlms-app`.

### Step 2: Copy Your Code

Navigate into your new project (`cd smartlms-app`) and copy your existing folders into it.

1.  Delete the default `app/page.tsx` and `app/globals.css` from the new project.
2.  Copy your existing folders: `components`, `context`, `pages`, `services`.
3.  Copy your existing files: `constants.ts`, `types.ts`.

Your new project structure should now look like this:
```
smartlms-app/
├── app/
├── components/      <-- Your copied folder
├── context/         <-- Your copied folder
├── pages/           <-- Your copied folder
├── public/
├── services/        <-- Your copied folder
├── constants.ts     <-- Your copied file
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── types.ts         <-- Your copied file
```

### Step 3: Install Additional Dependencies

Your project uses `recharts` for charts. Install it in your new project.

```bash
npm install recharts
```

### Step 4: Configure the Root Layout and Styles

The `app/layout.tsx` file is the main template for your entire application. It replaces your `index.html`. We'll use it to set up the global `AppProvider`.

1.  **Replace the content of `app/layout.tsx` with this:**

    ```tsx
    // app/layout.tsx
    import type { Metadata } from "next";
    import { Inter } from "next/font/google";
    import "./globals.css";
    import { AppProvider } from '../context/AppContext';

    const inter = Inter({ subsets: ["latin"] });

    export const metadata: Metadata = {
      title: "SmartLMS: AI-Powered Learning Paths",
      description: "AI-powered placement readiness platform.",
    };

    export default function RootLayout({
      children,
    }: Readonly<{
      children: React.ReactNode;
    }>) {
      return (
        <html lang="en">
          <body className={`${inter.className} bg-gray-900 text-white`}>
            <AppProvider>
              {children}
            </AppProvider>
          </body>
        </html>
      );
    }
    ```

2.  **Create a new `app/globals.css` file** and add the basic Tailwind directives that Next.js needs:

    ```css
    /* app/globals.css */
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```

### Step 5: Recreate the Main Page and Add "use client"

1.  **Create the Main Page:** The entry point for your site is `app/page.tsx`. This will now contain the logic from your `App.tsx` to decide which component to render based on the user's login state.

    Create a new file `app/page.tsx` and add this code:

    ```tsx
    // app/page.tsx
    "use client"; // This component uses hooks, so it must be a client component

    import React from 'react';
    import { useAppContext } from '../context/AppContext';
    import LandingPage from '../pages/LandingPage';
    import AdminDashboard from '../pages/AdminDashboard';
    import StudentDashboard from '../pages/StudentDashboard';
    import { UserRole } from '../types';

    export default function HomePage() {
      const { user } = useAppContext();

      if (!user) {
        return <LandingPage />;
      }

      if (user.role === UserRole.Admin) {
        return <AdminDashboard />;
      }
    
      if (user.role === UserRole.Student) {
        return <StudentDashboard />;
      }

      // You can return a loading indicator here while the user state is being determined
      return null;
    }
    ```

2.  **Add `"use client";`:** This is the most important change. Next.js renders components on the server by default. Since your components use React Hooks (`useState`, `useContext`, etc.), they need to run in the browser. You must add the `"use client";` directive at the **very top** of every file that uses a hook.

    This includes:
    *   `app/page.tsx` (as done above)
    *   `context/AppContext.tsx`
    *   `pages/LandingPage.tsx`
    *   `pages/AdminDashboard.tsx`
    *   `pages/StudentDashboard.tsx`
    *   `components/Sidebar.tsx`
    *   All chart components in `components/charts/`

### Step 6: Handle Environment Variables

Your `geminiService.ts` file uses `process.env.API_KEY`. In Next.js, environment variables used in browser-side code must be prefixed with `NEXT_PUBLIC_`.

1.  Create a file named `.env.local` in the root of your `smartlms-app` folder.
2.  Add your API key to this file:
    ```
    NEXT_PUBLIC_API_KEY=your_gemini_api_key_here
    ```
3.  Update `services/geminiService.ts` to use the new variable name:

    ```typescript
    // services/geminiService.ts (partial change)
    const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
    ```

### Step 7: Run and Deploy

1.  **Run locally:** Start the development server to see your app in action.
    ```bash
    npm run dev
    ```
    Open `http://localhost:3000` in your browser.

2.  **Deploy to Vercel:** Push your new `smartlms-app` project to a GitHub repository. Connect that repository to Vercel. Vercel will automatically detect that it's a Next.js project, run the build command (`npm run build`), and deploy the optimized output. Your app will now be live!
