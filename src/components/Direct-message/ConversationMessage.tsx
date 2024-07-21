import Image from "next/image";
import { forwardRef } from "react";

interface ConversationMessageProps {

}

const ConversationMessage = (props : ConversationMessageProps) => {
  return (
    <section className="flex flex-row mb-">
      <div className="w-[40px] mr-[10px]">
        <Image
          src="/assets/images/profile-pic.jpg"
          alt="contact's image"
          width={50}
          height={50}
          className="w-[40px] h-[40px] rounded-full"
        />
      </div>
      <div className="w-fit max-w-[70%]  flex flex-col">
        <div className="flex flex-row mb-[5px]">
          <p className="text-gray-5 text-[13px]">
            <span className="text-gray-4 text-[16px] mr-[0.5em] cursor-pointer">
              Tien
            </span>
            10 July 2024 5:55 AM
          </p>
        </div>
        <div className="rounded-[8px] bg-gray-5 px-[12px] py-[8px] mb-[4px]">
          <p className="wrap text-dark-9">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
        <div className="rounded-[8px] bg-gray-5 px-[12px] py-[8px] mb-[4px]">
          <p className="wrap text-dark-9">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ConversationMessage;
