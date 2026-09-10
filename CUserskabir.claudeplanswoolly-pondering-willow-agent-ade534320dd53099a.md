# Plan: Map Challenge Data Flow

## Goals
1. Identify all backend routes and services interacting with `Problem`, `AIAnalysis`, `SolutionProposal`, and `Discussion` models.
2. Identify all frontend components displaying or managing challenge data and check for mock data.
3. Check `.env` for database configuration.
4. Identify SQLite-specific logic in backend services.
5. Provide a comprehensive map: Database -> Service -> Route -> Frontend Component.

## Steps
- [ ] Read `prisma\schema.prisma` to understand the data model.
- [ ] Search for all occurrences of `Problem`, `AIAnalysis`, `SolutionProposal`, and `Discussion` in the `server` directory to identify services and controllers.
- [ ] Search for API endpoints related to problems in the `server` routes.
- [ ] Search for these API endpoints in the `src` (frontend) directory to find components that call them.
- [ ] Audit identified frontend components for the use of mock data.
- [ ] Inspect `.env` or `.env.example` for the database provider.
- [ ] Search for SQLite-specific queries or configurations in the backend.
- [ ] Synthesize the findings into a data flow map.
