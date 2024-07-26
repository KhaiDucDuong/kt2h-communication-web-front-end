import ContactListPanel from "@/components/Direct-message/ContactListPanel";
import MessagePanel from "@/components/Direct-message/MessagePanel";

const DirectMessagePage = () => {
  return <section className="flex flex-row size-full">
    <ContactListPanel />
    <MessagePanel />
  </section>;
};

export default DirectMessagePage;
