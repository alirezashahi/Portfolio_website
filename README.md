# Alireza Shahi - Personal Portfolio Website

This is a personal portfolio website for Alireza Shahi, showcasing his skills, education, projects, and experience.

## Features

- Responsive design that works on desktop, tablet, and mobile
- Clean and modern UI using Tailwind CSS and Shadcn/ui components
- Sections for Home, About, Projects, Skills, and Contact
- Contact form (ready for Convex backend integration)
- Accessible design with keyboard navigation support

## Tech Stack

- **Frontend:**
  - React
  - TypeScript
  - Tailwind CSS
  - Shadcn/ui (built on Radix UI and Tailwind CSS)
  
- **Backend / BaaS:**
  - Convex (for future data storage and form submissions)
  
- **Development Tools:**
  - Vite
  - Git & GitHub
  
- **Deployment:**
  - Vercel

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory
   ```
   cd alireza-portfolio
   ```

3. Install dependencies
   ```
   npm install
   ```

4. Create a `.env` file based on `.env.example` and add your Convex deployment URL if available

5. Run the development server
   ```
   npm run dev
   ```
   
6. Open your browser and navigate to `http://localhost:5173`

## Building for Production

```
npm run build
```

This will create a `dist` folder with the production build of the website.

## Deploying to Vercel

This project is configured for easy deployment to Vercel. Simply connect your GitHub repository to Vercel and it will automatically deploy the website.

## Roadmap

- Implement full Convex integration for the contact form
- Add a blog section
- Add more visual elements (project screenshots, charts)
- Add dark mode support

## License

This project is licensed under the MIT License.
