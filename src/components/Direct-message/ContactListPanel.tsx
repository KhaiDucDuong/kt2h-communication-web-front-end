import ContactList from "./ContactList";
import SearchBar from "./SearchBar";

const ContactListPanel = () => {
  return (
    <section className="flex flex-col min-w-[486px] bg-dark-9">
      <div className="h-[98px] w-[full]">
        <SearchBar />
        <div className="relative flex w-full border-dark-10 border-[1px] "></div>
      </div>
      <div className="pt-[2px]">
        <ContactList />
      </div>
    </section>
  );
};

export default ContactListPanel;
