import cooked from '../../assets/LandingPage/cooked.jpg'; // Example paths
import croissants from '../../assets/LandingPage/croissants.jpg';
import food from '../../assets/LandingPage/food.jpg';
import jollof from '../../assets/LandingPage/jollof.jpg';
import packaged from '../../assets/LandingPage/packaged.jpg';
import pizza from '../../assets/LandingPage/pizza.jpg';
import tomato from '../../assets/LandingPage/tomato.jpg';

const getCategoryStyles = (category) => {
  switch (category?.toLowerCase()) {
    case 'cooked':
      return { img: cooked, label: 'Cooked Meal' };
    case 'bakery':
      return { img: croissants, label: 'Croissants' };
    case 'jollof':
      return { img: jollof, label: 'Jollof Rice' };
    case 'packaged':
      return { img: packaged, label: 'Packed Food' };
    case 'pizza':
      return { img: pizza, label: 'Pizza' };
    case 'tomato':
      return { img: tomato, label: 'Peper' };
    default:
      return { img: food, label: 'Grocery' };
  }
};

export default getCategoryStyles;