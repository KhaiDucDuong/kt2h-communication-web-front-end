"use client";

import ContactListPanel from "@/components/Direct-message/ContactListPanel";
import MessagePanel from "@/components/Direct-message/MessagePanel";
import { Contact, getContactsFromResponse } from "@/types/contact";
import { Message } from "@/types/message";
import { ContactResponse } from "@/types/response";
import { User } from "@/types/user";
import { Client } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import NoContactMessagePanel from "./NoContactMessagePanel";

interface DirectMessageProps {
  newConversationMessage: Message | null;
  setNewConversationMessage: (message: Message | null) => void;
}

const DirectMessage = (props: DirectMessageProps) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contactPage, setContactPage] = useState<number>(1);
  const [hasMoreContacts, setHasMoreContacts] = useState<boolean>(true);

  useEffect(() => {
    let ignore = false;

    const fetchContacts = async () => {
      if (!hasMoreContacts) return;
      const res = await fetch(`/dashboard/api/contact?page=${contactPage}`, {
        method: "GET",
      });
      const body = (await res.json()) as ContactResponse;
      if (!res.ok) {
        console.log("Failed to fetch contacts");
      } else {
        // console.log("Contacts data: ", body);
        const fetchedContacts = getContactsFromResponse(body);
        if (fetchedContacts === null || ignore) return;
        setContacts((prev) => [...prev, ...fetchedContacts]);
        setContactPage(body.data.meta.page + 1);
        setHasMoreContacts(body.data.meta.page < body.data.meta.pages);
        setIsFetching(false);
      }
    };

    fetchContacts();

    return () => {
      ignore = true;
      setIsFetching(true);
      setSelectedContact(null);
      setContactPage(1);
      setHasMoreContacts(true);
    };
  }, []);

  return (
    <section className="flex flex-row size-full">
      <ContactListPanel
        contacts={contacts}
        selectedContact={selectedContact}
        onSelectContact={setSelectedContact}
        isFetching={isFetching}
      />
      {selectedContact ? (
        <MessagePanel
          contact={selectedContact}
          newConversationMessage={props.newConversationMessage}
          setNewConversationMessage={props.setNewConversationMessage}
        />
      ) : (
        <NoContactMessagePanel />
      )}
    </section>
  );
};

export default DirectMessage;
