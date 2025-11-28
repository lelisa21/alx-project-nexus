export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Poll {
  id: string;
  question: string;
  description?: string; 
  options: PollOption[];
  createdBy?: string;
  createdByUser?: { 
    id?: string;
    name: string;
    email?: string;
  };
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  totalVotes: number;
  hasVoted?: boolean;
  views?:number;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  voted?: boolean;
}



export interface PollOption {
  id: string;
  text: string;
  votes: number;
  voted?: boolean;
}

export interface Vote {
  id: string;
  pollId: string;
  optionId: string;
  userId: string;
  createdAt: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface SocketEvents {
  'poll:update': (poll: Poll) => void;
  'poll:vote': (data: { pollId: string; optionId: string; userId: string }) => void;
  'poll:created': (poll: Poll) => void;
}



export interface LoginResponse {
  user: User;
  token?: string;
}

export interface PollsResponse {
  polls: Poll[];
}

export interface PollResponse {
  poll: Poll;
}
