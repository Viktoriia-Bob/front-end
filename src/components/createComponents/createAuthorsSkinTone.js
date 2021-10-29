import { useRef } from "react";
import { makeRequest } from "../../hooks/request.hook";
import {Button, Form, Input, Label} from "reactstrap";

const CreateAuthorsSkinTone = ({
  token,
  setShowCreateSkinTone,
  setFilters,
}) => {
  const formRef = useRef();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = Array.from(formRef.current.children).map((item) => item.value);
    await makeRequest(
      "POST",
      "/songs/authors-skin-tone/add-new",
      {
        name: data[1],
      },
      token
    ).then((skinTone) => {
      console.log(skinTone.name);
      setShowCreateSkinTone(false);
    });
    makeRequest("GET", "/songs/filters", {}, token).then((response) => {
      setFilters(response);
    });
  };

  const closePopup = () => setShowCreateSkinTone(false);

  return (
    <div className={"popup"}>
      <Form innerRef={formRef} onSubmit={handleSubmit}>
        <Label>Skin tone</Label>
        <Input type="text" />
        <div className="buttons">
          <Button color={"warning"} type="button" onClick={closePopup}>Close</Button>
          <Button color={"warning"} type="Submit">Submit</Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateAuthorsSkinTone;
