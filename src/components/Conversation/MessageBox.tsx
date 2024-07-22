import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { EllipsisIcon, ImageIcon, PaperclipIcon, StickerIcon } from "lucide-react";

const MessageBox = () => {
  return (
    <section className="h-fit w-full bg-gray-6 flex flex-col">
      <div
        className="h-[40px] border-t-[1px] border-b-[1px] border-dark-10
        flex flex-col justify-center"
      >
        {/* <FontAwesomeIcon icon={faSearch} className="text-gray-1 hover:text-gray-50 cursor-pointer" 
        onClick={() => {}}/> */}
        <div className="pl-[22px] flex flex-row">
          {/* <Image
            src={"/assets/images/sticker.svg"}
            width={40}
            height={40}
            alt="sticker icon"
            className="w-[20px] h-[20px] "
          /> */}
          <div
            className="w-[30px] h-[30px] cursor-pointer rounded-[5px] mr-[8px] hover:bg-gray-1 flex justify-center"
            onClick={() => {}}
          >
            <StickerIcon className="text-gray-4 m-auto" strokeWidth={1.7} width={24} height={24}/>
          </div>
          <div
            className="w-[30px] h-[30px] cursor-pointer rounded-[5px] mr-[8px] hover:bg-gray-1 flex justify-center"
            onClick={() => {}}
          >
            <ImageIcon className="text-gray-4 m-auto" strokeWidth={1.7} width={24} height={24}/>
          </div>
          <div
            className="w-[30px] h-[30px] cursor-pointer rounded-[5px] mr-[8px] hover:bg-gray-1 flex justify-center"
            onClick={() => {}}
          >
            <PaperclipIcon className="text-gray-4 m-auto" strokeWidth={1.7} width={22} height={22}/>
          </div>
          <div
            className="w-[30px] h-[30px] cursor-pointer rounded-[5px] mr-[8px] hover:bg-gray-1 flex justify-center"
            onClick={() => {}}
          >
            <EllipsisIcon className="text-gray-4 m-auto" strokeWidth={1.7} width={24} height={24}/>
          </div>
        </div>
      </div>
      <div className="h-[50px] max-h-[180px]"></div>
    </section>
  );
};

export default MessageBox;
