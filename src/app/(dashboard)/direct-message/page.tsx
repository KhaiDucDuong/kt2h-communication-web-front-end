import ContactListPanel from "@/components/Direct-message/ContactListPanel";
import MessagePanel from "@/components/Direct-message/MessagePanel";
import MoreInfoPanel from "@/components/Direct-message/MoreInfoPanel";

const DirectMessagePage = () => {
  return <section className="flex flex-row size-full">
    <ContactListPanel />
    <MessagePanel />
    <MoreInfoPanel />
  </section>;
};

export default DirectMessagePage;
