import "./App.css";
import LoginPage from "./Components/LoginPage/LoginPage";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import MessagePage from "./Components/MessagePage/MessagePage";
import HomePage from "./Components/HomePage/HomePage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={LoginPage} />
          <Route path="/join/:username" component={HomePage} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
