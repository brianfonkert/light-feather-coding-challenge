import React from "react";
import classes from "./Header.module.css";

const Header = (props) => {
  //Header takes props to set the title.
  return (
    <header className={classes["main-header"]}>
      <h2>{props.title}</h2>
    </header>
  );
};

export default Header;
