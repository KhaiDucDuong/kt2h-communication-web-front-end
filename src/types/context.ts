import { Client } from "@stomp/stompjs";
import { Message } from "./message";
import { SocketInvitationNotification } from "./notification";
import { createContext } from "react";

type ISocketContext = {
    stompClient: Client | undefined;
    newConversationMessage: Message | null;
    setNewConversationMessage: React.Dispatch<
      React.SetStateAction<Message | null>
    >;
    newSocketInvitationNotifications: SocketInvitationNotification[];
    setSocketNewInvitationNotifications: React.Dispatch<
      React.SetStateAction<SocketInvitationNotification[]>
    >;
  };
  
  export const SocketContext = createContext<ISocketContext | null>(null);