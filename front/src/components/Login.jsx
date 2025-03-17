import { useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";

export default function Login() {
  const [username, setUsername] = useState("");

  return (
    <Container
      fluid
      className="vh-100 d-flex flex-column justify-content-center"
    >
      <Row className="mb-4">
        <Col className="text-center">
          <h4>Please enter your username</h4>
        </Col>
      </Row>
      <Row className="justify-content-center mb-3">
        <Col xs="auto">
          <InputGroup className="mb-2">
            <InputGroup.Text className="w-50">Username</InputGroup.Text>
            <Form.Control
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            ></Form.Control>
          </InputGroup>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs="auto">
          <Button href="/questionnaires">Login</Button>
        </Col>
      </Row>
    </Container>
  );
}
