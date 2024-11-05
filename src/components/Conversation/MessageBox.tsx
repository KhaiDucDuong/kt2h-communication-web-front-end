import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { ImageIcon, SendHorizontalIcon, StickerIcon, PaperclipIcon, EllipsisIcon, SmileIcon } from "lucide-react";
import { ChangeEvent, useContext, useState, useEffect } from "react";
import { User } from "@/types/user";
import Image from 'next/image';
import { SocketContext } from "@/app/dashboard/page";
import { uploadImage } from "@/services/MessageService";

interface MessageBoxProps {
  currentUser: User;
  contactId: string;
}

const MessageBox = (props: MessageBoxProps) => {
  const [text, setText] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const context = useContext(SocketContext);

  const handleSendMessage = async () => {
    if (!context || !context?.stompClient) {
      console.log("Missing socket context or stomp client. Cannot send message.");
      return;
    }

    let messageBody: any;

    // Nếu có ảnh được chọn, thực hiện upload
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);

      try {
        const uploadResult = await uploadImage(formData);
        
        // Kiểm tra kết quả upload
        if (uploadResult.imageUrl) {
          messageBody = {
            conversation_id: props.contactId,
            sender_id: props.currentUser.user_id,
            message_type: "IMAGE",
            message: text,
            image_url: uploadResult.imageUrl,
          };
          setImageUrl(null);
        } else {
          console.error("Image upload failed:", uploadResult.serverErrors);
          return; // Không gửi thông điệp nếu upload thất bại
        }
      } catch (error) {
        console.error("Lỗi khi upload ảnh và gửi tin nhắn:", error);
        return; // Không gửi thông điệp nếu có lỗi
      }
    } else {
      // Gửi thông điệp văn bản nếu không có hình ảnh
      messageBody = {
        conversation_id: props.contactId,
        sender_id: props.currentUser.user_id,
        message_type: "TEXT",
        message: text,
      };
    }

    // Gửi thông điệp qua WebSocket
    context.stompClient.publish({
      destination: "/app/private-message",
      body: JSON.stringify(messageBody),
    });

    // Reset các trường sau khi gửi
    setText("");
    setImageUrl(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && (text.trim().length > 0 || imageFile)) {
      handleSendMessage();
    }
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file); // Tạo URL blob tạm thời
      setImageUrl(previewUrl);
    }
  };

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl); // Hủy URL blob khi component unmount
      }
    };
  }, [imageUrl]);



  return (
    <section className="h-fit w-full bg-gray-6 flex flex-col">
      <div>{String(imageFile)}</div>
      {/* Khung preview ảnh bên trái */}
      {imageUrl && (
        <div className="mb-2 w-fit flex items-start ml-2 mt-2">
          <div className="relative w-[100px] h-[100px] flex items-center justify-center">
            <img
              src={imageUrl}
              alt="Image preview"
              className="object-cover w-full h-full rounded-lg"
            />
            {/* Nút xóa ảnh */}
            <button
              className="absolute top-[-8px] right-[-8px] w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md text-black font-bold"
              onClick={() => setImageUrl(null)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
      <div className="h-[40px] border-t-[1px] border-b-[1px] border-dark-10 flex flex-col justify-center">
        <div className="pl-[22px] flex flex-row">
          <div
            className="w-[30px] h-[30px] cursor-pointer rounded-[5px] mr-[8px] hover:bg-gray-1 flex justify-center"
            onClick={() => {}}
          >
            <StickerIcon className="text-gray-4 m-auto" strokeWidth={1.7} width={24} height={24} />
          </div>
          <div
            className="w-[30px] h-[30px] cursor-pointer rounded-[5px] mr-[8px] hover:bg-gray-1 flex justify-center"
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <ImageIcon className="text-gray-4 m-auto" strokeWidth={1.7} width={24} height={24} />
            <input
              type="file"
              accept="image/*"
              id="file-upload"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
          </div>
          <div
            className="w-[30px] h-[30px] cursor-pointer rounded-[5px] mr-[8px] hover:bg-gray-1 flex justify-center"
            onClick={() => {}}
          >
            <PaperclipIcon className="text-gray-4 m-auto" strokeWidth={1.7} width={22} height={22} />
          </div>
          <div
            className="w-[30px] h-[30px] cursor-pointer rounded-[5px] mr-[8px] hover:bg-gray-1 flex justify-center"
            onClick={() => {}}
          >
            <EllipsisIcon className="text-gray-4 m-auto" strokeWidth={1.7} width={24} height={24} />
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
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <div className="h-[40px] w-fit flex flex-row self-center mr-[8px]">
          <div
            className="w-[30px] h-[30px] m-auto cursor-pointer rounded-[5px] mr-[8px] hover:bg-gray-1 flex justify-center"
            onClick={() => {}}
          >
            <SmileIcon className="text-gray-4 m-auto" strokeWidth={1.7} width={24} height={24} />
          </div>
          <div
            className="w-[30px] h-[30px] m-auto cursor-pointer rounded-[5px] mr-[8px] hover:bg-gray-1 flex justify-center"
            onClick={handleSendMessage}
          >
            {text.length > 0 || imageFile ? (
              <SendHorizontalIcon className="text-gray-4 m-auto" strokeWidth={1.7} width={24} height={24} />
            ) : (
              <Image src={"/assets/images/penguin.png"} width={24} height={24} alt="penguin icon" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MessageBox;
