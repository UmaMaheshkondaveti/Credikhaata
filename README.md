
# CrediKhaata – Loan Ledger UI

## Project Description

CrediKhaata is a simple, responsive web application designed for small shopkeepers to easily manage credit sales (loans) given to their trusted customers. It allows tracking of customers, loans, repayments, and outstanding dues through a clean dashboard interface.

This frontend application is built using React and currently uses the browser's `localStorage` for data persistence, making it suitable for demonstration and single-user scenarios.

## Features

*   **User Authentication:** Basic Email/Password signup and login. Session state is persisted using `localStorage`.
*   **Customer Management:** Add, edit, and view customer details (Name, Phone, Address).
*   **Loan Management:**
    *   Record new credit sales (loans) for customers, including item description, amount, issue date, and repayment frequency (bi-weekly/monthly).
    *   View a list of all loans associated with a customer.
*   **Repayment Tracking:** Record full or partial repayments against specific loans.
*   **Dashboard View:**
    *   Displays a searchable and sortable list of all customers.
    *   Shows each customer's name, outstanding balance, next due date (calculated), and overall status (Up-to-date/Overdue).
*   **Customer Detail View:**
    *   Provides a detailed view of a single customer, including their contact information and a list of all their loans.
    *   Each loan card shows the item, amount, issue/due dates, remaining balance, status, and a history of repayments.
*   **Overdue Highlighting:** Automatically highlights overdue loans and customers with overdue balances.
*   **PDF Statement Export:** Generate and download a PDF statement for a specific customer detailing their loans and repayments.
*   **Dark Mode:** Toggle between light and dark themes.
*   **Responsive Design:** Adapts to different screen sizes (desktop and mobile).
*   **Notifications:** Uses toast messages for success and error feedback on actions.

## Tech Stack

*   **Frontend:** React 18 (using Hooks)
*   **Build Tool:** Vite
*   **Routing:** React Router v6
*   **Styling:** Tailwind CSS v3
*   **UI Components:** shadcn/ui (built on Radix UI primitives)
*   **State Management:** React Context API (`AuthContext`, `DataContext`, `ThemeContext`)
*   **Forms:** React Hook Form
*   **Date Handling:** date-fns
*   **Animations:** Framer Motion
*   **PDF Generation:** jsPDF, jspdf-autotable
*   **Icons:** Lucide React
*   **Data Persistence:** `localStorage` (for demo purposes)

## Running Locally

Follow these steps to get the project running on your local machine:

1.  **Clone the Repository (or Export Project):**
    *   If you have the code as a repository:
        ```bash
        git clone <repository_url>
        cd credikhaata-loan-ledger
        ```
    *   If you exported the project: Unzip the downloaded file and navigate into the project directory in your terminal.

2.  **Install Dependencies:**
    Make sure you have Node.js (version 20 or later recommended) and npm installed. Then run:
    ```bash
    npm install
    ```
    This command installs all the necessary packages listed in `package.json`.

3.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    This command starts the Vite development server. It will typically open the application automatically in your default web browser at `http://localhost:5173` (or the next available port). The server supports Hot Module Replacement (HMR) for a fast development experience.

4.  **Build for Production (Optional):**
    To create an optimized production build:
    ```bash
    npm run build
    ```
    The output files will be generated in the `dist` folder. You can preview the production build locally using:
    ```bash
    npm run preview
    ```

## Deployment

This version of the application uses `localStorage` for all data storage (user accounts, customers, loans). This means:

*   Data is stored **only in the user's browser**. Clearing browser data will erase all information.
*   The application is **not suitable for multiple users** sharing the same device or for accessing data across different devices/browsers.
*   There is **no backend server** involved for data persistence or complex business logic.

For a production-ready application, the `localStorage` implementation should be replaced with a proper backend service and database (like the Node.js backend described in the assignment brief or a BaaS like Supabase/Firebase).

If deployed, provide the live URL here: **[Deployed Application Link - Add URL if applicable]**

## Design Decisions

*   **UI Library:** `shadcn/ui` was chosen for its accessible, unstyled components that are easy to customize with Tailwind CSS, allowing for rapid UI development while maintaining control over the final look and feel.
*   **Styling:** Tailwind CSS provides utility classes for efficient and consistent styling, enabling responsive design with minimal custom CSS.
*   **Data Storage:** `localStorage` was used as required for the frontend-only assignment demonstration. It simplifies setup but has limitations (see Deployment section).
*   **State Management:** React Context API is used for managing global state like authentication, theme, and application data (customers/loans), suitable for the application's current complexity.
*   **PDF Generation:** `jsPDF` and `jspdf-autotable` are used for client-side PDF generation, providing a convenient way to export customer statements without server interaction.
*   **Forms:** `react-hook-form` is used for efficient form handling and validation.
  
