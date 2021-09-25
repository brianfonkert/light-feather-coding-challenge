import Header from "./Components/Header/Header";
import Card from "./Components/Card/Card";
import Form from "./Pages/Form";

function App() {
  //Main container with the header and form
  return (
      <Card>
        <Header title={"Notification Form"}></Header>
        <Form></Form>
      </Card>
  );
}

export default App;
