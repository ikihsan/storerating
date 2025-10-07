# Store Rating System

A comprehensive web application for managing and rating local stores, built with modern web technologies. This platform allows users to discover stores, rate their experiences, and provides store owners with tools to manage their businesses.

**What can you do with this system?**

### For Customers
- **Browse Stores**: View all available stores with detailed information
- **Search & Filter**: Find stores by name, location, or rating
- **Rate & Review**: Share your experience with a 5-star rating system
- **User Authentication**: Secure login and registration system

### For Store Owners
- **Store Management**: Create and manage your store profile
- **Dashboard Analytics**: View store performance and customer feedback
- **Rating Insights**: Track customer ratings and reviews
- **Business Profile**: Showcase your store with detailed information

### For Administrators
- **User Management**: Oversee all user accounts and roles
- **Store Oversight**: Monitor and manage all stores on the platform
- **Analytics Dashboard**: Comprehensive system statistics
- **Content Moderation**: Manage ratings and user-generated content

**Technologies Used**

### Frontend
- **React 18** with TypeScript for type-safe development
- **Material-UI (MUI)** for modern, responsive design
- **React Hook Form** with Yup validation for robust form handling
- **Axios** for API communication
- **React Router** for client-side routing

### Backend
- **NestJS** - Progressive Node.js framework
- **PostgreSQL** - Reliable relational database
- **Prisma ORM** - Modern database toolkit
- **JWT Authentication** - Secure token-based auth
- **TypeScript** - Enhanced development experience

### Infrastructure
- **Database**: PostgreSQL with Prisma migrations
- **Authentication**: JWT tokens with role-based access control
- **Validation**: Class-validator decorators and Yup schemas
- **API Design**: RESTful architecture with proper error handling

**How to Set Up and Run**

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ikihsan/storerating.git
   cd storerating
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/storerating"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=3000
   ```

5. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate deploy
   
   # Seed the database with initial data
   npx prisma db seed
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   npm run start:dev
   ```
   The API will be available at `http://localhost:3000`

2. **Start the frontend application**
   ```bash
   cd frontend
   npm start
   ```
   The web application will be available at `http://localhost:3001`

**User Roles and What They Can Do**

### User (Default Role)
- View and search stores
- Submit ratings and reviews
- Manage personal profile

### Store Owner
- All User permissions
- Create and manage owned stores
- View store analytics and customer feedback
- Update store information

### Administrator
- Full system access
- User account management
- Store oversight and moderation
- System analytics and reporting

**API Endpoints (for developers)**

### Authentication Endpoints
- `POST /auth/register` - Create new user account
- `POST /auth/login` - User authentication
- `POST /auth/logout` - Secure logout
- `PATCH /auth/update-password` - Change password

### Store Management
- `GET /stores` - List all stores with filtering
- `POST /stores` - Create new store (Store Owners only)
- `GET /stores/:id` - Get store details
- `PATCH /stores/:id` - Update store information
- `GET /stores/my-stores` - Get owned stores
- `GET /stores/dashboard` - Store owner analytics

### Rating System
- `POST /ratings/stores/:id` - Submit store rating
- `GET /ratings/stores/:id` - Get store ratings
- `GET /ratings/stores/:id/my-rating` - Get user's rating
- `PATCH /ratings/stores/:id` - Update existing rating

### Admin Operations
- `GET /admin/dashboard` - System statistics
- `GET /admin/users` - User management
- `POST /admin/users` - Create user accounts
- `GET /admin/stores` - Store oversight

**Database Structure**

The application uses a relational database with the following main entities:

- **Users**: Account information and authentication
- **Stores**: Business profiles and details
- **Ratings**: Customer reviews and ratings
- **Roles**: User permission management

**Development Notes**

### Code Quality
- TypeScript for type safety
- ESLint for code consistency
- Prettier for code formatting
- Comprehensive error handling

### Security Features
- JWT token authentication
- Password hashing with bcrypt
- SQL injection prevention via Prisma
- CORS configuration
- Input validation and sanitization


**How the Project is Organized**

```
storerating/
├── src/                    # Backend source code
│   ├── auth/              # Authentication module
│   ├── user/              # User management
│   ├── store/             # Store operations
│   ├── rating/            # Rating system
│   ├── admin/             # Admin functionality
│   └── prisma/            # Database service
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript types
├── prisma/                # Database schema and migrations
└── test/                  # Test files

```

