import Image from "next/image";

const FriendRow = (props: {
  id: string;
  firstName: string;
  lastName: string;
  image: string;
  status: string;
}) => {
  return (
    <section
      className="w-[96%] h-[72px] hover:bg-dark-1 hover:rounded-[8px]
    px-[14px] self-center flex flex-row justify-between cursor-pointer relative"
    >
      <div className="w-[calc(100%-28px)] h-[1px] absolute border-t-[1px] border-dark-1"></div>
      <div className="flex flex-row">
        <div className="self-center">
          <Image
            src={
              props.image !== null
                ? props.image
                : "/assets/images/profile-pic.jpg"
            }
            alt={props.firstName + " " + props.lastName + "s profile pic"}
            width={50}
            height={50}
            className="rounded-full mr-[10px]"
          />
        </div>
        <div className="self-center">
          <p className="text-gray-4 font-bold">
            {props.firstName + " " + props.lastName}
          </p>
          <p className="text-gray-5">{props.status}</p>
        </div>
      </div>
      <div className="self-center flex flex-row">
        <div className="mr-[8px]">Message Button</div>
        <div>Elipsis Button</div>
      </div>
    </section>
  );
};

export default FriendRow;
