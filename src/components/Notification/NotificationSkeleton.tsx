import { Skeleton } from "../ui/skeleton";

const NotificationSkeleton = () => {
  return (
    <div className="flex flex-row py-[12px] pl-[16px] pr-[8px]">
      <Skeleton className="rounded-full min-w-[40px] min-h-[40px] mr-[12px] bg-gray-3" />
      <div className="flex flex-col justify-center w-full">
        <Skeleton className="w-[calc(100%-24px)] h-[12px] mb-[8px] bg-gray-3"/>
        <Skeleton className="w-[calc(30%)] h-[12px] bg-gray-3"/>
      </div>
    </div>
  );
};

export default NotificationSkeleton;
