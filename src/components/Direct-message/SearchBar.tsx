"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input } from "../ui/input";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const SearchBar = (props: {
  placeHolder: string
}) => {
  return (
    <section className="flex flex-col justify-center m-auto size-full">
      <div className=" flex relative justify-start mx-[5%]">
        <FontAwesomeIcon icon={faSearch} className="text-gray-1 absolute top-[30%] left-[14px] hover:text-gray-50 cursor-pointer" 
        onClick={() => {}}/>
        <Input
          type="text"
          placeholder={props.placeHolder}
          className="w-[100%] bg-dark-10 text-gray-1 border-none pl-[38px]
         focus-visible:ring-0 placeholder:text-gray-1"
        />
      </div>
    </section>
  );
};

export default SearchBar;
