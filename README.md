
# 🖥️ CYBER WEB FRONTEND

## Description
**CYBER WEB FRONTEND** is the user interface of the Cyber Web project.  
It provides the client-side experience for browsing, filtering, and purchasing products, fully integrated with the [Cyber Web Backend](https://github.com/lucashss88/cyber-web-backend.git).

---

## Main Features
- Product listing with pagination and sorting  
- Filters by price, brand, category, and tags  
- Responsive and modern design with Tailwind CSS  
- Integration with the Cyber Web API  
- Interactive product cards and shopping actions  

---

## Tech Stack
- **React (Vite)** – Fast frontend framework  
- **TypeScript** – Static typing and safety  
- **Tailwind CSS** – Utility-first CSS framework  
- **PostCSS & Autoprefixer** – CSS processing (pre-configured)  

---

## Getting Started

Follow the steps below to run the project locally:

### 1. Clone the repository
```bash
git clone https://github.com/danielacvmelo/cyber-web-frontend.git
cd cyber-web-frontend
````

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root of the project and add the backend API URL:

Example:
```env
VITE_API_URL=http://localhost:3000
```

> ⚠️ Make sure the [Cyber Web Backend](https://github.com/lucashss88/cyber-web-backend.git) is running locally or update the URL above with the deployed API.

### 4. Start the development server

```bash
npm run dev
```

The app will be available at:

```
http://localhost:5173
```

---

## Build and Preview

Generate an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Development Notes

* **Tailwind CSS Extension (VS Code):**
  Optional, but recommended. It provides class name autocompletion and syntax highlighting.
* **PostCSS:**
  Already included and configured in the project. No extra installation needed by the user.

---

## Frontend & Backend

* **Backend:** [Cyber Web Backend](https://github.com/edgarneto12/cyber-web-backend.git)
* **Frontend:** [Cyber Web Frontend](https://github.com/edgarneto12/cyber-web-frontend.git)

---

## Authors

* [@edgarneto12](https://github.com/edgarneto12)


