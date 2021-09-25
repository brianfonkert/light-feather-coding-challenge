import classes from "./Card.module.css";

const Card = (props) => {
  //Card is a wrapper-style element to contain elements in a stylized way.
  return (
    <div className={`${classes.card} ${props.className}`}>{props.children}</div>
  );
};

export default Card;
