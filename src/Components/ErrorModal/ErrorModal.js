import Card from "../Card/Card";
import Header from "../Header/Header";
import classes from "./ErrorModal.module.css";

const ErrorModal = (props) => {
  //ErrorModal takes props to populate the title and message for modularity.
  return (
    <div>
      <div className={classes.backdrop}>
        <Card className={classes.modal}>
          <Header title={props.title} />
          <div className={classes.content}>
            <p>{props.message}</p>
          </div>
          <footer className={classes.actions}>
            <button className={classes.button} onClick={props.onConfirm}>
              Okay
            </button>
          </footer>
        </Card>
      </div>
    </div>
  );
};

export default ErrorModal;
