# **App Name**: MediCheck AI

## Core Features:

- Login & Registration: Secure user authentication with email/password, JWT token storage in localStorage, and redirection to the dashboard. Connects to backend API at http://localhost:5000/api/auth.
- Patient Dashboard: Central hub with tabs for accessing key features: Chat Assistant, Verified Prescriptions, Stock & Alerts, Healthcare Locator, and Reports & Insights.
- AI Chat Assistant: AI-powered chatbot that helps users interpret symptoms and offers medication guidance using a chat interface.
- Verified Prescriptions: Displays uploaded prescriptions with their Prescription Safety Score (PSS), dosage issues, and drug conflicts, fetched from GET http://localhost:5000/api/prescriptions/:userId.
- Stock & Alerts: Manages medicine inventory, provides expiry alerts, and stock status notifications, allowing users to set custom alert thresholds.
- Healthcare Locator: Integrates Google Maps or OpenStreetMap API to show nearby medical shops, hospitals, and clinics, with a navigation button for directions.
- Prescription Verification Tool: Prescription Safety Score generation and issue identification by using AI tool. Text and image-based prescriptions are processed through POST http://localhost:5000/api/prescriptions.

## Style Guidelines:

- Primary color: Soft green (#74B72E), inspired by nature and growth to evoke trust and health. This color can be used in navigation bars, headers, and as accents.
- Background color: Very light green (#EBFDE4), to maintain a clean, clinical aesthetic.
- Accent color: Yellow-green (#A5D66C), for a bright signal of successfully checked medicines
- Font: 'Inter' sans-serif, modern look for headers and body text.
- Use flat, line-art style icons related to health and medicine.
- Responsive layout for both mobile and desktop, utilizing Tailwind CSS grid and flexbox.
- Subtle transitions and animations for loading states and user interactions to enhance UX.