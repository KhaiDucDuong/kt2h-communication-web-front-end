"use client";

import { Client } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import { User } from "@/types/user";
import { getCurrentUser } from "@/services/UserService";
import DirectMessage from "@/components/Direct-message/DirectMessage";
import SideNavbar from "@/components/Dashboard/SideNavbar/SideNavbar";
import { Message, messageSchema } from "@/types/message";
import Friends from "@/components/Friends/Friends";

export enum DashboardTab {
  DIRECT_MESSAGE,
  GROUP_CHAT,
  SETTINGS,
  FRIENDS,
}

const DashboardPage = () => {
  const [currentTab, setCurrentTab] = useState<DashboardTab>(
    DashboardTab.DIRECT_MESSAGE
  );
  const [currentUser, setCurrentUser] = useState<User>();
  const [stompClient, setStompClient] = useState<Client>();
  const [newConversationMessage, setNewConversationMessage] =
    useState<Message | null>(null);
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
      connectWebSocket(data);
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

  if (!stompClient || !currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <section className="flex">
      <SideNavbar
        currentUser={currentUser}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />
      <div className="w-full">
        {currentTab === DashboardTab.DIRECT_MESSAGE && (
          <DirectMessage
            stompClient={stompClient}
            currentUser={currentUser}
            newConversationMessage={newConversationMessage}
            setNewConversationMessage={setNewConversationMessage}
          />
        )}
        {currentTab === DashboardTab.GROUP_CHAT && <div>group chats</div>}
        {currentTab === DashboardTab.FRIENDS && <Friends />}
        {currentTab === DashboardTab.SETTINGS && <div>settings</div>}
      </div>
    </section>
  );
};

export default DashboardPage;
