import { ChangeEvent, useContext, useState, useEffect } from "react";
import { ImageIcon, SendHorizontalIcon, StickerIcon, PaperclipIcon, EllipsisIcon } from "lucide-react";
import { User } from "@/types/user";
import { SocketContext } from "@/types/context";
import { uploadImage } from "@/services/MessageService";
import Image from "next/image";

interface MessageBoxProps {
  currentUser: User;
  contactId: string;
}

const MessageBox = (props: MessageBoxProps) => {
  const [text, setText] = useState<string>("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const context = useContext(SocketContext);

  const handleSendMessage = async () => {
    if (!context || !context?.stompClient) {
      console.log("Missing socket context or stomp client. Cannot send message.");
      return;
    }

    let messageBody: any;

    // Kiểm tra nếu có ảnh và cả tin nhắn văn bản
    if (imageFiles.length > 0 && text.trim().length > 0) {
      try {
        let uploadedImageUrls: string[] = [];

        // Upload từng ảnh
        for (const file of imageFiles) {
          const formData = new FormData();
          formData.append("file", file);

          const uploadResult = await uploadImage(formData);
          if (uploadResult.body.imageUrls) {
            uploadedImageUrls.push(...uploadResult.body.imageUrls);
          } else {
            console.error("Image upload failed:", uploadResult.serverErrors);
            return;
          }
        }

        messageBody = {
          conversation_id: props.contactId,
          sender_id: props.currentUser.user_id,
          message_type: "IMAGE_AND_TEXT",
          message: text,
          image_urls: uploadedImageUrls,
        };
        setImageFiles([]);
        setImageUrls([]);
      } catch (error) {
        console.error("Lỗi khi upload ảnh và gửi tin nhắn:", error);
        return;
      }
    } else if (imageFiles.length > 0) {
      // Gửi chỉ ảnh
      try {
        let uploadedImageUrls: string[] = [];

        // Upload từng ảnh
        for (const file of imageFiles) {
          const formData = new FormData();
          formData.append("file", file);

          const uploadResult = await uploadImage(formData);
          if (uploadResult.body) {
            uploadedImageUrls.push(...uploadResult.body.imageUrls);
          } else {
            console.error("Image upload failed:", uploadResult.serverErrors);
            return;
          }
        }

        messageBody = {
          conversation_id: props.contactId,
          sender_id: props.currentUser.user_id,
          message_type: "IMAGE",
          message: text,
          image_urls: uploadedImageUrls,
        };
        setImageFiles([]);
        setImageUrls([]);
      } catch (error) {
        console.error("Lỗi khi upload ảnh và gửi tin nhắn:", error);
        return;
      }
    } else {
      // Gửi chỉ tin nhắn văn bản
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
    setImageUrls([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && (text.trim().length > 0 || imageFiles.length > 0)) {
      handleSendMessage();
    }
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setImageFiles(prev => [...prev, ...fileArray]);

      const previewUrls = fileArray.map(file => URL.createObjectURL(file));
      setImageUrls(prev => [...prev, ...previewUrls]);
    }
  };

  useEffect(() => {
    return () => {
      // Giải phóng URL blob khi component unmount
      imageUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imageUrls]);

  const handleRemoveImage = (index: number) => {
    const updatedImages = imageFiles.filter((_, i) => i !== index);
    const updatedUrls = imageUrls.filter((_, i) => i !== index);
    setImageFiles(updatedImages);
    setImageUrls(updatedUrls);
  };

  return (
    <section className="h-fit w-full bg-gray-6 flex flex-col">
      {/* Khung preview ảnh bên trái */}
      {imageUrls.length > 0 && (
        <div className="mb-2 w-fit flex flex-wrap ml-2 mt-2">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative w-[100px] h-[100px] flex items-center justify-center mr-2 mb-2">
              <Image
                src={url} // URL.createObjectURL trả về một URL hợp lệ
                alt={`Image preview ${index}`}
                layout="fill" // Sử dụng layout fill để ảnh tự động điền vào phần tử chứa
                objectFit="cover" // Đảm bảo ảnh không bị méo
                className="rounded-lg"
              />
              {/* Nút xóa ảnh */}
              <button
                className="absolute top-[-8px] right-[-8px] w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md text-black font-bold"
                onClick={() => handleRemoveImage(index)}
              >
                &times;
              </button>
            </div>
          ))}
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
              multiple // Cho phép chọn nhiều tệp
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
        <div
          className="w-[50px] h-[50px] cursor-pointer flex items-center justify-center ml-2 bg-primary-1 text-white rounded-[5px] hover:bg-primary-2"
          onClick={handleSendMessage}
        >
          <SendHorizontalIcon className="w-[25px] h-[25px]" />
        </div>
      </div>
    </section>
  );
};

export default MessageBox;
