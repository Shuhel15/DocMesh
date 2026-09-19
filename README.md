# 🤖 DocMesh — Turn Your Data into an AI Chatbot

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Google GenAI](https://img.shields.io/badge/Google_Gemini-3.5_Flash_Lite-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)

**DocMesh** is a modern, full-stack **Retrieval-Augmented Generation (RAG) AI Chatbot Platform**. Upload your company's knowledge base (PDF, DOCX, TXT files, or manual text), train your AI assistant with Google Gemini, and embed a fully responsive chatbot widget on any website using just one line of code!

---

## ✨ Features

- 📄 **Multi-Format Document Ingestion**: Upload **PDF**, **DOC**, **DOCX**, or **TXT** files, or enter knowledge manually through the rich-text input form.
- 🧠 **Smart RAG (Retrieval-Augmented Generation)**: Automatically chunks document text, computes text embeddings, and retrieves relevant context using Google Gemini 3.5 Flash-Lite.
- 🎨 **Customizable Chatbot Themes**: Pick between sleek **Black** and clean **White** visual themes for embedded widgets.
- ⚡ **Instant Embed Script**: Copy-paste a lightweight `<script>` tag onto any website, Webflow, Shopify, or custom Web page to deploy your AI assistant instantly.
- 👁️ **Live Interactive Preview**: Test and chat with your AI chatbot inside your dashboard before deploying it to production.
- 🔐 **Secure Authentication**: Built-in NextAuth v5 supporting **Google OAuth** and **Email/Password Credentials** with seamless registration, direct login, and secure dashboard redirection.
- 📧 **Email OTP Verification**: New credential accounts must verify their email with a six-digit OTP before login. OTPs expire after 10 minutes and can be resent from the verification page.
- 🔔 **Toast Notifications**: `react-hot-toast` provides consistent success and error feedback for authentication, chatbot, document, theme, and OTP actions.
- 📱 **100% Fully Responsive**: Pixel-perfect responsive layout optimized across small mobiles (320px+), smartphones, tablets, and desktop laptops.
- 🌙 **Dark / Light Theme Toggle**: Built-in dark and light mode for the management dashboard.

---

## 🛠️ Technology Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) |
| **UI Library** | [React 19](https://react.dev/) & [Framer Motion 12](https://www.framer.com/motion/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) & [Lucide React](https://lucide.dev/) |
| **AI / LLM** | [@google/genai (Gemini 3.5 Flash-Lite)](https://ai.google.dev/) |
| **Document Parsers** | `unpdf`, `mammoth`, `word-extractor` |
| **Database & ORM** | [Prisma ORM 6](https://www.prisma.io/) + Supabase |
| **Authentication** | [NextAuth v5 (Beta)](https://authjs.dev/) + `@auth/prisma-adapter` |
| **Email & OTP** | `nodemailer` with Gmail SMTP + Redis (`ioredis`) |
| **Notifications** | [`react-hot-toast`](https://react-hot-toast.com/) |

---

## 📂 Directory & Project Structure

```text
DocMesh/
├── prisma/
│   ├── migrations/              # Prisma database migration scripts
│   └── schema.prisma            # Database schema (User, Account, Chatbot, Document, Chunk, etc.)
├── public/                      # Static assets & public files
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (auth)/              # Authentication routes (login, register)
│   │   ├── api/                 # Backend API Route Handlers
│   │   │   ├── auth/            # Auth, registration, OTP verification & resend endpoints
│   │   │   ├── chat/            # RAG chat execution route
│   │   │   ├── chatbots/        # Chatbot CRUD & theme management
│   │   │   └── documents/       # Document upload, text extraction & deletion
│   │   ├── dashboard/           # Workspace & Chatbot management dashboard
│   │   ├── embed/               # Embedded Chatbot iframe page & loader script
│   │   ├── globals.css          # Tailwind CSS v4 root stylesheet
│   │   ├── layout.tsx           # Root application layout shell
│   │   └── page.tsx             # Landing Page
│   ├── components/              # Reusable React UI Components
│   │   ├── chatbot/             # Chat widget, live preview & embed code components
│   │   ├── dashboard/           # Theme selector & dashboard elements
│   │   ├── documents/           # Upload form, manual text form & edit/delete modals
│   │   ├── landing/             # Hero, Features, How It Works, CTA, Chatbot Preview
│   │   ├── theme/               # Next-Themes provider
│   │   └── ui/                  # Layout shell, Navbar, Footer, Button, Loader
│   ├── hooks/                   # Custom React Hooks (e.g. useChat)
│   └── lib/                     # Server utilities & helper libraries
│       ├── auth.ts              # NextAuth configuration
│       ├── prisma.ts            # Prisma Client singleton
│       ├── documents/           # Document text extraction pipeline
│       └── rag/                 # Document chunking, retrieval & Gemini AI generation
├── .env                         # Environment variables configuration
├── next.config.ts               # Next.js configuration
├── package.json                 # Project dependencies & npm scripts
└── tsconfig.json                # TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
- **Node.js**: `v18.17.0` or higher
- **npm** or **yarn** / **pnpm**
- A **Google Gemini API Key** (from [Google AI Studio](https://aistudio.google.com/))

---

### Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/shuhel/DocMesh.git
   cd DocMesh
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**  
   Create a `.env` file in the root directory and add the following keys:

   ```env
   # App URL and NextAuth configuration
   NEXTAUTH_URL="http://localhost:3000"
   AUTH_SECRET="your-super-secret-key-here"

   # PostgreSQL database connections
   DATABASE_URL="postgresql://user:password@host:5432/docmesh?schema=public"
   DIRECT_URL="postgresql://user:password@host:5432/docmesh?schema=public"

   # Google Gemini API keys
   GEMINI_API_KEY="your-gemini-api-key"
   GOOGLE_GENAI_API_KEY="your-gemini-api-key"

   # Google OAuth credentials (required if Google Login is enabled)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # Gmail SMTP credentials for registration and OTP emails
   SMTP_USER="your-gmail-address@gmail.com"
   SMTP_PASSWORD="your-gmail-app-password"

   # Redis connection used to store OTPs temporarily
   REDIS_URL="redis://default:password@host:6379"
   ```

   `DIRECT_URL` is used by Prisma migrations, while `DATABASE_URL` is used by the application. For Gmail, use a Google **App Password** rather than your regular account password. Keep `.env` out of source control and never expose these values in client-side code.

4. **Initialize Database & Run Migrations**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📧 Email Verification Flow

1. A user registers with a name, email, and password.
2. DocMesh creates the account and sends a six-digit OTP through Gmail SMTP.
3. The OTP is stored in Redis with a 10-minute expiration.
4. The user verifies the OTP at `/verify-email?email=...`.
5. After successful verification, the user can log in with credentials.
6. If the email is not received, the verification page can request a new OTP. Resending is rate-limited by a 60-second client-side cooldown.

Relevant API routes:

- `POST /api/auth/register`
- `POST /api/auth/verify-email`
- `POST /api/auth/resend-otp`

---

## ⚙️ How It Works (RAG Pipeline)

```mermaid
graph TD
    A[User Uploads PDF / DOCX / Text] --> B[Text Extractor Module]
    B --> C[Document Chunking Strategy]
    C --> D[Generate Embeddings & Save to DB]
    E[End-User Asks Question on Chatbot] --> F[Retrieve Top-K Context Chunks]
    F --> G[Google Gemini 3.5 Flash-Lite]
    G --> H[Return Grounded Answer to User]
```

1. **Upload Knowledge**: When a document (PDF, DOCX, TXT) is uploaded, DocMesh extracts plain text using server-side extraction utilities.
2. **Chunking**: The document content is broken down into structured text chunks.
3. **Retrieval**: When a user poses a question, DocMesh performs semantic vector matching across the database to retrieve relevant context chunks.
4. **Generation**: The context chunks along with the user prompt are sent to **Google Gemini 3.5 Flash-Lite** to compute a precise, grounded answer.

---

## 🌐 Embedding Chatbot Widget

To embed a chatbot on any external web page, simply paste the snippet provided in your chatbot details page:

```html
<script
  src="https://your-domain.com/embed/chatbot.js"
  data-bot-id="YOUR_CHATBOT_ID"
></script>
```

---

## 📜 Available Scripts

- `npm run dev` — Starts the development server with Next.js Turbopack.
- `npm run build` — Builds the optimized production application.
- `npm run start` — Runs the compiled production build.
- `npm run lint` — Runs ESLint code quality checks.
- `npx tsc --noEmit` — Executes TypeScript type checking.

---

<p align="center">Made with ❤️ by <b>Shuhel Ahmed</b></p>
