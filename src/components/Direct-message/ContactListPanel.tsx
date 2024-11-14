import { Contact } from "@/types/contact";
import ContactList from "./ContactList";
import SearchBar from "./SearchBar";
import Notification from "../Notification/Notification";
import ContactSkeleton from "./ContactSkeleton";

interface ContactListPanelProps {
  contacts: Contact[];
  selectedContact: Contact | null;
  onSelectContact: (contact: Contact) => void;
  isFetching: boolean;
}
const ContactListPanel = (props: ContactListPanelProps) => {
  const { contacts, selectedContact, onSelectContact, isFetching } = props;
  return (
    <section className="flex flex-col w-[486px] bg-dark-9 max-lg:w-[330px]">
      <div className="h-[98px] w-[full] ">
        <div className="h-[98px] flex flex-row">
          <SearchBar placeHolder="Find a conversation" />
          <Notification />
        </div>
        <div className="relative flex w-full border-dark-10 border-[1px] "></div>
      </div>
      <div className="pt-[2px] size-full max-h-[calc(100vh-98px)] px-[7px]">
        <ContactList
          contacts={contacts}
          selectedContact={selectedContact}
          onSelectContact={onSelectContact}
          isFetching={isFetching}
        />
      </div>
    </section>
  );
};

export default ContactListPanel;
