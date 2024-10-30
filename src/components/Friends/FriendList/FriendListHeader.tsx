import { Contact2Icon } from "lucide-react";
const FriendListHeader = () => {
  return (
    <div className="h-[98px] w-full">
      <div className="h-full flex flex-row justify-start items-center pl-[19px]">
        <Contact2Icon
          className="text-gray-2 mr-[8px]"
          strokeWidth={1.7}
          width={30}
          height={30}
        />
        <p className="text-[16px] text-gray-2">Friend list</p>
      </div>
      <div className="relative flex  border-dark-10 border-[1px] "></div>
    </div>
  );
};

export default FriendListHeader;
