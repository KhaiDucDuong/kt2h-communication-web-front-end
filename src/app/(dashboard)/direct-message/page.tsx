"use client";

import ContactListPanel from "@/components/Direct-message/ContactListPanel";
import MessagePanel from "@/components/Direct-message/MessagePanel";
import { cookies } from "next/headers";
import { Client, Message } from "@stomp/stompjs";
import { userSessionCookieName } from "@/utils/constants";
import { useEffect, useState } from "react";
import { User } from "@/types/user";
import { getCurrentUser } from "@/services/UserService";
import { Contact, getContactsFromResponse } from "@/types/contact";
import { ContactResponse } from "@/types/response";

const DirectMessagePage = () => {
  const [currentUser, setCurrentUser] = useState<User>();
  const [stompClient, setStompClient] = useState<Client>();
  const stompClientUrl = process.env.NEXT_PUBLIC_URL_STOMP_CLIENT;
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactPage, setContactPage] = useState<number>(1);
  const [hasMoreContacts, setHasMoreContacts] = useState<boolean>(true);

  useEffect(() => {
    connectWebSocket();
    fetchContacts();
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
    if(!currentUser) return;
    console.log("Creating STOMP client...");
    const stompClient = new Client({
      brokerURL: stompClientUrl,
    });
    stompClient.onConnect = function () {
      console.log("Successfully connected to STOMP client.");
      stompClient.subscribe(
        "/user/" + currentUser.user_id + "/private",
        onPrivateMessage
      );
      console.log("Successfully subscribe to " + "/user/" + currentUser.user_id + "/private");
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
    const parsed = JSON.parse(payload.body)
    console.log("Receive a private message");
    console.log(parsed);
    console.log(JSON.stringify(parsed))
  };

  const fetchContacts = async () => {
    if(!hasMoreContacts) return;
    const res = await fetch(`/direct-message/api/contact?page=${contactPage}`, {
      method: "GET",
    });
    const body = await res.json() as ContactResponse;
    if(!res.ok) {
      console.log("Failed to fetch contacts");
    } else {
      console.log("Contacts data: ", body);
      const fetchedContacts = getContactsFromResponse(body)
      if(fetchedContacts === null) return
      setContacts((prev) => [...prev, ...fetchedContacts]);
      setContactPage(body.data.meta.page + 1);
      setHasMoreContacts(body.data.meta.page < body.data.meta.pages);
    }
  }

  if (!stompClient || !currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <section className="flex flex-row size-full">
      <p>{JSON.stringify(contacts)}</p>
      <p>{JSON.stringify(contactPage)}</p>
      <p>{JSON.stringify(hasMoreContacts)}</p>
      <ContactListPanel />
      <MessagePanel stompClient={stompClient} currentUser={currentUser}/>
    </section>
  );
};

export default DirectMessagePage;
