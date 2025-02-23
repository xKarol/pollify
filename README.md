# Pollify 📊

![Pollify](./apps/web/public/hero-image.png)
[![Demo](https://img.shields.io/website?url=https://poll-web-three.vercel.app/&style=for-the-badge)](https://poll-web-three.vercel.app/)
![CIMain](https://github.com/xKarol/pollify/actions/workflows/main.yml/badge.svg?event=push&branch=main)
![CITest](https://github.com/xKarol/pollify/actions/workflows/test.yml/badge.svg?event=push&branch=main)

This project is designed to create a simple and interactive poll website where users can create, participate in, and view poll questions and results. It combines the power of Next.js for the frontend and Express.js for the backend to deliver a seamless and responsive user experience.

## 🔥 Features

- [x] Responsive design
- [x] User Authentication using OAuth
- [x] Stripe Integration for Payments
- [x] Google reCAPTCHA Integration
- [x] Share Poll via QR Code
- [x] Realtime Poll Results
- [x] Poll Analytics
- [x] Poll Management Dashboard
- [x] Infinite Scroll Loading
- [x] Advanced Poll Creation Options

## 💻 Built with

![NextJS](https://img.shields.io/badge/next%20js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![ExpressJS](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)
![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Turborepo](https://img.shields.io/badge/Turborepo-%230F0813.svg?style=for-the-badge&logo=Turborepo&logoColor=white)
![Tailwindcss](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![ShadcnUI](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-000000?style=for-the-badge&logo=zod&logoColor=3068B7)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?&style=for-the-badge&logo=Socket.io&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white)
![ReactQuery](https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=ReactQuery&logoColor=white)
![LucideIcons](https://img.shields.io/badge/Lucide_Icons-f67373?style=for-the-badge&logo=lucide&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Prettier](https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E)
![Eslint](https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white)

## 🚀 Demo

[![Demo](https://img.shields.io/website?url=https://poll-web-three.vercel.app/&style=for-the-badge)](https://poll-web-three.vercel.app/)
[![Demo](https://img.shields.io/website?url=https://poll-backend-86wf.onrender.com/health-check/&style=for-the-badge&label=Backend)](https://poll-backend-86wf.onrender.com)

## 🔍 Prerequisites

- NodeJS
- Yarn
- Docker

## 📁 Folder structure

- /apps
  - [/backend](./apps/backend)
  - [/web](./apps/web)
- /packages
  - [/config](./packages/config)
  - [/eslint-config-custom](./packages/eslint-config-custom)
  - [/lib](./packages/lib)
  - [/prettier-config](./packages/prettier-config)
  - [/prisma](./packages/prisma)
  - [/tsconfig](./packages/tsconfig)
  - [/types](./packages/types)
  - [/ui](./packages/ui)
  - [/validation](./packages/validation)

## 🛠️ Installation Steps

1. Clone the repository

   ```bash
   git clone https://github.com/xkarol/pollify.git
   ```

2. Change directory

   ```bash
   cd pollify
   ```

3. Install dependencies

   ```bash
   bun install
   ```

4. Create `.env` file based on `.env.example`

5. Run docker compose

   ```bash
   docker compose up -d
   ```

6. Sync prisma schema

   ```bash
   bun turbo run db:push
   ```

7. Run the app

   ```bash
   bun dev
   ```
