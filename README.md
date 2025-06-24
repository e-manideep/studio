# Gemini Finance Pilot 🚀

Welcome to Gemini Finance Pilot, your modern, interactive, and AI-powered assistant for mastering personal finances. This Next.js application provides a comprehensive suite of tools to track expenses, plan budgets, and gain intelligent insights to achieve your financial goals.

![Gemini Finance Pilot Dashboard](https://placehold.co/800x450.png?text=App+Screenshot)
*<p align="center">A preview of the main dashboard.</p>*

---

## ✨ Key Features

This application is packed with features to provide a seamless and intelligent financial management experience.

### Core Functionality
- **Dashboard Overview**: Get a bird's-eye view of your financial health with key metrics like total spending, budget status, and spending trends.
- **Expense Tracking**: Log your expenses effortlessly. Choose the method that works best for you:
    - **Manual Entry**: A standard form for adding expense details.
    - **CSV Bulk Upload**: Import multiple expenses at once from a CSV file.
- **Budget Management**: Set a monthly budget and track your spending against it in real-time.
- **Savings Goals**: Define and monitor your savings goals, from a new laptop to a vacation fund.

### 🤖 AI-Powered Features (with Google's Gemini)
- **AI Receipt Scanning**: Simply upload a photo of a receipt, and our AI will automatically parse the amount, description, and category, adding it to your expense list.
- **Conversational Financial Chat**: Have a natural conversation with your AI assistant. Ask questions about your spending, get advice, or explore your financial data.
- **Text-to-Speech Responses**: For a more interactive experience, have the AI assistant read its chat responses out loud.
- **Automated Expense Categorization**: When adding an expense, get an AI-powered category suggestion based on the description.
- **Personalized Financial Insights**: Generate tailored advice based on your spending habits, budget, and goals with the click of a button.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Generative AI**: [Google AI & Genkit](https://firebase.google.com/docs/genkit)
- **UI**: [React](https://react.dev/), [ShadCN UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

---

## 🚀 Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of your project and add your Google AI API key:
    ```
    GOOGLE_API_KEY=your_api_key_here
    ```

4.  **Run the development server:**
    The application and the Genkit AI flows run on different processes.

    - **Run the Next.js app:**
      ```bash
      npm run dev
      ```
      The app will be available at `http://localhost:9002`.

    - **Run the Genkit flows:**
      In a separate terminal, start the Genkit development server:
      ```bash
      npm run genkit:watch
      ```
      This will start the Genkit development UI and make the AI flows available to the application.
