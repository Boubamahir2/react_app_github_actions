import React from "react";
import banner from '../../assets/images/banner.png';
import bannerAbout from '../../assets/images/BannerAbout.png';

function Banner(props) {
  return props.origin === 'home' ? (
    <div className='banner'>
      <img className='banner_img' src={banner} alt='Bannière paysage' />
      <h2 className='banner_title'>Chez vous, partout et ailleurs</h2>
    </div>
  ) : (
    <div className='banner'>
      <img className='banner_img' src={bannerAbout} alt='Bannière paysage' />
    </div>
  );
}

export default Banner;
