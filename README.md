# 💼 Midstate Global Services - Job Recruitment Platform

## 🌟 Introduction
Midstate Global Services is a modern job recruitment and hiring platform built to connect employers with talented candidates. The platform provides role-based dashboards, comprehensive job listings, and an integrated application system for streamlined recruitment management.

## 🚀 Features

### 📋 **Core Functionality**
- **Job Listings:** Browse multiple job categories across different locations
- **Job Application System:** Submit applications with resume uploads and validation
- **Role-Based Dashboards:** Separate Admin and Staff panels for recruitment management
- **User Authentication & Authorization:** Secure login with role-based access control
- **Application Status Tracking:** PENDING, APPROVED, and REJECTED status flows
- **Email Integration:** Automated email notifications for job applications

### 🏢 **Job Categories** (6 Types)
- Non-IT Jobs
- BPO/KPO/LPO
- IT Jobs
- BFSI Jobs
- Finance
- Retail Jobs

### 📍 **Supported Locations**
Gurugram, Noida, Pune, Bangalore, Hyderabad, Delhi, Kolkata

### 💰 **Pricing Tiers**
- **Free:** ₹0/month - 100 tags, basic tracking
- **Pro:** ₹9/month - 500 tags, 20K clicks/month, priority support
- **Business:** ₹49/month - All Pro features + enterprise support

## 📊 API Endpoints

### Job Applications
- **POST /api/apply** - Submit job application
  - **Accepts:** fullName, phoneNumber, email, preferredLocation, jobTitle, resume (file)
  - **Validation:** Email format, allowed locations, file type (PDF/DOC/DOCX), max 5MB
  - **Response:** Sends email to APPLICATION_RECIPIENT_EMAIL

## 📄 Pages & Routes

### Marketing Pages
| Route | Purpose |
|-------|---------|
| `/` | Landing page with hero section |
| `/jobs` | Job listings & browsing |
| `/apply` | Job application form |
| `/about-us` | Company information |
| `/features` | Platform features showcase |
| `/pricing` | Pricing plans |
| `/contact-us` | Contact form |
| `/faqs` | Frequently asked questions |
| `/changelog` | Version history |
| `/enterprise` | Enterprise solutions |
| `/resources` | Resource hub |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

### Dashboard Pages
| Route | Role | Purpose |
|-------|------|---------|
| `/admin/dashboard` | ADMIN | Admin panel for platform oversight |
| `/staff/dashboard` | STAFF | Staff recruitment operations panel |
| `/(main)/dashboard` | USER | General user dashboard |

## 🗄️ Database Schema

### User Model
| Field | Type | Details |
|-------|------|---------|
| id | String (cuid) | Primary key |
| email | String | Unique identifier |
| name | String | Optional user name |
| password | String | For authentication |
| role | Enum | ADMIN or STAFF |
| status | Enum | PENDING, APPROVED, or REJECTED |
| image | String | Optional avatar URL |
| createdAt | DateTime | Record creation timestamp |
| updatedAt | DateTime | Last update timestamp |

## 🎨 UI Components

The project includes 60+ pre-built shadcn/ui components:
- **Forms:** Input, Checkbox, RadioGroup, Form, InputOTP, Textarea, Label
- **Layout:** Card, Dialog, Drawer, Modal, Sheet, Tabs
- **Navigation:** Breadcrumb, Pagination, NavigationMenu, DropdownMenu
- **Display:** Avatar, Badge, Table, Carousel, Marquee
- **Animations:** AnimatedBeam, AnimatedText, AnimatedBackground, Particles, Lamp
- **Special Effects:** MagicCard, MagicBadge, BorderBeam, BentoGrid, RetroGrid 

## 💻 Tech Stack

* **Frontend:** Next.js 14, React 18, TypeScript
* **Styling:** Tailwind CSS, Shadcn UI, Magic UI, Aceternity UI
* **Backend:** Next.js API Routes
* **Database:** PostgreSQL with Prisma ORM
* **Authentication:** User role-based access control (ADMIN, STAFF roles)
* **Form Management:** React Hook Form with Zod validation
* **Email Service:** Nodemailer
* **Security:** bcrypt (password hashing), JWT tokens
* **Animations:** Framer Motion
* **Deployment:** Vercel ready

## 🛠️ Installation
To run Midstate Global Services locally, follow these steps:

1. **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/midstate.git
    cd midstate
    ```

2. **Install dependencies:**
    ```bash
    pnpm install
    ```

3. **Set up environment variables** in a `.env.local` file:
    ```
    # Database
    DATABASE_URL=postgresql://user:password@localhost:5432/midstate
    
    # Application
    NEXT_PUBLIC_APP_DOMAIN=http://localhost:3000
    NEXT_PUBLIC_APP_NAME=Midstate Global Services
    
    # Email Configuration (for job applications)
    APPLICATION_RECIPIENT_EMAIL=aditi@midstateglobalservices.com
    SMTP_HOST=your_smtp_host
    SMTP_PORT=587
    SMTP_USER=your_email
    SMTP_PASSWORD=your_password
    ```

4. **Set up the database:**
    ```bash
    pnpm prisma migrate dev
    ```

5. **Run the development server:**
    ```bash
    pnpm dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Available Scripts

```bash
# Development
pnpm dev              # Start development server

# Production
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm prisma migrate dev   # Run database migrations
pnpm prisma studio       # Open Prisma Studio

# Linting
pnpm lint             # Run ESLint
```

## 📝 Notes & TODOs

- ⚠️ **Clerk Authentication:** Currently removed - needs to be reimplemented with custom auth
- ⚠️ **Auth Forms:** SignIn and SignUp forms are present but non-functional
- ⚠️ **Stripe Integration:** Integration file exists but needs configuration
- ⚠️ **Legacy Content:** Some template copy references link features (to be updated)

## 📜 License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 💬 Contact
For questions or feedback, please reach out to: **aditi@midstateglobalservices.com**

---

Built with ❤️ for Midstate Global Services
