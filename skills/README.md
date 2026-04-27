# NestJS Project Skills Documentation

This directory contains Agent Skills for the NestJS + Prisma project. Skills are structured guides that help developers understand and work with the project.

## Available Skills

### nestjs-prisma-setup

Complete guide for NestJS project setup, configuration, and development workflows.

**Use this skill when:**

- Setting up development environment
- Configuring database connections
- Creating or updating database models
- Implementing API endpoints
- Managing database migrations
- Deploying the application
- Troubleshooting common issues

**Key Resources:**

- `SKILL.md` - Main documentation and quick start guide
- `references/DATABASE_SCHEMA.md` - Complete database schema reference
- `references/ENV_VARIABLES.md` - Environment configuration guide
- `references/API_REFERENCE.md` - API endpoints documentation
- `references/DOCKER_SETUP.md` - Docker and containerization guide

## Quick Navigation

### For New Developers

Start with [nestjs-prisma-setup/SKILL.md](nestjs-prisma-setup/SKILL.md#quick-start)

### API Documentation

See [API Reference](nestjs-prisma-setup/references/API_REFERENCE.md)

### Database Schema

See [Database Schema](nestjs-prisma-setup/references/DATABASE_SCHEMA.md)

### Environment Setup

See [Environment Variables](nestjs-prisma-setup/references/ENV_VARIABLES.md)

### Docker Deployment

See [Docker Setup](nestjs-prisma-setup/references/DOCKER_SETUP.md)

## Project Structure

```
skills/
└── nestjs-prisma-setup/
    ├── SKILL.md                          # Main skill documentation
    ├── references/
    │   ├── DATABASE_SCHEMA.md            # Database models and relationships
    │   ├── ENV_VARIABLES.md              # Configuration reference
    │   ├── API_REFERENCE.md              # API endpoints
    │   └── DOCKER_SETUP.md               # Containerization guide
    └── assets/
        └── (templates and resources)
```

## Skills Specification

This project follows the [Agent Skills Specification](https://agentskills.io/).

Each skill includes:

- **Metadata**: Name, description, compatibility, version
- **Instructions**: Step-by-step guides and best practices
- **References**: Detailed technical documentation
- **Examples**: Real-world usage examples

## Validation

To validate skill structure:

```bash
skills-ref validate ./skills/nestjs-prisma-setup
```

## Contributing

When adding new skills:

1. Create a new directory: `skills/skill-name/`
2. Write `SKILL.md` with proper frontmatter
3. Add detailed references in `references/` subdirectory
4. Include practical examples
5. Keep main file under 500 lines (use references for details)
6. Follow naming conventions (lowercase, hyphens)

## Resources

- [Skills Specification](https://agentskills.io/)
- [Agent Skills Registry](https://agentskills.io/llms.txt)
- [NestJS Docs](https://docs.nestjs.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
