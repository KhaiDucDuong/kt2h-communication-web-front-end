import { Client } from "@stomp/stompjs";
import { Message } from "./message";
import { SocketInvitationNotification } from "./notification";
import { createContext, Dispatch, SetStateAction } from "react";
import { User } from "./user";

type ISocketContext = {
  stompClient: Client | undefined;
  newConversationMessage: Message | null;
  setNewConversationMessage: Dispatch<
    SetStateAction<Message | null>
  >;
  newSocketInvitationNotifications: SocketInvitationNotification[];
  setSocketNewInvitationNotifications: Dispatch<
    SetStateAction<SocketInvitationNotification[]>
  >;
};

export const SocketContext = createContext<ISocketContext | null>(null);

type IUserSessionContext = {
  currentUser: User | undefined;
  setCurrentUser: Dispatch<SetStateAction<User | undefined>>;
}

export const UserSessionContext = createContext<IUserSessionContext | null>(null);