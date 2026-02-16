# Hospitality Booking Web App

A full-stack hospitality room booking web application built using **React**, **TypeScript**, **Tailwind CSS**, and **Supabase** for authentication and backend services. The app allows users to browse, book rooms, and manage their bookings, while admins can manage room listings and oversee reservations.

---

## 🚀 Features

### User Features

* Browse room listings with images and descriptions
* View detailed room pages
* User registration and login (via Supabase Auth)
* Book available rooms with date selection
* View personal booking history

### Admin Features

* Secure admin login
* Admin dashboard for viewing and managing rooms
* Booking history and room availability management

---

## 🛠 Tech Stack

* **Frontend:** React + TypeScript
* **Styling:** Tailwind CSS
* **Build Tools:** Vite
* **Authentication & Backend:** Supabase
* **Testing:** Vitest
* **State Management:** React Context API
* **HTTP Client:** Axios

---

## 📁 Project Structure

```
src/
├── assets/            # Images and static files
├── components/        # UI components and layout
├── contexts/          # Global context (e.g., AuthContext)
├── hooks/             # Custom React hooks
├── pages/             # Main route-based screens
├── supabase/          # Supabase client and types
├── data/              # Static/mock data (fallback)
├── lib/               # Utility functions
├── test/              # Vitest setup and tests
└── App.tsx            # Main app routing
```

---

## 🧪 Testing

* Uses **Vitest** for unit testing
* `test/` directory includes example tests and setup files

---

## ⚙️ Environment Setup

1. Clone the repo

```bash
git clone https://github.com/vedangrajoriya/hospitality-app
cd hospitality-app
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run locally

```bash
npm run dev
```

---

## 📦 Build for Production

```bash
npm run build
```

---

## 🧭 Roadmap

* [x] Core booking functionality
* [x] Supabase auth integration
* [x] Admin dashboard
* [ ] CI/CD pipeline integration
* [ ] Kubernetes deployment (Minikube → AWS EKS)


