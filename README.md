# Pollify

![Pollify](./apps/web/public/logo-banner.png)
[![Demo](https://img.shields.io/website?url=https%3A%2F%2Fpollify-com.vercel.app&style=for-the-badge)](https://pollify-com.vercel.app/)
![CIMain](https://github.com/xKarol/pollify/actions/workflows/main.yml/badge.svg?event=push&branch=main)
![CITest](https://github.com/xKarol/pollify/actions/workflows/test.yml/badge.svg?event=push&branch=main)

Pollify is a web app designed to make creating and sharing polls easy, interactive, and fun. Users can quickly create polls, participate in them, and view live results as votes come in. Built with **Next.js** for the frontend and **Hono** for the backend, Pollify is fast, modern, and user-friendly.

## ✨ Features

- 🔥 **Live Poll Results** – Watch votes update in real time
- 🔐 **Social Login** – Sign in with Google, Facebook, or Apple
- 🛡️ **Spam Protection** – Secure polls with reCAPTCHA v3 and IP-based protection
- 💎 **Advanced Analytics** – Track votes by country, device and trends
- 🌓 **Dark & Light Mode** – Switch between light and dark themes
- 💳 **Pricing Plans** – Access advanced features with Stripe integration
- 📊 **Vercel Analytics** – Track poll performance and user engagement
- 📲 **Easy Sharing** – Share polls with a link, social media, or QR code
- ♾️ **Infinite Scroll** – Browse large poll sets seamlessly
- 📥 **Data Export** – Download results as CSV or JSON

## 💻 Built with

![NextJS](https://img.shields.io/badge/next%20js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![HonoJS](https://img.shields.io/badge/hono-E36002?style=for-the-badge&logo=hono&logoColor=white)
![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Turborepo](https://img.shields.io/badge/Turborepo-%230F0813.svg?style=for-the-badge&logo=Turborepo&logoColor=white)
![Tailwindcss](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![ShadcnUI](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-000000?style=for-the-badge&logo=zod&logoColor=3068B7)
![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white)
![ReactQuery](https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=ReactQuery&logoColor=white)
![LucideIcons](https://img.shields.io/badge/Lucide_Icons-f67373?style=for-the-badge&logo=lucide&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Prettier](https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E)
![Eslint](https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white)

## 🌍 Demo

[![Demo](https://img.shields.io/website?url=https%3A%2F%2Fpollify-com.vercel.app&style=for-the-badge)](https://pollify-com.vercel.app/)
[![Demo](https://img.shields.io/website?url=https%3A%2F%2Fpollify-com.vercel.app%2Fapi%2Fhealth-check&style=for-the-badge&label=API)](https://pollify-com.vercel.app/api/health-check/)

## 🔍 Prerequisites

- NodeJS
- Bun
- Docker

## 📁 Project structure

The project is organized as a monorepo using Turborepo, with the following structure:

- `/apps`
  - [/api](./apps/api)
  - [/web](./apps/web)
- `/packages`
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
   git clone https://github.com/xkarol/pollify.git && cd pollify
   ```

2. Install dependencies

   ```bash
   bun install
   ```

3. Create `.env` file based on `.env.example`

4. Run docker compose

   ```bash
   docker compose up -d
   ```

5. Sync prisma schema

   ```bash
   bun turbo run db:push
   ```

6. Run the app

   ```bash
   bun dev
   ```
