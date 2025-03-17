import "./App.css";
import Login from "./components/Login";
import { BrowserRouter, Route, Routes } from "react-router";
import QuestionnairesList from "./components/QuestionnairesList";
import Survey from "./components/Survey";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} index={true} />
        <Route path="/questionnaires" element={<QuestionnairesList />} />
        <Route path="/questionnaire/:id" element={<Survey />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
