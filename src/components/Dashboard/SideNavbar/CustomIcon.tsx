"use client";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import clsx from "clsx";

function CustomIcon(props: {
  faIcon: IconDefinition;
  fontSize: number;
  isSelected: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={clsx("w-full h-[64px] flex justify-center hover:cursor-pointer", {
        "bg-dark-1": props.isSelected === true || isHovered === true,
      })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <FontAwesomeIcon
        icon={props.faIcon}
        fontSize={props.fontSize !== undefined ? props.fontSize : 24}
        className={clsx("m-auto", {
          "text-gray-100": props.isSelected === true || isHovered === true,
          "text-gray-400": props.isSelected === false && isHovered === false,
        })}
      />
    </div>
  );
}

export default CustomIcon;
