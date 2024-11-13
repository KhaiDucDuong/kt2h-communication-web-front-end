import { Skeleton } from "../ui/skeleton";

const ContactSkeleton = () => {
  return (
    <section
      className="h-[70px] bg-dark-9 hover:bg-dark-1 hover:rounded-[8px] p-[10px] 
      flex flex-row justify-between max-w-[472px] cursor-pointer mb-[2px]"
    >
      <div
        className=" w-[77%] h-full
        flex flex-row justify-start max-w-[355px]"
      >
        <div className="flex flex-col justify-center mr-[6px]">
          <Skeleton className="w-[50px] h-[50px] rounded-full bg-gray-1" />
        </div>
        <div className="ml-[4px] text-[13px] flex flex-col justify-between w-full max-w-[calc(100%-86px)]">
          <Skeleton className="h-[1.2em] w-[80%] bg-gray-3" />
          <Skeleton className="h-[1em] w-[30%] bg-gray-3" />
        </div>
      </div>
      <div
        className="min-w-[15%] h-full 
      flex flex-col justify-between pb-[5px]"
      >
        <Skeleton className="text-[13px] h-[1em] bg-gray-3" />

        <Skeleton
          className="self-end rounded-full w-[27px] h-[24px] bg-gray-3"
        />
      </div>
    </section>
  );
};

export default ContactSkeleton;
