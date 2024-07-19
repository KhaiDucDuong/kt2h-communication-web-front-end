import Image from "next/image";

const Contact = () => {
  return (
    <section
      className="h-[100px] x-full bg-dark-9 hover:bg-dark-1 hover:rounded-[8px] p-[10px]
    flex flex-row justify-between max-w-[472px] cursor-pointer"
    >
      <div
        className=" w-[77%] h-full
        flex flex-row justify-start max-w-[355px]"
      >
        <div className="flex flex-col justify-center mr-[6px]">
          <Image
            src="/assets/images/profile-pic.jpg"
            alt="contact's image"
            width={50}
            height={50}
            className="w-[80px] h-[80px] rounded-full max-sm:w-[60px] max-sm:h-[60px]"
          />
        </div>
        <div className="flex flex-col justify-between w-full max-w-[calc(100%-86px)]">
          <p className="text-gray-2 text-[24px]">Username</p>
          <p className="truncate text-gray-3 text-[20px]">
            hello my friend
          </p>
        </div>
      </div>
      <div className="min-w-[15%] h-full bg-white"></div>
    </section>
  );
};

export default Contact;
