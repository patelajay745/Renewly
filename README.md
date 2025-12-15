# 📱 Renewly

**Renewly** is a comprehensive subscription management application that helps users track, manage, and stay on top of their recurring subscriptions. Built as a full-stack monorepo using modern technologies, Renewly provides a seamless experience across mobile devices with real-time notifications and insightful analytics.

## 🌟 Features

- **📊 Subscription Tracking**: Monitor all your subscriptions in one place
- **💰 Cost Analytics**: Get insights into your monthly and yearly subscription expenses
- **🔔 Smart Notifications**: Receive push notifications before subscription renewals
- **📱 Native Mobile Experience**: Built with React Native and Expo for iOS and Android
- **🔐 Secure Authentication**: Powered by Clerk for seamless user authentication
- **⚡ Real-time Updates**: Instant synchronization across devices
- **🎨 Beautiful UI**: Modern, intuitive interface with smooth animations
- **📈 Dashboard**: Visual representation of subscription data and upcoming payments

## 🏗️ Project Structure

This project is organized as a **Turborepo monorepo** with the following structure:

### Apps

- **`apps/backend`**: NestJS REST API server
  - TypeScript-based backend with Swagger documentation
  - PostgreSQL database with TypeORM
  - Redis for caching and queue management
  - BullMQ for background job processing
  - Clerk integration for authentication
  - Push notification service with Expo

- **`apps/mobile`**: React Native mobile application
  - Built with Expo and Expo Router
  - Native iOS and Android support
  - TanStack Query for data fetching and caching
  - React Hook Form with Zod validation
  - Clerk authentication integration
  - Push notifications with Expo Notifications



## 🛠️ Tech Stack

### Backend

- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [TypeORM](https://typeorm.io/)
- **Cache & Queue**: [Redis](https://redis.io/) with [BullMQ](https://bullmq.io/)
- **Authentication**: [Clerk](https://clerk.com/)
- **API Documentation**: [Swagger](https://swagger.io/) with [Scalar](https://scalar.com/)
- **Notifications**: [Expo Push Notifications](https://docs.expo.dev/push-notifications/overview/)

### Mobile

- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/)
- **State Management**: [TanStack Query](https://tanstack.com/query)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Authentication**: [Clerk Expo](https://clerk.com/docs/quickstarts/expo)
- **UI**: Custom components with [Lucide React Native](https://lucide.dev/)

### Monorepo & Development

- **Build System**: [Turborepo](https://turborepo.com/)
- **Package Manager**: [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Code Quality**: [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: >= 18.x
- **Yarn**: 1.22.22 or later
- **Docker**: For running PostgreSQL and Redis (optional but recommended)
- **iOS Simulator** (macOS): For iOS development
- **Android Studio**: For Android development
- **Expo CLI**: For mobile development
- **Clerk Account**: For authentication setup

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/patelajay745/Renewly.git
cd Renewly
```

### 2. Install Dependencies

```bash
yarn install
```

### 3. Environment Setup

#### Backend Environment Variables

Create a `.env` file in `apps/backend/`:

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_NAME=

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Clerk Authentication
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Server
PORT=3000
NODE_ENV=development

# Expo Push Notifications
EXPO_ACCESS_TOKEN=your_expo_access_token
```

#### Mobile Environment Variables

Create a `.env` file in `apps/mobile/`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### 4. Start Infrastructure Services

Using Docker Compose (recommended):

```bash
cd apps/backend
docker-compose up -d
```

This will start:

- PostgreSQL on port 5432
- Redis on port 6379

### 5. Run the Application

#### Development Mode (All Apps)

```bash
# From the root directory
yarn dev
```

#### Backend Only

```bash
# From the root directory
yarn dev --filter=backend

# Or from apps/backend
cd apps/backend
yarn dev
```

The backend will be available at:

- API: `http://localhost:3000/api/v1`
- Swagger Docs: `http://localhost:3000/reference`

#### Mobile App Only

```bash
# From the root directory
yarn dev --filter=mobile

# Or from apps/mobile
cd apps/mobile
yarn dev
```

Then:

- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app for physical device

## 📦 Building for Production

### Build All Apps

```bash
yarn build
```

### Build Specific App

```bash
# Backend
yarn build --filter=backend

# Mobile
yarn build --filter=mobile
```

### Mobile App Deployment

#### iOS

```bash
cd apps/mobile
eas build --platform ios
```

#### Android

```bash
cd apps/mobile
eas build --platform android
```

## 🧪 Testing

### Run All Tests

```bash
yarn test
```

### Backend Tests

```bash
cd apps/backend
yarn test              # Run unit tests
yarn test:watch        # Run tests in watch mode
yarn test:cov          # Run tests with coverage
yarn test:e2e          # Run end-to-end tests
```

## 🔍 Code Quality

### Linting

```bash
# Lint all apps and packages
yarn lint

# Auto-fix issues
yarn lint --fix
```

### Type Checking

```bash
yarn check-types
```

### Formatting

```bash
yarn format
```

## 📱 Mobile Development

### Run on Physical Device

1. Install Expo Go app on your device
2. Start the development server: `yarn dev`
3. Scan the QR code with your camera (iOS) or Expo Go app (Android)

### Build Development Client

```bash
cd apps/mobile
npx expo prebuild
yarn ios     # or yarn android
```

## 🐳 Docker Commands

### Start Services

```bash
cd apps/backend
docker-compose up -d
```

### Stop Services

```bash
cd apps/backend
docker-compose down
```

### View Logs

```bash
docker-compose logs -f
```

### Reset Database

```bash
docker-compose down -v
docker-compose up -d
```

## 📚 API Documentation

Once the backend is running, access the interactive API documentation:

- **Scalar API Reference**: `http://localhost:3000/reference`

The API follows RESTful conventions with the base path `/api/v1`.

### Main Endpoints

- `POST /api/v1/auth/login` - User authentication
- `GET /api/v1/subscriptions` - Get all subscriptions
- `POST /api/v1/subscriptions` - Create a subscription
- `PUT /api/v1/subscriptions/:id` - Update a subscription
- `DELETE /api/v1/subscriptions/:id` - Delete a subscription
- `GET /api/v1/dashboard` - Get dashboard analytics

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style

- Follow the existing code style
- Run `yarn lint` and `yarn format` before committing
- Write meaningful commit messages
- Add tests for new features

## 📄 License

This project is licensed under the UNLICENSED License - see the backend package.json for details.

## 👨‍💻 Author

**Ajay Patel** - [@patelajay745](https://github.com/patelajay745)

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [Expo](https://expo.dev/) - React Native platform
- [Turborepo](https://turborepo.com/) - High-performance build system
- [Clerk](https://clerk.com/) - Authentication solution
- All the amazing open-source libraries used in this project

