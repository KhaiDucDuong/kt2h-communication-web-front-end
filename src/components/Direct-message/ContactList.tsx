"use client"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { contacts } from "@/utils/constants";
import { useState } from "react";
import { Contact } from "@/types/contact";
import ContactComponent from "./ContactComponent";

interface ContactListProps {
  contacts: Contact[];
  selectedContact: Contact | null;
  onSelectContact: (contact: Contact) => void;
}

const ContactList = (props: ContactListProps) => {
  const { contacts, selectedContact, onSelectContact } = props;

  return (
    <ScrollArea className="size-full">
      {
        contacts.map( (contact) => {
          return <ContactComponent key={contact.id} image={contact.to_user_image} nickname={contact.to_user_nickname}
          // noMissedMessages={0}
          // isLastMessageFromUser={false}
          // lastMessage={""} lastSent={undefined} 
          className={selectedContact?.id===contact.id ? "bg-dark-1 rounded-[8px]" : ""}
          handleClick={() => onSelectContact(contact)}/>
        })
      }
      <ScrollBar className="custom-scrollbar"/>
    </ScrollArea>
  );
};

export default ContactList;
