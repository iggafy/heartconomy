
import { create } from 'zustand';

export interface Post {
  id: string;
  userId: string;
  content: string;
  likes: number;
  comments: Comment[];
  createdAt: Date;
  likedBy: string[];
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
}

interface PostStore {
  posts: Post[];
  initializePosts: () => void;
  likePost: (postId: string, userId: string) => void;
  addComment: (postId: string, userId: string, content: string) => void;
  createPost: (userId: string, content: string) => void;
}

export const usePostStore = create<PostStore>((set, get) => ({
  posts: [],

  initializePosts: () => {
    const samplePosts: Post[] = [
      {
        id: '1',
        userId: '1',
        content: 'Just spent my last 5 hearts on this comment... worth it? 💔',
        likes: 12,
        comments: [
          {
            id: 'c1',
            userId: '2',
            content: 'The heart economy is brutal but beautiful',
            createdAt: new Date(Date.now() - 1000 * 60 * 30)
          }
        ],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        likedBy: ['2', '3']
      },
      {
        id: '2',
        userId: '2',
        content: 'PSA: I\'ve been hoarding hearts for weeks. Time to spread some love! 🦇❤️',
        likes: 23,
        comments: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
        likedBy: ['1', 'current']
      },
      {
        id: '3',
        userId: '3',
        content: 'This was my last post before going broke... someone please revive me 👻',
        likes: 3,
        comments: [
          {
            id: 'c2',
            userId: '1',
            content: 'Hang in there!',
            createdAt: new Date(Date.now() - 1000 * 60 * 15)
          }
        ],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
        likedBy: ['1']
      }
    ];

    set({ posts: samplePosts });
  },

  likePost: (postId: string, userId: string) => {
    set(state => ({
      posts: state.posts.map(post => {
        if (post.id === postId && !post.likedBy.includes(userId)) {
          return {
            ...post,
            likes: post.likes + 1,
            likedBy: [...post.likedBy, userId]
          };
        }
        return post;
      })
    }));
  },

  addComment: (postId: string, userId: string, content: string) => {
    const newComment: Comment = {
      id: `c${Date.now()}`,
      userId,
      content,
      createdAt: new Date()
    };

    set(state => ({
      posts: state.posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      })
    }));
  },

  createPost: (userId: string, content: string) => {
    const newPost: Post = {
      id: `p${Date.now()}`,
      userId,
      content,
      likes: 0,
      comments: [],
      createdAt: new Date(),
      likedBy: []
    };

    set(state => ({
      posts: [newPost, ...state.posts]
    }));
  }
}));
