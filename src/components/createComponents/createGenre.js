import { useRef } from "react";
import { makeRequest } from "../../hooks/request.hook";
import {Button, Form, Input, Label} from "reactstrap";

const CreateGenre = ({ token, setShowAddNewGenre, setFilters }) => {
  const formRef = useRef();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = Array.from(formRef.current.children).map((item) => item.value);
    console.log("genre", data);
    await makeRequest(
      "POST",
      "/songs/genre/add-new",
      {
        name: data[1],
      },
      token
    ).then((genre) => {
      console.log(genre.name);
      setShowAddNewGenre(false);
    });
    makeRequest("GET", "/songs/filters", {}, token).then((response) => {
      setFilters(response);
    });
  };

  const closePopup = () => setShowAddNewGenre(false);
  return (
    <div className={"popup"}>
      <Form innerRef={formRef} onSubmit={handleSubmit}>
        <Label>Genre name</Label>
        <Input type="text" />
        <div className={"buttons"}>
          <Button color={"warning"} type={"button"} onClick={closePopup}>Close</Button>
          <Button color={"warning"} type="Submit">Submit</Button>
        </div>
      </Form>
    </div>

  );
};

export default CreateGenre;
