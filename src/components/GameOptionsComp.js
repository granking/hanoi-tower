import { Row, Col, Button } from "react-bootstrap";

const GameOptionsComp = ({ disks, solve, reset, setDisks }) => {
  return (
    <Row>
      <Col>
        <span>Discos: {disks}</span>
        <Button
          variant="outline-secondary"
          onClick={
            () => setDisks(disks + 1)}>
          +
        </Button>
        <Button
          variant="outline-secondary"
          onClick={
            () => {
              if(disks > 1) setDisks(disks - 1);
              }}
        >
          -
        </Button>
      </Col>
      <Col>
        <Button variant="outline-secondary" onClick={() => reset()}>
          Reset
        </Button>
        <Button variant="outline-secondary" onClick={() => solve()}>
          Resolver
        </Button>
      </Col>
    </Row>
  );
};

export default GameOptionsComp;
