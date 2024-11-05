import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import {
  EllipsisIcon,
  ImageIcon,
  PaperclipIcon,
  SendHorizontalIcon,
  SmileIcon,
  StickerIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { ChangeEvent, useContext, useState } from "react";
import { Client } from "@stomp/stompjs";
import { User } from "@/types/user";
import { SocketContext } from "@/types/context";

interface MessageBoxProps {
  currentUser: User;
  contactId: string;
}

const MessageBox = (props: MessageBoxProps) => {
  const [text, setText] = useState<string>("");
  const context = useContext(SocketContext);

  const handleSendMessage = () => {
    if (!context || !context?.stompClient) {
      console.log(
        "Missiing socket context or stomp client. Cannot send message."
      );
      return;
    }
    
    context.stompClient.publish({
      destination: "/app/private-message",
      body: JSON.stringify({
        conversation_id: props.contactId,
        sender_id: props.currentUser.user_id,
        message_type: "TEXT",
        message: text,
      }),
    });
    setText("");
    (document.getElementById("message-box") as HTMLInputElement).value = "";
  };

  return (
    <section className="h-fit w-full bg-gray-6 flex flex-col">
      <div
        className="h-[40px] border-t-[1px] border-b-[1px] border-dark-10
        flex flex-col justify-center"
      >
        <div className="pl-[22px] flex flex-row">
          <div
            className="w-[30px] h-[30px] cursor-pointer rounded-[5px] mr-[8px] hover:bg-gray-1 flex justify-center"
            onClick={() => {}}
          >
            <StickerIcon
              className="text-gray-4 m-auto"
              strokeWidth={1.7}
              width={24}
              height={24}
            />
          </div>
          <div
            className="w-[30px] h-[30px] cursor-pointer rounded-[5px] mr-[8px] hover:bg-gray-1 flex justify-center"
            onClick={() => {}}
          >
            <ImageIcon
              className="text-gray-4 m-auto"
              strokeWidth={1.7}
              width={24}
              height={24}
            />
          </div>
          <div
            className="w-[30px] h-[30px] cursor-pointer rounded-[5px] mr-[8px] hover:bg-gray-1 flex justify-center"
            onClick={() => {}}
          >
            <PaperclipIcon
              className="text-gray-4 m-auto"
              strokeWidth={1.7}
              width={22}
              height={22}
            />
          </div>
          <div
            className="w-[30px] h-[30px] cursor-pointer rounded-[5px] mr-[8px] hover:bg-gray-1 flex justify-center"
            onClick={() => {}}
          >
            <EllipsisIcon
              className="text-gray-4 m-auto"
              strokeWidth={1.7}
              width={24}
              height={24}
            />
          </div>
        </div>
      </div>
      <div className="h-fit min-h-[50px] flex justify-center">
        <input
          className="w-[calc(100%-20px)] h-fit max-h-[180px] m-auto ml-[20px] border-none bg-transparent
          focus:outline-none placeholder:text-gray-1 text-gray-2"
          id="message-box"
          type="text"
          placeholder="Type something ..."
          defaultValue={text}
          onChange={(e) => setText(e.target.value)}
        ></input>
        <div className="h-[40px] w-fit flex flex-row self-center mr-[8px]">
          <div
            className="w-[30px] h-[30px] m-auto cursor-pointer rounded-[5px] mr-[8px] hover:bg-gray-1 flex justify-center"
            onClick={() => {}}
          >
            <SmileIcon
              className="text-gray-4 m-auto"
              strokeWidth={1.7}
              width={24}
              height={24}
            />
          </div>
          <div
            className="w-[30px] h-[30px] m-auto cursor-pointer rounded-[5px] mr-[8px] hover:bg-gray-1 flex justify-center"
            onClick={() => {}}
          >
            {text.length > 0 ? (
              <SendHorizontalIcon
                className="text-gray-4 m-auto"
                strokeWidth={1.7}
                width={24}
                height={24}
                onClick={handleSendMessage}
              />
            ) : (
              // <ThumbsUpIcon
              //   className="text-gray-4 m-auto"
              //   strokeWidth={1.7}
              //   width={24}
              //   height={24}
              // />
              <Image
                src={"/assets/images/penguin.png"}
                width={24}
                height={24}
                alt="penguin icon"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MessageBox;
