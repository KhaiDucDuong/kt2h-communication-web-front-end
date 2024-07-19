import { ScrollArea } from "@/components/ui/scroll-area";
import Contact from "./Contact";

const ContactList = () => {
  return (
    <ScrollArea className="size-full">
        <Contact />
        <Contact />
    </ScrollArea>
  );
};

export default ContactList;
