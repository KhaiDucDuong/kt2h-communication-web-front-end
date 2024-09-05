"use client";

import { Client } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import { User } from "@/types/user";
import { getCurrentUser } from "@/services/UserService";
import DirectMessage from "@/components/Direct-message/DirectMessage";
import SideNavbar from "@/components/Dashboard/SideNavbar/SideNavbar";
import { Message, messageSchema } from "@/types/message";

const DirectMessagePage = () => {
  const [currentUser, setCurrentUser] = useState<User>();
  const [stompClient, setStompClient] = useState<Client>();
  const [newConversationMessage, setNewConversationMessage] = useState<Message | null>(null);
  const stompClientUrl = process.env.NEXT_PUBLIC_URL_STOMP_CLIENT;

  useEffect(() => {
    connectWebSocket();
  }, []);

  async function fetchCurrentUser() {
    const data = await getCurrentUser();
    if (data) {
      setCurrentUser(data);
    }
    return data;
  }

  async function connectWebSocket() {
    console.log("Fetching current user...");
    const currentUser = await fetchCurrentUser();
    if (!currentUser) return;
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

    stompClient.activate();
  }

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
      <SideNavbar currentUser={currentUser} />
      <div className="w-full">
        <DirectMessage stompClient={stompClient} currentUser={currentUser} newConversationMessage={newConversationMessage} setNewConversationMessage={setNewConversationMessage}/>
      </div>
    </section>
  );
};

export default DirectMessagePage;
