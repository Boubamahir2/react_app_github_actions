import React, { useState } from 'react'
import leftArrow from '../../assets/images/svg/left-arrow.svg'
import rightArrow from '../../assets/images/svg/right-arrow.svg'

// ici nous définissons la fonction Carousel qui prend un argument carouselPictures. carouselPictures est un tableau d'images qui représente les images du carrousel.
function Carousel({carouselPictures}) {
  // À l'intérieur de la fonction Carousel, nous utilisons le hook useState pour créer une variable d'état appelée indexPic et une fonction pour la mettre à jour appelée setIndexPic. La valeur initiale de indexPic est 0.
  const [indexPic, setIndexPic] = useState(0);

//  Ensuite, nous définissons deux fonctions, incrementImage et decrementImage, qui sont utilisées pour changer la valeur de indexPic en fonction de la direction de navigation du carrousel.
// incrementImage incrémente indexPic de 1 modulo la longueur du tableau carouselPictures. Cela permet de revenir à zéro lorsque indexPic atteint la fin du tableau.
// decrementImage décrémente indexPic de 1, mais si indexPic devient négatif, il est ajusté pour revenir à la dernière image du carrousel.
  const incrementImage = () => {
    setIndexPic((indexPic + 1) % carouselPictures.length);
  };

// Cette partie de l'expression calcule le nouvel index en ajoutant la longueur du tableau carouselPictures à l'index actuel (indexPic) et en soustrayant 1. Cela garantit que l'index résultant sera toujours positif ou nul.
// % carouselPictures.length : Cette partie de l'expression effectue l'opération modulo entre le résultat précédent et la longueur du tableau carouselPictures. L'opérateur modulo % renvoie le reste de la division. Cela permet de s'assurer que l'index résultant reste valide et reste à l'intérieur des limites du tableau. Si l'index est négatif, cette opération ajustera l'index pour revenir à la dernière image du carrousel.
// setIndexPic(...) : Cette ligne utilise la fonction setIndexPic fournie par le hook useState pour mettre à jour la valeur de l'index de l'image (indexPic). L'expression (indexPic + carouselPictures.length - 1) % carouselPictures.length est passée en argument à setIndexPic, ce qui entraîne la mise à jour de la valeur de indexPic avec le nouvel index calculé.
// En résumé, la fonction decrementImage décrémente l'index de l'image actuelle dans le carrousel en le calculant à partir de l'index actuel, de la longueur du tableau carouselPictures et de l'opération modulo. Cela permet de passer à l'image précédente dans le carrousel tout en assurant que l'index reste valide et ne dépasse pas les limites du tableau.
  const decrementImage = () => {
    setIndexPic(
      (indexPic + carouselPictures.length - 1) % carouselPictures.length
    );
  };

  // La fonction Carousel retourne un élément <div> avec la classe CSS 'carousel'. À l'intérieur de cette <div>, il y a :
// Une image représentant la flèche gauche avec la classe CSS 'left-arrow'. Si la longueur de carouselPictures est différente de 1, la classe 'left-arrow' est utilisée, sinon la classe 'arrow-invisible' est utilisée. L'événement onClick est associé à la fonction decrementImage, ce qui signifie que lorsque vous cliquez sur cette image, la fonction decrementImage est appelée.
// Une image représentant l'image du carrousel actuellement affichée, avec la source définie par carouselPictures[indexPic].
// Un élément <p> affichant la position de l'image actuelle par rapport au nombre total d'images du carrousel. Par exemple, s'il y a 5 images au total et que l'index actuel est 2, le texte affiché sera "2 / 5".
// Une image représentant la flèche droite avec la classe CSS 'right-arrow'. Tout comme la flèche gauche, la classe CSS utilisée dépend de la longueur de carouselPictures. L'événement onClick est associé à la fonction incrementImage, ce qui signifie que lorsque vous cliquez sur cette image, la fonction incrementImage est appelée.

  return (
    <div className='carousel'>
      <img
        src={leftArrow}
        alt='left'
        className={
          carouselPictures.length !== 1 ? 'left-arrow' : 'arrow-invisible'
        }
        onClick={decrementImage}
      />
      <img src={carouselPictures[indexPic]} alt='/' />
      <p className='quantity'>
        {indexPic + 1} / {carouselPictures.length}
      </p>
      <img
        src={rightArrow}
        alt='right'
        className={
          carouselPictures.length !== 1 ? 'right-arrow' : 'arrow-invisible'
        }
        onClick={incrementImage}
      />
    </div>
  );
}

export default Carousel