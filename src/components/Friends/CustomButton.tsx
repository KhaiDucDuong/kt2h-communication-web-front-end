import { cn } from "@/lib/utils";
import { LucideProps } from "lucide-react";
import React, {
  ForwardRefExoticComponent,
  RefAttributes,
  useState,
} from "react";

const CustomButton = (props: {
  isHovered: boolean;
  iconComponent: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  text: string;
  hoverColor: string;
  filled: boolean;
  onClick: () => void;
}) => {
  const [btnHovered, setBtnHovered] = useState<boolean>(false);
  return (
    <div className="self-center flex flex-row">
      <div className="relative self-center flex flex-row justify-center">
        <div
          className={cn(
            "rounded-full bg-dark-1 p-[8px] text-gray-4",
            `hover:text-${props.hoverColor}`,
            props.isHovered && "bg-dark-8"
          )}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          onClick={() => props.onClick()}
        >
          {props.filled ? (
            <props.iconComponent
              className="m-auto"
              strokeWidth={1.7}
              width={24}
              height={24}
              fill={btnHovered ? props.hoverColor : "#e4e4e4"}
            />
          ) : (
            <props.iconComponent
              className="m-auto"
              strokeWidth={1.7}
              width={24}
              height={24}
            />
          )}
        </div>
        <div
          className={cn(
            "self-center absolute top-[-125%]  left-[calc(-(25%-4px))] rounded-[6px] ",
            "p-[8px] w-fit min-w-[60px] text-center bg-dark-8 text-[13px] text-white invisible ",
            btnHovered && "visible"
          )}
        >
          <span>{props.text}</span>
          <div
            className="absolute top-[100%] left-[calc(50%-5px)]
              border-l-[5px] border-x-transparent border-x-solid border-r-[5px] 
              border-t-[5px] border-t-solid border-t-dark-8"
          ></div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default CustomButton;
