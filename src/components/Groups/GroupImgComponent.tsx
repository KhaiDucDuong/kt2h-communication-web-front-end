import Image from "next/image";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { GroupProp } from "@/types/group";
import React from "react";

const GroupImgComponent = (props: GroupProp) => {
        const {group_image,group_name,group_owner,group_id } = props;
        const [isHovered, setIsHovered] = React.useState(false);

    return(
        <section
        className={cn("h-[70px] bg-dark-10 hover:bg-dark-1 hover:rounded-[8px] p-[10px] ",
      " max-w-[472px] cursor-pointer mb-[2px]", props.className)}
      onClick={props.handleClick}
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
      >
          <div className="flex flex-col justify-center">
            <Image
              src={props.group_image ? props.group_image : "/assets/images/group-chat-default.png"}
              alt="contact's image"
              width={50}
              height={50}
              className="w-[50px] h-[50px] rounded-full"
            />
          </div>
          {isHovered && (
        <div className="absolute left-[80px]  transform -translate-y-full bg-black text-white px-2 py-1 rounded-md whitespace-nowrap shadow-lg">  
         {group_name}
        </div>
      )}
      </section>
    )
}

export default GroupImgComponent