import { cn } from "@/lib/utils";
import { LucideProps } from "lucide-react";
import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";
import { FriendTab } from "./Friends";

const FriendsSidePanelOption = (props: {
  tab: FriendTab;
  isActive: boolean;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  setCurrentTab: Dispatch<SetStateAction<FriendTab>>;
}) => {
  const {tab, isActive, setCurrentTab} = props;
  return (
    <div
      className={cn(
        "w-full h-[80px] cursor-pointer hover:bg-dark-1 flex flex-start",
        isActive && "bg-dark-1"
      )}
      onClick={()=>{setCurrentTab(tab)}}
    >
      <div className="w-[88%] m-auto flex">
        <div>
          <props.icon
            className="text-gray-2 m-auto mr-[20px]"
            strokeWidth={1.7}
            width={30}
            height={30}
          />
        </div>
        <p className="text-gray-2 text-[18px]">{tab.valueOf()}</p>
      </div>
    </div>
  );
};

export default FriendsSidePanelOption;
