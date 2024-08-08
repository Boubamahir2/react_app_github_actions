import downArrow from "../../assets/images/svg/dow-arrow.svg";
import upArrow from "../../assets/images/svg/up-arrow.svg";
import React, { useState } from "react";

const Dropdown = ({id, title, content }) => {
  const [isActive, setIsActive] = useState(true);
//   La fonction displayContent est définie pour inverser la valeur de isActive en utilisant la fonction setIsActive. Lorsque cette fonction est appelée, elle exécute setIsActive(!isActive), ce qui inverse la valeur actuelle de isActive. Si isActive était true, elle devient false, et vice versa.
// En résumé, lorsque displayContent est appelée, elle change l'état de isActive
  const displayContent = () => {
    setIsActive(!isActive);
  };

  return (
    <>
      <div key={id} className="accordion">
        <div className="accordion__header">
          <h3>{title}</h3>
          <img
            src={isActive ? downArrow : upArrow}
            alt=""
            onClick={displayContent}
          />
        </div>
        {!isActive ? (
          <div className="accordion__contentDisplay">
            <p>{content}</p>
          </div>
        ) : (
          <div className="accordion__content">
            <p>{content}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Dropdown;