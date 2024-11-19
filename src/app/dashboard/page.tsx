"use client";

import { Client } from "@stomp/stompjs";
import { createContext, useEffect, useRef, useState } from "react";
import {
  StatusUpdate,
  statusUpdateSchema,
  User,
  userSchema,
  UserStatus,
} from "@/types/user";
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
import { SocketContext, UserSessionContext } from "@/types/context";
import { getAccessToken, setUserSessionCookie } from "@/services/AuthService";
import InitialLoading from "@/components/Dashboard/InitialLoading";

const IDLE_INTERVAL_TIME = 1000 * 60 * 5; // 1000 * 60 * 5 = 300,000 ms = 5 minutes
const events = [
  // "mousedown",
  "mousemove",
  // "wheel",
  "keydown",
  // "touchstart",
  // "scroll",
  // ... add other events here ...
];

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
  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userRef = useRef<User | undefined>(currentUser);
  const stompClientRef = useRef<Client | undefined>(stompClient);
  const wasActiveRef = useRef<boolean>(true);

  useEffect(() => {
    let ignore = false;

    async function fetchCurrentUser() {
      const data = await getCurrentUser();
      if (data && !ignore) {
        console.log("Set current user data");
        setCurrentUser(data);
        userRef.current = data;
        wasActiveRef.current = data.status === UserStatus.ONLINE;
      }
      return data;
    }

    async function connectWebSocket(currentUser: User | null) {
      if (!currentUser || ignore) return;
      console.log("Creating STOMP client...");
      const accessToken = await getAccessToken(true);
      const stompClient = new Client({
        brokerURL: stompClientUrl,
        heartbeatIncoming: 30000, // Expect a heartbeat every 30 seconds from the server
        heartbeatOutgoing: 30000, // Send a heartbeat every 30 seconds to the server
        // connectionTimeout: 15000, //maximum 15 seconds to establish connection to the server
        reconnectDelay: 5000, // Reconnect after 5 seconds if disconnected
        // discardWebsocketOnCommFailure: true,
        connectHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
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

        stompClient.subscribe(
          "/user/" + currentUser.user_id + "/status",
          onStatusUpdate
        );
        console.log(
          "Successfully subscribe to " +
            "/user/" +
            currentUser.user_id +
            "/status"
        );
        setStompClient(stompClient);
        stompClientRef.current = stompClient;
      };

      stompClient.onStompError = function (frame) {
        // Will be invoked in case of error encountered at Broker
        // Bad login/passcode typically will cause an error
        // Complaint brokers will set `message` header with a brief message. Body may contain details.
        // Compliant brokers will terminate the connection after any error
        console.log("Broker reported error: " + frame.headers["message"]);
        console.log("Additional details: " + frame.body);
        console.log("Frame json: " + JSON.stringify(frame));
        //atttempt to reconnect
        // stompClient.deactivate({ force: true });
        // connectWebSocket(currentUser);
      };

      stompClient.onDisconnect = function () {
        console.log("Disconnected from STOMP client.");
        // stompClient?.unsubscribe("/user/" + currentUser?.user_id + "/private");
        // console.log(
        //   "Unsubscribed from /user/" + currentUser?.user_id + "/private"
        // );
        // setStompClient(undefined);
      };

      stompClient.activate();
    }

    function setupInactivityTimeout() {
      // inactivityTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
        console.log("Clear Inactivity Timeout");
      }

      // Set user to "away" after 5 minutes of inactivity
      inactivityTimeoutRef.current = setTimeout(() => {
        console.log(
          `Inactivity Timeout; stomp ref: ${stompClientRef.current?.connected}, user ref: ${userRef.current?.status}, wasActive ref: ${wasActiveRef.current}`
        );
        if (
          stompClientRef.current?.connected &&
          userRef.current?.status !== UserStatus.IDLE &&
          wasActiveRef.current
        ) {
          stompClientRef.current.publish({
            destination: "/app/user/status",
            body: JSON.stringify({ status: UserStatus.IDLE }),
          });
          wasActiveRef.current = false;
          console.log("Switch to Idle status!!!");
        }
      }, IDLE_INTERVAL_TIME);
    }

    function handleUserActivity() {
      console.log(
        `Handle user activity; stomp ref: ${stompClientRef.current?.connected}, user ref: ${userRef.current?.status}, wasActive ref: ${wasActiveRef.current}`
      );
      if (
        stompClientRef.current?.connected &&
        userRef.current?.status === UserStatus.IDLE &&
        !wasActiveRef.current
      ) {
        stompClientRef.current.publish({
          destination: "/app/user/status",
          body: JSON.stringify({ status: UserStatus.ONLINE }),
        });
        wasActiveRef.current = true;
        console.log("Switch to Online status!!!");
      }
      setupInactivityTimeout();
    }

    const handleUserActivityTimeout = () => handleUserActivity();
    console.log("Fetching current user...");
    fetchCurrentUser().then((data) => {
      if (data && !ignore) {
        connectWebSocket(data).then(() => {
          events.forEach((event) => {
            document.addEventListener(event, handleUserActivityTimeout);
          });
        });
        setupInactivityTimeout();
      }
    });

    return () => {
      ignore = true;
      stompClient?.deactivate();
      events.forEach((event) => {
        document.removeEventListener(event, handleUserActivityTimeout);
      });
      if (inactivityTimeoutRef.current)
        clearTimeout(inactivityTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const parseResult = userSchema.safeParse(userRef.current);
    if (parseResult.success) setCurrentUser(userRef.current);
    else {
      console.log("!!Failed to parse user data in userRef");
      console.log("User Ref: " + JSON.stringify(userRef.current));
    }

    return () => {};
  }, [userRef.current]);

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

  const onStatusUpdate = async (payload: any) => {
    const statusUpdate = JSON.parse(payload.body) as StatusUpdate;
    console.log("Receive a status update");
    // console.log(JSON.stringify(payload.body));
    try {
      const validatedStatusUpdate = statusUpdateSchema.parse(statusUpdate);
    } catch (error) {
      console.log("Invalid status update payload");
      return;
    }

    if (statusUpdate.user_id === userRef.current?.user_id) {
      if (!statusUpdate.status) {
        console.log("Update status received contains null value!");
        return;
      }
      console.log("Updating user session data to " + statusUpdate.status);
      userRef.current.status = statusUpdate.status;
      setUserSessionCookie(userRef.current);
      console.log(userRef.current);
    }
  };

  if (!stompClient || !currentUser) {
    return <InitialLoading />;
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
        <UserSessionContext.Provider
          value={{
            currentUser,
            setCurrentUser,
          }}
        >
          <SideNavbar currentTab={currentTab} setCurrentTab={setCurrentTab} />
          <div className="w-full">
            {currentTab === DashboardTab.DIRECT_MESSAGE && (
              <DirectMessage
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
        </UserSessionContext.Provider>
      </SocketContext.Provider>
    </section>
  );
};

export default DashboardPage;
