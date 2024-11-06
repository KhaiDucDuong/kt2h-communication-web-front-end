"use client";

import { Client } from "@stomp/stompjs";
import { createContext, useEffect, useState } from "react";
import { User } from "@/types/user";
import { getCurrentUser } from "@/services/UserService";
import DirectMessage from "@/components/Direct-message/DirectMessage";
import SideNavbar from "@/components/Dashboard/SideNavbar/SideNavbar";
import { Message, messageSchema } from "@/types/message";
import Friends from "@/components/Friends/Friends";
import Groups from "@/components/Groups/Groups";
import {
  InvitationNotification,
  invitationNotificationSchema,
  NotificationSocketEvent,
  SocketInvitationNotification,
  socketInvitationNotificationSchema,
} from "@/types/notification";
import {
  revalidateAllTags,
  revalidateIncomingFriendRequestTag,
  revalidateInvitationNotificationTag,
  revalidateOutgoingFriendRequestTag,
} from "@/services/revalidateApiTags";
import { DashboardTab } from "@/types/ui";
import { SocketContext } from "@/types/context";

const DashboardPage = () => {
  const [currentTab, setCurrentTab] = useState<DashboardTab>(
    DashboardTab.DIRECT_MESSAGE
  );
  const [currentUser, setCurrentUser] = useState<User>();
  const [stompClient, setStompClient] = useState<Client>();
  const [newConversationMessage, setNewConversationMessage] =
    useState<Message | null>(null);
  const [
    newSocketInvitationNotifications,
    setSocketNewInvitationNotifications,
  ] = useState<SocketInvitationNotification[]>([]);
  const stompClientUrl = process.env.NEXT_PUBLIC_URL_STOMP_CLIENT;

  useEffect(() => {
    let ignore = false;

    async function fetchCurrentUser() {
      const data = await getCurrentUser();
      if (data && !ignore) {
        console.log("Set current user data");
        setCurrentUser(data);
      }
      return data;
    }

    async function connectWebSocket(currentUser: User | null) {
      if (!currentUser || ignore) return;
      console.log("Creating STOMP client...");
      const stompClient = new Client({
        brokerURL: stompClientUrl,
      });
      stompClient.onConnect = function () {
        // console.log("Successfully connected to STOMP client.");
        stompClient.subscribe(
          "/user/" + currentUser.user_id + "/private",
          onPrivateMessage
        );
        console.log(
          "Successfully subscribe to " +
            "/user/" +
            currentUser.user_id +
            "/private"
        );
        stompClient.subscribe(
          "/user/" + currentUser.user_id + "/notification",
          onNotification
        );
        console.log(
          "Successfully subscribe to " +
            "/user/" +
            currentUser.user_id +
            "/notification"
        );
        setStompClient(stompClient);
      };

      stompClient.onStompError = function (frame) {
        // Will be invoked in case of error encountered at Broker
        // Bad login/passcode typically will cause an error
        // Complaint brokers will set `message` header with a brief message. Body may contain details.
        // Compliant brokers will terminate the connection after any error
        console.log("Broker reported error: " + frame.headers["message"]);
        console.log("Additional details: " + frame.body);
      };

      stompClient.onDisconnect = function () {
        console.log("Disconnected from STOMP client.");
        stompClient?.unsubscribe("/user/" + currentUser?.user_id + "/private");
        console.log(
          "Unsubscribed from /user/" + currentUser?.user_id + "/private"
        );
        setStompClient(undefined);
      };

      stompClient.activate();
    }

    console.log("Fetching current user...");
    fetchCurrentUser().then((data) => {
      if (data && !ignore) {
        connectWebSocket(data);
      }
    });
    return () => {
      ignore = true;
      stompClient?.deactivate();
    };
  }, []);

  const onPrivateMessage = (payload: any) => {
    const message = JSON.parse(payload.body) as Message;
    console.log("Receive a private message");
    console.log(JSON.stringify(message));
    try {
      const validatedMessage = messageSchema.parse(message);
    } catch (error) {
      console.log("Invalid message payload");
      return;
    }
    setNewConversationMessage(message);
  };

  const onNotification = (payload: any) => {
    const notification = JSON.parse(
      payload.body
    ) as SocketInvitationNotification;
    console.log("Receive a notification");
    // console.log(JSON.stringify(payload));
    try {
      const validatedNotification =
        socketInvitationNotificationSchema.parse(notification);
    } catch (error) {
      console.log("Invalid notification payload");
      return;
    }
    setSocketNewInvitationNotifications((prev) => [...prev, notification]);
    revalidateInvitationNotificationTag();
    notification.socket_event === NotificationSocketEvent.RECEIVE_FRIEND_REQUEST
      ? revalidateIncomingFriendRequestTag()
      : revalidateOutgoingFriendRequestTag();
  };

  if (!stompClient || !currentUser) {
    return (
      <div>
        Loading...{" "}
        {"Stomp: " + String(stompClient) + " User: " + String(currentUser)}
      </div>
    );
  }

  return (
    <section className="flex">
      <SocketContext.Provider
        value={{
          stompClient,
          newConversationMessage,
          setNewConversationMessage,
          newSocketInvitationNotifications,
          setSocketNewInvitationNotifications,
        }}
      >
        <SideNavbar
          currentUser={currentUser}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />
        <div className="w-full">
          {currentTab === DashboardTab.DIRECT_MESSAGE && (
            <DirectMessage
              currentUser={currentUser}
              newConversationMessage={newConversationMessage}
              setNewConversationMessage={setNewConversationMessage}
            />
          )}
          {currentTab === DashboardTab.GROUP_CHAT && (
            <Groups currentUser={currentUser} />
          )}
          {currentTab === DashboardTab.FRIENDS && <Friends />}
          {currentTab === DashboardTab.SETTINGS && <div>settings</div>}
        </div>
      </SocketContext.Provider>
    </section>
  );
};

export default DashboardPage;
