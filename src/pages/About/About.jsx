import React from "react";
import Banner from "../../components/Banner/Banner";
import Dropdown from "../../components/DropDown/Dropdown";

function About({dataAbout}) {

  return (
    <div className="about">
      <Banner origin='about'/>
      <div className="otherInfo">
        {
          dataAbout.map((item, index) => (
            <Dropdown key={index} title={item.title} content={item.description}/>
          ))
        }
      </div>
    </div>
  );
}

export default About;
