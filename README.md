# Zenvoice: Effortless Invoicing & Estimates

A visually stunning and blazing-fast web application for modern invoice and estimate management, built for freelancers and small businesses.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/amarbir-byte/invoice-maker)

Zenvoice is a sophisticated, minimalist web application designed for freelancers and small businesses to manage invoices and estimates with ease. Built on Cloudflare's edge network, it offers a lightning-fast, secure, and reliable experience. The application provides a comprehensive suite of features including client management, invoice creation and tracking, estimate conversion, and insightful dashboard analytics. Its design prioritizes a clean, intuitive user interface and a stunning visual aesthetic, making financial management a delightful and stress-free process. The architecture is built for scalability, supporting multiple users and businesses within a multi-tenant system.

## ✨ Key Features

*   **Dashboard:** At-a-glance overview of key financial metrics (total outstanding, paid, overdue).
*   **Invoice Management:** Create, edit, send, and track invoices with various statuses (Draft, Sent, Paid, Overdue).
*   **Estimate Management:** Create and manage estimates, with one-click conversion to invoices.
*   **Client Management:** A simple CRM to store and manage client information and invoice history.
*   **Customization:** Manage business profiles, logos, and invoice templates.
*   **Modern UI/UX:** A beautiful, minimalist interface built with the latest web technologies for a seamless user experience.
*   **Edge-Powered:** Deployed on Cloudflare's global network for unparalleled speed and reliability.

## 🛠️ Technology Stack

*   **Frontend:** React, Vite, TypeScript, Tailwind CSS
*   **UI Components:** shadcn/ui, Radix UI, Lucide Icons
*   **State Management:** Zustand
*   **Forms:** React Hook Form & Zod for validation
*   **Animations:** Framer Motion
*   **Backend:** Hono on Cloudflare Workers
*   **Storage:** Cloudflare Durable Objects
*   **Package Manager:** Bun

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later recommended)
*   [Bun](https://bun.sh/) package manager
*   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) for interacting with the Cloudflare platform.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/zenvoice-invoice-management.git
    cd zenvoice-invoice-management
    ```

2.  **Install dependencies:**
    This project uses Bun for package management.
    ```sh
    bun install
    ```

## 💻 Development

To start the local development server, which includes both the Vite frontend and the Hono backend worker, run:

```sh
bun run dev
```

This command will:
*   Start the Vite development server for the React frontend, typically on `http://localhost:3000`.
*   Start the Wrangler development server for the Hono backend, typically on another port.
*   Vite is configured to proxy all API requests (`/api/*`) to the local Wrangler server, enabling seamless full-stack development.

## 📦 Available Scripts

*   `bun run dev`: Starts the local development server.
*   `bun run build`: Builds the frontend application for production.
*   `bun run deploy`: Deploys the application to Cloudflare Workers.
*   `bun run lint`: Lints the codebase to check for errors.

## ☁️ Deployment

This project is designed for deployment on the Cloudflare network.

1.  **Login to Wrangler:**
    Ensure you are logged into your Cloudflare account via the Wrangler CLI:
    ```sh
    wrangler login
    ```

2.  **Deploy the application:**
    Run the deploy script. This will build the application and deploy it to your Cloudflare account based on the `wrangler.jsonc` configuration.
    ```sh
    bun run deploy
    ```

Alternatively, you can deploy your own version of this project with a single click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/amarbir-byte/invoice-maker)

## 🏛️ Architecture

The application follows a modern, edge-native architecture:

*   **Frontend:** A React single-page application handles the user interface and client-side logic.
*   **Backend:** A lightweight Hono API runs on Cloudflare Workers, handling business logic and data access.
*   **Database:** A single Cloudflare Durable Object instance (`GlobalDurableObject`) acts as a multi-tenant storage solution, using an `IndexedEntity` pattern to manage different data models like users, clients, and invoices.
*   **Type Safety:** Shared types between the frontend and backend ensure end-to-end type safety.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.