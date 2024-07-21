"use client"
import { useState } from "react";
import ContactConversation from "./ContactConversation";
import ContactMessageHeader from "./ContactMessageHeader";
import MoreInfoPanel from "./MoreInfoPanel";

const MessagePanel = () => {
  const [isMoreInfoExpanded, setIsMoreInfoExpanded] = useState<boolean>(false)

  return (
    <section className="flex flex-row size-full bg-dark-4">
      <div className="w-full">
        <div className="h-[98px]">
          <ContactMessageHeader profileHandleClick={()=> {}}
            phoneHandleClick={()=> {}}
            cameraHandleClick={()=> {}}
            elipsisHandleClick={() => setIsMoreInfoExpanded(!isMoreInfoExpanded)}
            isMoreInfoPannelExpanded={isMoreInfoExpanded}/>
          <div className="relative flex  border-dark-10 border-[1px] "></div>
        </div>
        <div className="pt-[2px] size-full max-h-[calc(100vh-98px)]">
          <ContactConversation />
        </div>
      </div>
      <MoreInfoPanel className={isMoreInfoExpanded ? "" : "hidden"}/>
    </section>
  );
};

export default MessagePanel;
