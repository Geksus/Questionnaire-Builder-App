import "./App.css";
import Login from "./components/Login";
import { BrowserRouter, Route, Routes } from "react-router";
import QuestionnairesList from "./components/QuestionnairesList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} index={true} />
        <Route path="/questionnaires" element={<QuestionnairesList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
