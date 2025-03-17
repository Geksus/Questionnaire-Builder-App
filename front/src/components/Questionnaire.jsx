import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router";

export default function Questionnaire(q) {
  const navigate = useNavigate();

  return (
    <Card className="my-2">
      <Card.Header className="d-flex justify-content-between">
        <div>{q.data.name}</div>
        <Button
          size="sm"
          variant="outline-success"
          onClick={() => navigate(`/questionnaire/${q.data.id}`)}
        >
          Take survey
        </Button>
      </Card.Header>
      <Card.Body>{q.data.description}</Card.Body>
      <Card.Footer className="d-flex justify-content-between">
        <div>Questions: {q.data.amount_of_questions}</div>
        <div>Completions: {q.data.amount_of_completions}</div>
      </Card.Footer>
    </Card>
  );
}
