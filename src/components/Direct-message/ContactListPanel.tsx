import ContactList from "./ContactList";
import SearchBar from "./SearchBar";

const ContactListPanel = () => {
  return (
    <section className="flex flex-col min-w-[486px] bg-dark-9">
      <div className="h-[100px] w-full">
        <SearchBar />
      </div>
      <div>
        <ContactList />
      </div>
    </section>
  );
};

export default ContactListPanel;
