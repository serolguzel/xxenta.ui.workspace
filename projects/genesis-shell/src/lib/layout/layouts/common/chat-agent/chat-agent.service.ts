import { Injectable } from '@angular/core';
import { ChatResponse, ChatTransfer, ChatTransferAi } from './chat-agent-models';
import { CoreService } from 'genesis-coreservice';

@Injectable({
  providedIn: 'root'
})
export class ChatAgentService extends CoreService {
  public ChatTransfer(request: ChatTransfer): Promise<ChatResponse> {
    return this.postCallWithoutToast('ChatAI/ChatTransfer', request);
  }

  public Chat(request: FormData): Promise<ChatResponse> {
    return this.postFile('ChatAI/Chat', request);
  }

  public ChatTransferAi(request: ChatTransferAi): Promise<any> {
    return this.postCallWithoutToast('ChatAI', request);
  }
}