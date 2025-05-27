
import { create } from 'zustand';

export interface User {
  id: string;
  username: string;
  hearts: number;
  isDead: boolean;
  avatar: string;
  joinedAt: Date;
  totalHeartsEarned: number;
  totalHeartsSpent: number;
  revivesGiven: number;
  revivesReceived: number;
}

interface UserStore {
  currentUser: User | null;
  users: User[];
  initializeUser: () => void;
  spendHearts: (amount: number) => boolean;
  earnHearts: (amount: number) => void;
  burnAllHearts: () => void;
  reviveUser: (userId: string) => void;
  getUserById: (id: string) => User | undefined;
}

export const useUserStore = create<UserStore>((set, get) => ({
  currentUser: null,
  users: [],

  initializeUser: () => {
    const sampleUsers: User[] = [
      {
        id: '1',
        username: 'heartbreaker',
        hearts: 87,
        isDead: false,
        avatar: '💔',
        joinedAt: new Date('2024-01-15'),
        totalHeartsEarned: 234,
        totalHeartsSpent: 147,
        revivesGiven: 3,
        revivesReceived: 1
      },
      {
        id: '2',
        username: 'socialvampire',
        hearts: 156,
        isDead: false,
        avatar: '🦇',
        joinedAt: new Date('2024-02-01'),
        totalHeartsEarned: 189,
        totalHeartsSpent: 33,
        revivesGiven: 0,
        revivesReceived: 0
      },
      {
        id: '3',
        username: 'lostsouls',
        hearts: 0,
        isDead: true,
        avatar: '👻',
        joinedAt: new Date('2024-01-20'),
        totalHeartsEarned: 45,
        totalHeartsSpent: 145,
        revivesGiven: 12,
        revivesReceived: 2
      },
      {
        id: 'current',
        username: 'you',
        hearts: 73,
        isDead: false,
        avatar: '😊',
        joinedAt: new Date(),
        totalHeartsEarned: 89,
        totalHeartsSpent: 27,
        revivesGiven: 1,
        revivesReceived: 0
      }
    ];

    set({
      users: sampleUsers,
      currentUser: sampleUsers.find(u => u.id === 'current') || null
    });
  },

  spendHearts: (amount: number) => {
    const { currentUser } = get();
    if (!currentUser || currentUser.hearts < amount) return false;

    const updatedUser = {
      ...currentUser,
      hearts: currentUser.hearts - amount,
      totalHeartsSpent: currentUser.totalHeartsSpent + amount,
      isDead: currentUser.hearts - amount === 0
    };

    set(state => ({
      currentUser: updatedUser,
      users: state.users.map(u => u.id === 'current' ? updatedUser : u)
    }));

    return true;
  },

  earnHearts: (amount: number) => {
    const { currentUser } = get();
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      hearts: currentUser.hearts + amount,
      totalHeartsEarned: currentUser.totalHeartsEarned + amount,
      isDead: false
    };

    set(state => ({
      currentUser: updatedUser,
      users: state.users.map(u => u.id === 'current' ? updatedUser : u)
    }));
  },

  burnAllHearts: () => {
    const { currentUser } = get();
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      hearts: 0,
      isDead: true,
      totalHeartsSpent: currentUser.totalHeartsSpent + currentUser.hearts
    };

    set(state => ({
      currentUser: updatedUser,
      users: state.users.map(u => u.id === 'current' ? updatedUser : u)
    }));
  },

  reviveUser: (userId: string) => {
    const { currentUser } = get();
    if (!currentUser || currentUser.hearts < 1) return;

    set(state => ({
      currentUser: {
        ...currentUser,
        hearts: currentUser.hearts - 1,
        totalHeartsSpent: currentUser.totalHeartsSpent + 1,
        revivesGiven: currentUser.revivesGiven + 1
      },
      users: state.users.map(u => {
        if (u.id === userId && u.isDead) {
          return {
            ...u,
            hearts: 10,
            isDead: false,
            revivesReceived: u.revivesReceived + 1
          };
        }
        if (u.id === 'current') {
          return {
            ...currentUser,
            hearts: currentUser.hearts - 1,
            totalHeartsSpent: currentUser.totalHeartsSpent + 1,
            revivesGiven: currentUser.revivesGiven + 1
          };
        }
        return u;
      })
    }));
  },

  getUserById: (id: string) => {
    return get().users.find(u => u.id === id);
  }
}));
