import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { v4 as uuid } from "uuid";
import api from "../api";

export default function Survey({ survey, setCompletions }) {
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [answers, setAnswers] = useState({});
  const [session_id, setSession_id] = useState("");

  const fetchQuestionnaireById = async () => {
    try {
      const response = await api.get(`/questionnaire/${survey.id}`);
      setQuestions(response.data.questions);
    } catch (error) {
      console.error(error.message);
    }
  };

  const updateCompletions = async (amount_of_completions, id) => {
    try {
      const response = await api.post(`/updateCompletions`, {
        amount_of_completions,
        id,
      });
      console.log("Completions updated:", response.data);

      setCompletions(amount_of_completions);
    } catch (error) {
      console.error("Failed to update completions:", error.message);
    }
  };

  const submitAnswer = async () => {
    try {
      const currentQuestion = questions[questionIndex];
      const question_id = currentQuestion.question_id;
      const questionnaire_id = survey.id;
      const answer = answers[question_id];

      if (currentQuestion.question_type === "text") {
        await api.post("/submit", {
          session_id,
          questionnaire_id,
          question_id,
          answers: {
            answer_text: answer.answer_text,
            answer_choice_id: null,
          },
        });
      } else if (currentQuestion.question_type === "single_choice") {
        await api.post("/submit", {
          session_id,
          questionnaire_id,
          question_id,
          answers: {
            answer_text: answer.answer_text,
            answer_choice_id: answer.answer_choice_id,
          },
        });
      } else if (currentQuestion.question_type === "multiple_choice") {
        if (Array.isArray(answer) && answer.length > 0) {
          await api.post("/submit", {
            session_id,
            questionnaire_id,
            question_id,
            answers: answer,
          });
        }
      }

      if (questionIndex < questions.length - 1) {
        setQuestionIndex(questionIndex + 1);
      }
    } catch (error) {
      console.error("Error submitting answer:", error.message);
      alert("Failed to submit answer. Please try again.");
    }
    if (questionIndex === Object.keys(answers).length - 1) {
      await updateCompletions(survey.amount_of_completions + 1, survey.id);
      finishSurvey();
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
            checked={
              answers[question.question_id]?.answer_choice_id === choice.id
            }
            onChange={() =>
              setAnswers({
                ...answers,
                [question.question_id]: {
                  answer_choice_id: choice.id,
                  answer_text: choice.text,
                },
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
              answers[question.question_id]
                .map((q) => q.answer_choice_id)
                .includes(choice.id)
            }
            onChange={() => {
              setAnswers((prevAnswers) => {
                const currentAnswers = prevAnswers[question.question_id] || [];
                const updatedAnswers = currentAnswers.includes(choice.text)
                  ? currentAnswers.filter(
                      (answer) => answer.answer_choice_id !== choice.id,
                    )
                  : [
                      ...currentAnswers,
                      { answer_choice_id: choice.id, answer_text: choice.text },
                    ];

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
            value={answers[question.question_id].answer_text || ""}
            onChange={(event) =>
              setAnswers({
                ...answers,
                [question.question_id]: {
                  answer_choice_id: null,
                  answer_text: event.target.value,
                },
              })
            }
          />
        );
      default:
        return;
    }
  }

  function finishSurvey() {
    handleClose();
    setSession_id("");
    localStorage.removeItem(`surveyAnswers_${survey.id}`);
    createAnswersObject();
    setQuestionIndex(0);
  }

  useEffect(() => {
    fetchQuestionnaireById();
    const savedAnswers = localStorage.getItem(`surveyAnswers_${survey.id}`);
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
  }, []);

  useEffect(() => {
    if (session_id === "") {
      setSession_id(uuid);
    }
    if (show) {
      localStorage.setItem(
        `surveyAnswers_${survey.id}`,
        JSON.stringify(answers),
      );
    }
  }, [answers, survey.id, show]);

  function resetSurvey() {
    setQuestionIndex(0);
    createAnswersObject();
  }

  return (
    <>
      <Button variant="outline-success" onClick={() => handleShow()}>
        Take survey
      </Button>
      <Modal backdrop="static" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{survey.name}</Modal.Title>
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
                  variant="danger"
                  style={{ maxWidth: "140px", minWidth: "140px" }}
                  onClick={() => resetSurvey()}
                >
                  Reset
                </Button>
                <Form.Control
                  disabled
                  value={`Question ${questionIndex + 1} of ${questions.length}`}
                  size="sm"
                  className="w-25 text-center"
                />
                <Button
                  size="sm"
                  variant="success"
                  style={{ maxWidth: "140px", minWidth: "140px" }}
                  onClick={submitAnswer}
                >
                  Submit
                </Button>
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <Button
            size="sm"
            variant="warning"
            style={{ maxWidth: "140px", minWidth: "140px" }}
            onClick={handleClose}
          >
            Save and exit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
