# Edu-Connect-Pakistan

A platform connecting students with qualified tutors across Pakistan, featuring role-based access, session management, and interactive dashboards.


## Features

### Student Features
🔍 **Tutor Search System**  
- Real-time filtering by subject, location, price, rating, and availability  
- Interactive TutorCard components with wishlist functionality  

📅 **Session Management**  
- Booking interface with calendar integration  
- Session rescheduling/cancellation  
- Dashboard with calendar/list views  

⭐ **Review System**  
- Post-session rating (1-5 stars) and reviews  
- Dynamic average rating updates  

❤️ **Wishlist**  
- Save favorite tutors with local storage persistence  
- Sort/filter wishlist entries  

### Tutor Features
👤 **Profile Management**  
- Editable profile with qualifications/availability  
- Profile preview mode  

💰 **Session Dashboard**  
- Accept/decline session requests  
- Earnings tracking with payment status  

### Admin Features
🛡️ **Verification System**  
- Document review interface  
- Bulk approval/rejection  

📊 **Reporting**  
- Interactive charts for platform analytics  
- Data export functionality  

## Tech Stack
**Frontend**  
- React.js with React Router  
- Context API for state management  
- Axios for API communication  
- Chart.js for data visualization  

**Backend**  
- Node.js & Express.js  
- JWT Authentication  
- MongoDB with Mongoose  
- RESTful API design  

## Installation

### Prerequisites
- Node.js v16+
- MongoDB Atlas account or local instance
- Git

```bash
# Clone repository
git clone https://github.com/yourusername/educonnect-pakistan.git
cd educonnect-pakistan

# Install dependencies
cd client && npm install
cd ../server && npm install

# Set up environment variables
# Create .env in server directory:
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000

# Start development servers
cd ../server && npm run dev  # Starts backend
cd ../client && npm start    # Starts frontend