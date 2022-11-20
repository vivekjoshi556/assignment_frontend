import Form from "./Components/Form";
import Coach from "./Components/Coach";

function App() {
    return (
        <div className="App flex w-full min-h-screen md:flex-row flex-col">
            <Form></Form>
            <Coach></Coach>
        </div>
    );
}

export default App;
