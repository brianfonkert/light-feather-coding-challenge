import "./App.css";
import Header from "./UI/Header/Header";
import Card from "./UI/Card/Card";
import Form from "./Form/Form";

function App() {
  //Main container with the header and form
  return (
    <div>
      <Card>
        <Header title={"Notification Form"}></Header>
        <Form></Form>
      </Card>
    </div>
  );
}

export default App;
