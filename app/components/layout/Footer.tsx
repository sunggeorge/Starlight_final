'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaInstagram } from 'react-icons/fa';
import { FaFacebookF } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import '@/app/styles/layout.css';

const Footer = () => {
  const pathname = usePathname();
  const isVisible = !pathname.includes('services/details');

  return (
    <>
      {isVisible && (
        <div className="footer flex flex-col pt-2 footer-bg">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 w-full py-1 px-4 gap-2">
              <div className="flex flex-col items-center gap-1 justify-center sm:justify-start sm:items-start">
                <Link className="btn btn-ghost btn-sm p-0 min-h-8 h-8" href="/">
                  <Image src="/images/logo.png" alt="Logo" width={30} height={30} priority />
                </Link>
                <p className="text-gray-200 text-sm text-center sm:text-left">
                  Hanna Beauty Studio
                </p>
              </div>
              <div className="flex justify-end items-center w-full col-span-2">
                <ul className="flex flex-row gap-4">
                  <li>
                    <a className="link text-white font-light hover:text-gray-300" href="https://www.instagram.com/hanna_beauty_studio_macau?igsh=Z29qbHp1dzd3bDZ3" target="_blank" rel="noopener noreferrer">
                      <FaInstagram className="w-[20px] h-[20px]" />
                    </a>
                  </li>
                  <li>
                    <a className="link text-white font-light hover:text-gray-300" href="https://www.facebook.com/profile.php?id=100093903774039&mibextid=LQQJ4d" target="_blank" rel="noopener noreferrer">
                      <FaFacebookF className="w-[20px] h-[20px]" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="text-white flex justify-center items-center font-extralight text-sm p-1 border-t-[1px] border-solid border-white/15 w-full">
            &copy;2025 - Hanna Nail Salon System. All rights reserved.
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
