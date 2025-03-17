import { useEffect, useState } from "react";
import api from "../api";
import { Container } from "react-bootstrap";
import Questionnaire from "./Questionnaire";

export default function QuestionnairesList() {
  const [questionnaires, setQuestionnaires] = useState([]);

  const getQuestionnairesList = async () => {
    try {
      const response = await api.get("/questionnaires");
      setQuestionnaires(response.data.questionnaires);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getQuestionnairesList();
  }, []);

  return (
    <Container fluid style={{ maxWidth: "750px" }}>
      {questionnaires.map((q) => (
        <Questionnaire key={q.id} data={q} />
      ))}
    </Container>
  );
}
