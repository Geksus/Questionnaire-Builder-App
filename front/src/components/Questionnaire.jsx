import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router";
import Survey from "./Survey";
import { useState } from "react";

export default function Questionnaire({ data }) {
  const [completions, setCompletions] = useState(data.amount_of_completions);
  const navigate = useNavigate();

  return (
    <Card className="my-2">
      <Card.Header className="d-flex justify-content-between">
        <div>{data.name}</div>
        <Survey survey={data} setCompletions={setCompletions} />
      </Card.Header>
      <Card.Body>{data.description}</Card.Body>
      <Card.Footer className="d-flex justify-content-between">
        <div>Questions: {data.amount_of_questions}</div>
        <div>Completions: {completions}</div>
      </Card.Footer>
    </Card>
  );
}
