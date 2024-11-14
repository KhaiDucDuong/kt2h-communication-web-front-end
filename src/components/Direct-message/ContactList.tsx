"use client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { contacts } from "@/utils/constants";
import { useState } from "react";
import { Contact } from "@/types/contact";
import ContactComponent from "./ContactComponent";
import ContactSkeleton from "./ContactSkeleton";

interface ContactListProps {
  contacts: Contact[];
  selectedContact: Contact | null;
  onSelectContact: (contact: Contact) => void;
  isFetching: boolean;
}

const ContactList = (props: ContactListProps) => {
  const { contacts, selectedContact, onSelectContact, isFetching } = props;

  return (
    <ScrollArea className="size-full">
      {contacts.map((contact) => {
        return (
          <ContactComponent
            key={contact.id}
            image={contact.to_user_image}
            name={
              contact.to_user_nickname
                ? contact.to_user_nickname
                : `${contact.to_user_last_name} ${contact.to_user_first_name}`
            }
            // noMissedMessages={0}
            // isLastMessageFromUser={false}
            // lastMessage={""} lastSent={undefined}
            className={
              selectedContact?.id === contact.id
                ? "bg-dark-1 rounded-[8px]"
                : ""
            }
            handleClick={() => onSelectContact(contact)}
          />
        );
      })}
      {isFetching && (
        <div>
          <ContactSkeleton />
          <ContactSkeleton />
        </div>
      )}
      <ScrollBar className="custom-scrollbar" />
    </ScrollArea>
  );
};

export default ContactList;
