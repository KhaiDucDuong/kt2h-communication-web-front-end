import ContactList from "./ContactList";
import SearchBar from "./SearchBar";

const ContactListPanel = () => {
  return (
    <section className="flex flex-col w-[486px] bg-dark-9 max-lg:w-[330px]">
      <div className="h-[98px] w-[full] ">
        <SearchBar placeHolder="Find a conversation"/>
        <div className="relative flex w-full border-dark-10 border-[1px] "></div>
      </div>
      <div className="pt-[2px] size-full max-h-[calc(100vh-98px)] px-[7px]">
        <ContactList />
      </div>
    </section>
  );
};

export default ContactListPanel;
