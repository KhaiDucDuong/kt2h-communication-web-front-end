import { cn } from "@/lib/utils";
import { LucideProps } from "lucide-react";
import Link from "next/link";
import React from "react";

const FriendsSidePanelOption = (props: {
  name: string;
  url: string;
  isActive: boolean;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}) => {
  return (
    <Link
      className={cn(
        "w-full h-[80px] cursor-pointer hover:bg-dark-1 flex flex-start",
        props.isActive && "bg-dark-1"
      )}
      href={props.url}
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
        <p className="text-gray-2 text-[18px]">{props.name}</p>
      </div>
    </Link>
  );
};

export default FriendsSidePanelOption;
