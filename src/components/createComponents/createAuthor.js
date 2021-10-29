import React, { useRef, useState } from "react";
import { makeRequest } from "../../hooks/request.hook";
import CreateAuthorsSkinTone from "./createAuthorsSkinTone";
import {Button, Form, Input, Label} from "reactstrap";

const CreateAuthor = ({ filters, token, setShowAddNewAuthor, setFilters }) => {
  const [showCreateSkinTone, setShowCreateSkinTone] = useState(false);
  const [skinTone, setSkinTone] = useState('');
  const formRef = useRef();
  const handleSubmit = async (e) => {
    console.log(e);
    e.preventDefault();
    console.log(formRef);
    const data = Array.from(formRef.current.children).map((item) => item.value);
    console.log(data);
    await makeRequest(
      "POST",
      "/songs/author/add-new",
      {
        name: data[1],
        skinTone: skinTone,
      },
      token
    ).then((author) => {
      console.log(author.name);
      setShowAddNewAuthor(false);
    });
    makeRequest("GET", "/songs/filters", {}, token).then((response) => {
      setFilters(response);
    });
  };

  const closePopup = () => setShowAddNewAuthor(false);

  return (
    <>
      <div className={"popup"}>
        <Form innerRef={formRef} onSubmit={handleSubmit}>

          <Label>Author name</Label>
          <Input type="text" />

          <Label>Author's skin tone</Label>
          <div className={"groupFlex"}>
            <Input type={"select"} name="createSkinTones" id="createSkinTones" onChange={e => setSkinTone(e.target.value)}>
              <option value="" selected disabled hidden>
                Choose skin tone
              </option>
              {filters &&
              Object.values(filters.skinTones.items).map(({ id, name }) => {
                return (
                  <option key={id} value={id}>
                    {name}
                  </option>
                );
              })}
            </Input>
            <Button color={"warning"} type={"button"} onClick={() => setShowCreateSkinTone(true)}>
              Add new...
            </Button>
          </div>

          <div className={"buttons"}>
            <Button color={"warning"} type={"button"} onClick={closePopup}>Close</Button>
            <Button color={"warning"} type={"submit"}>Submit</Button>
          </div>
        </Form>
      </div>
      {showCreateSkinTone && (
        <CreateAuthorsSkinTone
          token={token}
          setShowCreateSkinTone={setShowCreateSkinTone}
          setFilters={setFilters}
        />
      )}
    </>
  );
};

export default CreateAuthor;
