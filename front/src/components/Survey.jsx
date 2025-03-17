import { useEffect, useState } from "react";
import api from "../api";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";

export default function Survey({ survey }) {
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [answers, setAnswers] = useState({});

  const fetchQuestionnaireById = async () => {
    try {
      const response = await api.get(`/questionnaire/${survey.data.id}`);
      setQuestions(response.data.questions);
    } catch (error) {
      console.error(error.message);
    }
  };

  function handleShow() {
    setShow(true);
  }

  function handleClose() {
    setShow(false);
  }

  function createAnswersObject() {
    let newAnswers = {};
    for (let question of questions) {
      if (question.question_type === "single_choice") {
        newAnswers[question.question_id] = "";
      }
      if (question.question_type === "multiple_choice") {
        newAnswers[question.question_id] = [];
      }
      if (question.question_type === "text") {
        newAnswers[question.question_id] = "";
      }
    }
    setAnswers(newAnswers);
  }

  function selectAnswerType(question, choices) {
    switch (question.question_type) {
      case "single_choice":
        return choices?.map((choice) => (
          <Form.Check
            key={choice.id}
            type="radio"
            label={choice.text}
            checked={answers[question.question_id] === choice.text}
            onChange={() =>
              setAnswers({
                ...answers,
                [question.question_id]: choice.text,
              })
            }
          ></Form.Check>
        ));
      case "multiple_choice":
        return choices?.map((choice) => (
          <Form.Check
            key={choice.id}
            type="checkbox"
            label={choice.text}
            checked={
              Array.isArray(answers[question.question_id]) &&
              answers[question.question_id].includes(choice.text)
            }
            onChange={() => {
              setAnswers((prevAnswers) => {
                const currentAnswers = prevAnswers[question.question_id] || [];
                const updatedAnswers = currentAnswers.includes(choice.text)
                  ? currentAnswers.filter((answer) => answer !== choice.text)
                  : [...currentAnswers, choice.text];

                return {
                  ...prevAnswers,
                  [question.question_id]: updatedAnswers,
                };
              });
            }}
          />
        ));
      case "text":
        return (
          <Form.Control
            as="textarea"
            rows={5}
            value={answers[question.question_id] || ""}
            onChange={(event) =>
              setAnswers({
                ...answers,
                [question.question_id]: event.target.value,
              })
            }
          />
        );
      default:
        return "radio";
    }
  }

  function finishSurvey() {
    handleClose();
    localStorage.removeItem(`surveyAnswers_${survey.data.id}`);
    createAnswersObject();
    setQuestionIndex(0);
  }

  useEffect(() => {
    fetchQuestionnaireById();
    const savedAnswers = localStorage.getItem(
      `surveyAnswers_${survey.data.id}`,
    );
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
  }, []);

  useEffect(() => {
    if (show) {
      localStorage.setItem(
        `surveyAnswers_${survey.data.id}`,
        JSON.stringify(answers),
      );
    }
  }, [answers, survey.data.id, show]);

  return (
    <>
      <Button variant="outline-success" onClick={() => handleShow()}>
        Take survey
      </Button>
      <Modal backdrop="static" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{survey.data.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <Form className="mb-2">
                <Form.Control
                  disabled
                  value={questions[questionIndex]?.question_text}
                ></Form.Control>
              </Form>
              <Form>
                {questions[questionIndex]?.choices &&
                  selectAnswerType(
                    questions[questionIndex],
                    questions[questionIndex].choices,
                  )}
              </Form>
              <div className="mt-4 d-flex align-items-center justify-content-between">
                <Button
                  size="sm"
                  variant="primary"
                  className="m-0 flex-grow-1"
                  style={{ minWidth: "120px" }} // Adjust minWidth as needed
                  onClick={() => setQuestionIndex(questionIndex - 1)}
                  disabled={questionIndex === 0}
                >
                  Previous question
                </Button>
                <Form.Control
                  disabled
                  value={`Question ${questionIndex + 1} of ${questions.length}`}
                  size="sm"
                  className="w-25 text-center mx-5"
                />
                <Button
                  size="sm"
                  variant="success"
                  className="flex-grow-1"
                  style={{ minWidth: "120px" }} // Adjust minWidth as needed
                  onClick={() => setQuestionIndex(questionIndex + 1)}
                  disabled={questionIndex === questions.length - 1}
                >
                  Next question
                </Button>
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <Button size="sm" variant="warning" onClick={handleClose}>
            Save and exit
          </Button>
          <Button size="sm" variant="success" onClick={finishSurvey}>
            Finish survey
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
