import bcrypt from 'bcryptjs';

export type UserRole = 'guest' | 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}

// In-memory store for development (to be replaced by DB later)
const globalUsers: User[] = [];

// Seed admin user
const adminEmail = process.env.ADMIN_EMAIL || 'admin@pvpropertyfinder.mx';
const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

const seedAdmin = () => {
  if (globalUsers.length === 0) {
    globalUsers.push({
      id: 'admin-1',
      email: adminEmail,
      passwordHash: bcrypt.hashSync(adminPassword, 10),
      name: 'System Administrator',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      createdAt: new Date(),
    });
  }
};

seedAdmin();

export const usersDb = {
  async findByEmail(email: string): Promise<User | undefined> {
    return globalUsers.find((u) => u.email === email);
  },
  
  async findById(id: string): Promise<User | undefined> {
    return globalUsers.find((u) => u.id === id);
  },

  async createUser(data: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const newUser: User = {
      ...data,
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date(),
    };
    globalUsers.push(newUser);
    return newUser;
  },

  async getAllUsers(): Promise<User[]> {
    return globalUsers;
  },

  async updateUserRole(id: string, role: UserRole): Promise<User | null> {
    const index = globalUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      globalUsers[index].role = role;
      return globalUsers[index];
    }
    return null;
  }
};
