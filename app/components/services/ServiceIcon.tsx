'use client';

import React from 'react';
import { ServiceCategory } from '../../lib/constants/service';

import { TbHandThreeFingers } from "react-icons/tb";
import { PiFlowerTulipBold } from "react-icons/pi";
import { GiEyelashes } from "react-icons/gi";
import { BiCool } from "react-icons/bi";

interface ServiceIconProps {
  type: ServiceCategory;
}

const ServiceIcon: React.FC<ServiceIconProps> = ({ type }) => {
  return (
    <>
      {type === ServiceCategory.nail && <TbHandThreeFingers />}
      {type === ServiceCategory.nail_art && <PiFlowerTulipBold />}
      {type === ServiceCategory.eyelash_extensions && <GiEyelashes />}
      {type === ServiceCategory.keratin_eyelash && <BiCool />}

    </>
  );
};

export default ServiceIcon;
