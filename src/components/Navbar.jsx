import { useState } from 'react';
import { close, logo, menu } from '../assets';
import { navLinks } from '../constants';

const Navbar = () => {
  const [active, setActive] = useState('Home');
  const [toggle, setToggle] = useState(false);
  return (
    <nav className='w-full flex py-6 justify-between items-center navbar'>
      <img src={logo} alt='hoobank' className='w-[124px] h-[32px]' />
      <ul className='list-none sm:flex hidden justify-end items-center flex-1'>
        {navLinks.map((navLink, index) => (
          <li
            key={navLink.id}
            className={`font-poppins font-normal cursor-pointer p-1 tex-[16px] ${
              active === navLink.title ? 'text-white' : 'text-dimWhite'
            } ${index === navLinks.length - 1 ? 'mr-0' : 'mr-10'}`}
            onClick={() => setActive(navLink.title)}
          >
            <a href={`#${navLink.id}`}>{navLink.title}</a>
          </li>
        ))}
      </ul>

      <div className='sm:hidden flex flex-1 justify-end items-center'>
        <img
          src={toggle ? close : menu}
          className='w-[28px] h-[30px] object-contain'
          alt='menu'
          onClick={() => setToggle((prev) => !prev)}
        />
        <div
          className={`${
            !toggle ? 'hidden' : 'flex'
          }  p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar  `}
        >
          <ul className='list-none flex justify-end flex-1 flex-col'>
            {navLinks.map((navLink, index) => (
              <li
                key={navLink.id}
                className={`font-poppins font-normal cursor-pointer p-1 tex-[16px] ${
                  active === navLink.title ? 'text-white' : 'text-dimWhite'
                } ${index === navLinks.length - 1 ? 'mr-0' : 'mr-4'}`}
                onClick={() => setActive(navLink.title)}
              >
                <a href={`#${navLink.id}`}>{navLink.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
