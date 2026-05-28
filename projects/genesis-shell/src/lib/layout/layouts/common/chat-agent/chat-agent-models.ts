
export interface ChatTransfer {
    sessionId: string;
    commandText: string;
  }
  
  export interface ChatResponse {
    isComplete?: boolean;
    message: string;
    question?: string;
    role: 'user' | 'agent';
    data?: any;
    createdAt: Date;
  }
  export interface ChatTransferAi {
    inputText: string;
  }
  