export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'done' | 'in-progress' | 'pending' | 'blocked';
  dependencies: number[];
  priority: 'high' | 'medium' | 'low';
  details: string;
  testStrategy: string;
  subtasks?: Subtask[];
}

export interface Subtask {
  id: number;
  title: string;
  description: string;
  dependencies: number[];
  details: string;
  status: 'done' | 'in-progress' | 'pending' | 'blocked';
  parentTaskId: number;
}

export const mockTasks: Task[] = [
  {
    id: 1,
    title: "Set up project infrastructure",
    description: "Initialize the Laravel project with Inertia.js and React, configure database connections, and set up the development environment using Herd.",
    status: "done",
    dependencies: [],
    priority: "high",
    details: "Create a new Laravel project using the official starter kit with Inertia.js and React. Configure PostgreSQL database connection in the .env file. Set up Herd for local development. Install required dependencies: Tailwind CSS, Shadcn UI, and other necessary packages.",
    testStrategy: "Verify that the application boots correctly. Check that database connections are working. Ensure that React components render properly through Inertia.js.",
    subtasks: [
      {
        id: 1,
        title: "Create base ApplicationException class",
        description: "Implement a base ApplicationException class that extends Laravel's Exception class to serve as the foundation for all custom exceptions.",
        dependencies: [],
        details: "Create a new directory App\\Exceptions\\Custom to house all custom exceptions. Implement proper PHPDoc documentation.",
        status: "done",
        parentTaskId: 1
      }
    ]
  },
  {
    id: 2,
    title: "Implement custom exception handling system",
    description: "Create a robust exception handling system with custom exception classes and centralized error handling.",
    status: "in-progress",
    dependencies: [1],
    priority: "medium",
    details: "Create a base ApplicationException class extending Laravel's Exception. Implement specific exception classes and configure the Laravel exception handler.",
    testStrategy: "Write unit tests for each custom exception class. Create feature tests that trigger exceptions and verify the correct response format."
  },
  {
    id: 3,
    title: "Database schema design",
    description: "Design and implement the database schema for the application.",
    status: "pending",
    dependencies: [1],
    priority: "low",
    details: "Create migrations for users, courses, subscriptions, and payment tables. Ensure proper relationships and constraints.",
    testStrategy: "Test migrations can run successfully. Verify foreign key constraints work correctly."
  },
  {
    id: 4,
    title: "User authentication system",
    description: "Implement secure user authentication with JWT tokens and proper session management.",
    status: "blocked",
    dependencies: [2, 3],
    priority: "high",
    details: "Set up Laravel Sanctum for API authentication. Create login, register, and password reset functionality. Implement proper middleware for route protection.",
    testStrategy: "Test all authentication flows. Verify token expiration and refresh mechanisms. Check security headers and CSRF protection."
  },
  {
    id: 5,
    title: "API endpoint development",
    description: "Create RESTful API endpoints for all core functionality with proper validation and error handling.",
    status: "pending",
    dependencies: [2, 3],
    priority: "medium",
    details: "Design API routes for user management, course operations, and subscription handling. Implement request validation using Laravel Form Requests.",
    testStrategy: "Write comprehensive API tests covering all endpoints. Test validation rules and error responses. Verify API documentation is accurate.",
    subtasks: [
      {
        id: 2,
        title: "Create user management endpoints",
        description: "Implement CRUD operations for user management with proper authorization.",
        dependencies: [],
        details: "Create endpoints for user profile updates, user listing, and user deletion. Ensure proper authorization checks.",
        status: "pending",
        parentTaskId: 5
      },
      {
        id: 3,
        title: "Implement course management API",
        description: "Build API endpoints for course creation, updates, and enrollment management.",
        dependencies: [2],
        details: "Design course structure, enrollment logic, and progress tracking APIs.",
        status: "pending",
        parentTaskId: 5
      }
    ]
  }
];