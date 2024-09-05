"use client";

import ContactListPanel from "@/components/Direct-message/ContactListPanel";
import MessagePanel from "@/components/Direct-message/MessagePanel";
import { Contact, getContactsFromResponse } from "@/types/contact";
import { ContactResponse } from "@/types/response";
import { User } from "@/types/user";
import { Client } from "@stomp/stompjs";
import { useEffect, useState } from "react";

interface DirectMessageProps {
    stompClient: Client;
    currentUser: User;
}

const DirectMessage = (props: DirectMessageProps) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [contactPage, setContactPage] = useState<number>(1);
  const [hasMoreContacts, setHasMoreContacts] = useState<boolean>(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    if (!hasMoreContacts) return;
    const res = await fetch(`/direct-message/api/contact?page=${contactPage}`, {
      method: "GET",
    });
    const body = (await res.json()) as ContactResponse;
    if (!res.ok) {
      console.log("Failed to fetch contacts");
    } else {
      // console.log("Contacts data: ", body);
      const fetchedContacts = getContactsFromResponse(body);
      if (fetchedContacts === null) return;
      setContacts((prev) => [...prev, ...fetchedContacts]);
      setContactPage(body.data.meta.page + 1);
      setHasMoreContacts(body.data.meta.page < body.data.meta.pages);
    }
  };
  return (
    <section className="flex flex-row size-full">
      <ContactListPanel contacts={contacts} selectedContact={selectedContact} onSelectContact={setSelectedContact} />
      <MessagePanel stompClient={props.stompClient} currentUser={props.currentUser} contact={selectedContact} />
    </section>
  );
};

export default DirectMessage;
