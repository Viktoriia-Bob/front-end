import React, {useEffect, useState} from "react";
import {makeRequest} from "../../hooks/request.hook";
import {Button, CustomInput, Form, Input, Label} from "reactstrap";
import CreateGenre from "../createComponents/createGenre";
import CreateAuthor from "../createComponents/createAuthor";
import axios from "axios";

const SettingsComponent = ({token, setShowSongSettings, id}) => {
  const [song, setSong] = useState({});
  const [filters, setFilters] = useState(undefined);
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState([]);
  const [showAddNewGenre, setShowAddNewGenre] = useState(false);
  const [showAddNewAuthor, setShowAddNewAuthor] = useState(false);

  useEffect(() => {
    makeRequest("GET", `/songs/get-by-id/${id}`, {}, token).then((response) => {
      setSong(response);
    });
    makeRequest("GET", "/songs/filters", {}, token).then((response) => {
      setFilters(response);
    });
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const imageFile = image[0];
    console.log('title -', title);
    if (imageFile) {
      formData.append('image', imageFile);
      await axios.post(`http://localhost:3001/songs/image-upload/`, formData).then(({data}) => {
        makeRequest(
          "PATCH",
          `/songs/${id}`,
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
          setShowSongSettings({show: false, id: 0});
        });
      });
    } else {
      makeRequest(
        "PATCH",
        `/songs/${id}`,
        {
          name: title,
          genre: genre,
          author: author,
          price: Number(price),
        },
        token
      ).then((song) => {
        console.log(song.name);
        setShowSongSettings({show: false, id: 0});
      });
    }
  };

  const closeSettings = () => setShowSongSettings({show: false, id: 0});

  const deleteSong = () => {
    makeRequest(
      "DELETE",
      `/songs/${id}`,
      {},
      token
    ).then(() => {
      setShowSongSettings({show: false, id: 0});
    });
  }

  return (
    <>
      <div id="popup" className={"popup"}>
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <Label>Song title</Label>
          <Input name={"title"} type="text" defaultValue={song.name}
                 onChange={e => setTitle(e.target.value)} autoFocus={true}/>

          <Label>Genre</Label>
          <div className={"groupFlex"}>
            <Input type={"select"} name="genre" defaultValue={song?.genre?.id} className={"selectGroup"} onChange={e => setGenre(e.target.value)}>
              <option value={song?.genre?.id} selected disabled hidden>
                {song?.genre?.name}
              </option>
              {filters &&
              Object.values(filters.genres.items).map(({id, name}) => {
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
            <Input type={"select"} name="author" defaultValue={song?.author?.id} className={"selectGroup"} onChange={e => setAuthor(e.target.value)}>
              <option value={song?.author?.id} selected disabled hidden>
                {song?.author?.name}
              </option>
              {filters &&
              Object.values(filters.authors.items).map(({id, name}) => {
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
            <Input type="number" id={"numberInput"} defaultValue={song.price} onChange={e => setPrice(e.target.value)}/>
            <Label><h4>&#162;</h4></Label>
          </div>

          <Label>Add image</Label>
          <CustomInput type="file" id="imageId" onChange={e => setImage(e.target.files)}/>
          <div className={"buttons"}>
            <Button color={"warning"} type={"button"} onClick={closeSettings}>Close</Button>
            <Button color={"danger"} type={"button"} onClick={deleteSong}>Delete</Button>
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
  )
}

export default SettingsComponent;