
# LeadFlow CRM
## Live Demo

[Visit LeadFlow CRM](https://leadflow-crm-omega-seven.vercel.app/)

A Mini CRM Dashboard built to manage, track, and organize customer leads through a simple and responsive interface.

## Overview

LeadFlow is a lightweight Customer Relationship Management (CRM) application that helps users manage customer enquiries, monitor lead progress, and keep track of conversions.

The application uses Supabase as its backend database to store and manage lead information.

## Features

- Dashboard with total leads, new leads, and converted leads.
- Add new customer leads.
- View all saved leads.
- Edit existing lead information.
- Delete leads.
- Update lead status directly from the dashboard.
- Search leads by name or email.
- Filter leads by status.
- Persistent database storage using Supabase.
- Responsive dashboard layout.
- Loading, error, and empty states.
- Form validation using required fields and email input validation.

## Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend development |
| TypeScript | Type safety |
| Vite | Development and build tool |
| CSS | Styling and responsive design |
| Supabase | Database and backend API |
| PostgreSQL | Database |
| Lucide React | Icons |
| Git & GitHub | Version control |

## Project Structure

```text
leadflow-crm/
├── public/
├── src/
│   ├── assets/
│   ├── lib/
│   │   └── supabase.ts
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── .env.local
├── .gitignore
├── package.json
└── README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/varsha-467/leadflow-crm.git
```

### 2. Navigate to the project folder

```bash
cd leadflow-crm
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure Supabase

Create a Supabase project and create a table named `leads`.

Run the following SQL in the Supabase SQL Editor:

```sql
CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    business TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'New'
        CHECK (status IN ('New', 'Contacted', 'Converted')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.leads TO anon;

CREATE POLICY "Allow public to view leads"
ON public.leads
FOR SELECT TO anon
USING (true);

CREATE POLICY "Allow public to add leads"
ON public.leads
FOR INSERT TO anon
WITH CHECK (true);

CREATE POLICY "Allow public to update leads"
ON public.leads
FOR UPDATE TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public to delete leads"
ON public.leads
FOR DELETE TO anon
USING (true);
```

For this demo, the policies allow public access. Use authentication and stricter access controls before storing real customer data.

### 5. Add environment variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Replace the values with your Supabase project URL and publishable key.

Never expose your Supabase secret or service role key in frontend code.

### 6. Start the development server

```bash
npm run dev
```

Open the local URL provided by Vite.

## Database Operations

LeadFlow uses Supabase to perform the following operations:

- **Create:** Add new leads to the database.
- **Read:** Fetch and display saved leads.
- **Update:** Edit lead details and change lead status.
- **Delete:** Remove leads from the database.

## Learning Outcomes

Through this project, I gained practical experience in:

- Building a React application using TypeScript.
- Connecting a frontend application to Supabase.
- Performing CRUD operations.
- Working with PostgreSQL databases.
- Managing application state.
- Implementing search and filtering.
- Creating responsive user interfaces.
- Using Git and GitHub for version control.

## Author

**Varshini T G**

BCA Student | Data Science and AI

GitHub: [varsha-467](https://github.com/varsha-467)

---

Built as part of an internship project.
