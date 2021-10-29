import React, { useEffect, useState } from "react";
import { makeRequest } from "../../hooks/request.hook";
import "./styles.css";
import CreateGenre from "./createGenre";
import CreateAuthor from "./createAuthor";
import {Button, CustomInput, Form, Input, Label} from "reactstrap";
import axios from "axios";

const CreateSong = ({ token, setShowPopUp }) => {
  const [filters, setFilters] = useState(undefined);
  const [showAddNewGenre, setShowAddNewGenre] = useState(false);
  const [showAddNewAuthor, setShowAddNewAuthor] = useState(false);
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState([]);

  useEffect(() => {
    makeRequest("GET", "/songs/filters", {}, token).then((response) => {
      console.log(response);
      setFilters(response);
    });
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const imageFile = image[0];
    formData.append('image', imageFile);
    await axios.post(`http://localhost:3001/songs/image-upload/`, formData).then(({data}) => {
      makeRequest(
        "POST",
        "/songs/",
        {
          name: title,
          genre: genre,
          author: author,
          price: Number(price),
          image: data,
        },
        token
      ).then((song) => {
        console.log(song.name);
        setShowPopUp(false);
      });
    });
  };

  const closePopup = () => setShowPopUp(false);

  return (
    <>
      <div id="popup" className={"popup"}>
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <Label>Song title</Label>
          <Input name={"title"} type="text" placeholder="Song title" onChange={e => setTitle(e.target.value)}/>

          <Label>Genre</Label>
            <div className={"groupFlex"}>
              <Input type={"select"} name="genre" className={"selectGroup"} onChange={e => setGenre(e.target.value)}>
                <option value="" selected disabled hidden>
                  Choose genre
                </option>
                {filters &&
                Object.values(filters.genres.items).map(({ id, name }) => {
                  return (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  );
                })}
              </Input>
              <Button color={"warning"} type={"button"} onClick={() => setShowAddNewGenre(true)}>
                Add new...
              </Button>
            </div>

          <Label>Author</Label>
            <div className={"groupFlex"}>
          <Input type={"select"} name="author" className={"selectGroup"} onChange={e => setAuthor(e.target.value)}>
            <option value="" selected disabled hidden>
              Choose author
            </option>
            {filters &&
              Object.values(filters.authors.items).map(({ id, name }) => {
                return (
                  <option key={id} value={id}>
                    {name}
                  </option>
                );
              })}
          </Input>
          <Button color={"warning"} type={"button"} onClick={() => setShowAddNewAuthor(true)}>
            Add new...
          </Button>
            </div>

          <Label>Price</Label>
            <div className={"groupFlex"}>
              <Input type="number" id={"numberInput"} onChange={e => setPrice(e.target.value)}/>
              <Label><h4>&#162;</h4></Label>
            </div>

            <Label>Add image</Label>
            <CustomInput type="file" id="imageId" onChange={e => setImage(e.target.files)}/>
          <div className={"buttons"}>
            <Button color={"warning"} type={"button"} onClick={closePopup}>Close</Button>
            <Button color={"warning"} type={"submit"}>Submit</Button>
          </div>
        </Form>
      </div>
      {showAddNewGenre && (
        <CreateGenre
          token={token}
          setShowAddNewGenre={setShowAddNewGenre}
          setFilters={setFilters}
        />
      )}
      {showAddNewAuthor && (
        <CreateAuthor
          filters={filters}
          token={token}
          setShowAddNewAuthor={setShowAddNewAuthor}
          setFilters={setFilters}
        />
      )}
    </>
  );
};

export default CreateSong;
