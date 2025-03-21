'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaInstagram } from 'react-icons/fa';
import { BsTwitterX } from 'react-icons/bs';
import { FaFacebookF } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import '@/app/styles/layout.css';

const Footer = () => {
  const pathname = usePathname();
  const isVisible = !pathname.includes('services/details');

  return (
    <>
      {isVisible && (
        <div className="footer flex flex-col pt-8 footer-bg">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 w-full py-4 px-4 gap-4 sm:gap-0 sm:py-6">
              <div className="flex flex-col items-center gap-2 justify-center mb-4 sm:justify-start sm:items-start sm:mb-0">
                <Link className="btn btn-ghost text-xl" href="/">
                  <Image src="/images/logo.png" alt="Logo" width={35} height={35} priority />
                  {/* <Image className="dark:invert" src="/images/logo.png" alt="Logo" width={35} height={35} priority /> */}
                </Link>
                <p className="text-gray-200 text-center sm:text-left">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>
              </div>
              <div className="flex justify-center items-end mb-6 sm:mb-0">
                <ul className="flex flex-col gap-2">
                  <li>
                    <Link className="link text-white font-light" href="/about">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link className="link text-white font-light" href="/services">
                      Services
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="flex justify-center items-center sm:justify-end">
                <ul className="flex flex-row gap-6 sm:gap-2">
                  <li>
                    <a className="link text-white font-light" href="https://www.instagram.com/hanna_beauty_studio_macau?igsh=Z29qbHp1dzd3bDZ3" target="_blank" rel="noopener noreferrer">
                      <FaInstagram className="w-[24px] h-[24px]" />
                    </a>
                  </li>
                  {/* <li>
                    <a className="link text-white font-light">
                      <BsTwitterX className="w-[24px] h-[24px]" />
                    </a>
                  </li> */}
                  <li>
                    <a className="link text-white font-light" href="https://www.facebook.com/profile.php?id=100093903774039&mibextid=LQQJ4d" target="_blank" rel="noopener noreferrer">
                      <FaFacebookF className="w-[24px] h-[24px]" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="text-white flex justify-center items-center font-extralight p-4 border-t-[1px] border-solid border-white/15 w-full">
            &copy;2025 - Nail Shop Online System. All rights reserved.
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
