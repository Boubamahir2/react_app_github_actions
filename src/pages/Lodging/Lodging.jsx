import React from "react";
import { Navigate, useParams } from "react-router-dom";
import Carousel from "../../components/Carousel/Carousel";
import Dropdown from "../../components/DropDown/Dropdown";
import InfosAppart from "../../components/InfosAppart/InfosAppart";
import NotFound from "../NotFound/NotFound";

function Lodging({ apparts }) {
  const { id } = useParams();
  const appart = apparts.find((appart) => appart.id === id);

  return appart ? (
    <div className="lodging">
      <Carousel carouselPictures={appart.pictures} />
      <InfosAppart appart={appart} />
      <div className="otherInfo">
        <Dropdown key={appart.id} title="Description" content={appart.description} />
        <Dropdown
          title="Equipements"
          content={appart.equipments.map((equi, index) => {
            return <li key={index}>{equi}</li>;
          })}
        />
      </div>
    </div>
  ) : (
    <Navigate to="/error" replace={<NotFound />} />
  );
}

export default Lodging;
