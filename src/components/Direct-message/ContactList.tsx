import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Contact from "./Contact";
import { contacts } from "@/utils/constants";

const ContactList = () => {
  return (
    <ScrollArea className="size-full custom-scrollbar">
      {
        contacts.map( (contact) => {
          return <Contact image={contact.image} username={contact.username}
          noMissedMessages={contact.noMissedMessages}
          isLastMessageFromUser={contact.isLastMessageFromUser}
          lastMessage={contact.lastMessage} lastSent={contact.lastSent}/>
        })
      }
      <ScrollBar className="custom-scrollbar"/>
    </ScrollArea>
  );
};

export default ContactList;
