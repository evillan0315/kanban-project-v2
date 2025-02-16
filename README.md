# Kanban Project Management

A modern Kanban-based project management application built with Next.js, TypeScript, and MUI. This app enables teams to organize and track tasks efficiently using a drag-and-drop interface powered by DND-kit.

## Features

- **Task Management**: Create, update, and delete tasks within different Kanban columns.
- **Drag-and-Drop Support**: Seamlessly move tasks between columns using DND-kit.
- **Project Organization**: Categorize tasks into different projects.
- **Database Persistence**: Store and retrieve tasks using PostgreSQL and Prisma.
- **User Authentication**: Secure authentication with NextAuth.js, supporting Google and GitHub login.
- **Responsive UI**: Optimized for both desktop and mobile using MUI components.
- **Dark Mode Support**: A sleek dark mode option for better usability.

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework for server-side rendering and static site generation.
- [TypeScript](https://www.typescriptlang.org/) - Strongly typed JavaScript for enhanced development.
- [MUI](https://mui.com/) - Modern UI components for a polished design.
- [Prisma](https://www.prisma.io/) - ORM for database interaction.
- [PostgreSQL](https://www.postgresql.org/) - Relational database for data storage.
- [DND-kit](https://dndkit.com/) - Drag-and-drop library for Kanban functionality.
- [NextAuth.js](https://next-auth.js.org/) - Authentication library supporting multiple providers.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/evillan0315/kanban-project.git
   cd kanban-project
   ```

2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

3. Set up the environment variables:
   Create a `.env` file and configure your database connection and authentication providers:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/kanban_db
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   ```

4. Apply database migrations:
   ```sh
   npx prisma migrate dev --name init
   ```

5. Start the development server:
   ```sh
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- Sign in using Google or GitHub.
- Create a new project and add tasks.
- Drag and drop tasks between columns to update their status.
- Click on a task to edit or delete it.

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

