"use client";

import React from "react";
import Image from "next/image";
interface LogoProps {
  image?: string;
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({ width, height, image }) => {
  return (
    <Image
      src={image||"https://res.cloudinary.com/dt3mokrx9/image/upload/c_limit,w_384/f_auto/q_auto/v1/eddie_profile_pic_480_le2wvc?_a=BAVAZGBz0"}
      width={width}
      height={height}
      alt="Eddie Villanueva"
      className=" grayscale-7 drop-shadow-md shadow-md rounded-full"
    />
  );
};

export default Logo;
