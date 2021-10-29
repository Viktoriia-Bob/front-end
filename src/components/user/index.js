import React, {useContext, useEffect, useRef, useState} from "react";
import { makeRequest } from "../../hooks/request.hook";
import { AuthContext } from "../../context/AuthContext";
import { useSelectFilter } from "./useSelectFilter";
import { useSwitchList } from "./useSwitchList";
import { useWishlist } from "./useWishlist";
import { useCart } from "./useCart";
import CartComponent from "./cartComponent";
import {
  Button,
  ButtonGroup,
  Form,
  Input,
  Label,
  Navbar,
  Table
} from "reactstrap";
import "./index.css";
import {useRouter} from "../../hooks/useRouter.hook";
import SettingsComponent from "./settingsComponent";

const User = () => {
  const [songs, setSongs] = useState([]);
  const { token } = useContext(AuthContext);
  const [filters, setFilters] = useState([]);
  const [filter, setFilter] = useState("");
  const [songsInWishlist, setSongsInWishlist] = useState([]);
  const [songsInCart, setSongsInCart] = useState([]);
  const [boughtSongs, setBoughtSongs] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [fromPrice, setFromPrice] = useState(0);
  const [toPrice, setToPrice] = useState(1000000);
  const [showSongSettings, setShowSongSettings] = useState({show: false, id: 0});
  const [loggedOut, setLoggedOut] = useState(false);
  const formRef = useRef();
  const router = useRouter();

  const logout = () => {
    localStorage.clear();
    setLoggedOut(true);
  };

  if (loggedOut) {
    router.push('/sign-in');
  }

  useEffect(() => {
    makeRequest("GET", "/songs/", {}, token).then((response) => {
      setSongs(response);
    });
    makeRequest("GET", "/songs/filters", {}, token).then((response) => {
      setFilters(response);
    });
    makeRequest("GET", "/wishlists/get-songs-from-wishlist", {}, token).then(
      (response) => {
        setSongsInWishlist(response);
      }
    );
    makeRequest("GET", "/cart-with-songs/get-songs-from-cart", {}, token).then(
      (response) => {
        setSongsInCart(response);
      }
    );
    makeRequest("GET", "/users/list-of-bought-songs/", {}, token).then(
      (response) => {
        setBoughtSongs(response);
      }
    );
  }, [token]);

  const handleSelect = (e) => {
    setFilter(e.target.value);
  };
  const { handleClick } = useSwitchList(token, filter, setSongs);
  const { handleSelectFilter } = useSelectFilter(filter, token, setSongs);
  const { handleAddToWishlist, handleDeleteFromWishlist } = useWishlist(
    token,
    setSongsInWishlist
  );
  const { handleAddToCart, handleDeleteFromCart } = useCart(
    token,
    setSongsInCart
  );

  const handleSubmit = () => {
    makeRequest(
      "GET",
      `/songs/filter-by-price/${fromPrice*100}/to/${toPrice*100}`,
      {},
      token
    ).then((response) => setSongs(response));
  };
  const handleSubmitSearch = () => {
    const data = Array.from(formRef.current.children).map((item) => item.value);
    makeRequest("GET", `/songs/search-by-name/${data[1]}`, {}, token).then(
      (response) => setSongs(response)
    );
  };

  const toggle = () => setShowCart(!showCart);

  const goToAdminPage = () => router.push('/admin');

  return (
    <div>
      <Navbar color={'dark'} light expand="md" id={'navbar'}>
      <ButtonGroup id={'buttonGroup'}>
        <Button className={'radioButton'} color="warning" onClick={() => handleClick(`all`)}>All</Button>
        <Button className={'radioButton'} color="warning" onClick={() => handleClick(`bought`)}>Bought</Button>
        <Button className={'radioButton'} color="warning" onClick={() => handleClick(`wishlist`)}>Wishlist</Button>
      </ButtonGroup>

      <Input type="select" onChange={handleSelect} name="filter" id="filter">
        <option value="" selected disabled hidden>
          Choose filter
        </option>
        {Object.entries(filters).map((item) => {
          return (
            <option key={item[1].id} value={item[0]}>
              {item[1].fullName}
            </option>
          );
        })}
        <option value="price">Price</option>
        <option value="search">Search by name</option>
      </Input>
      {(() => {
        if (filter === "price") {
          return (
            <div className={"groupSearchFlex"}>
              <Label for="from-price">From</Label>
              <Input type="number" name="from" id="from-price" placeholder="from" onChange={(e) => setFromPrice(e.target.value)} />
              <Label for="to-price">To</Label>
              <Input type="number" name="to" id="to-price" placeholder="to" onChange={(e) => setToPrice(e.target.value)} />
              <Button color="warning" type={"button"} onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          );
        } else if (filter === "search") {
          return (
            <Form innerRef={formRef} className={"groupSearchFlex"}>
              <Label>Search</Label>
              <Input type={'search'} onSubmit={handleSubmitSearch}/>
              <Button color="warning" type={"button"} onClick={handleSubmitSearch}>Search</Button>
            </Form>
          );
        } else {
          return (
            <Input type="select" onChange={handleSelectFilter}
                   name="filterValue"
                   id="filterValue">
              <option value="" selected disabled hidden>
                Choose filter value
              </option>
              {filter &&
              Object.values(filters[filter].items).map(({ id, name }) => {
                return (
                  <option key={id} value={name}>
                    {name}
                  </option>
                );
              })}
            </Input>
          );
        }
      })()}
        <Button id={'cartButton'} color="warning" onClick={toggle}>Cart</Button>
        <Button color="danger" onClick={logout}>LogOut</Button>

    </Navbar>
      <>
        <Table dark>
          <thead>
          <tr>
            <th>#</th>
            <th> </th>
            <th>Name</th>
            <th>Price</th>
            <th>Genre</th>
            <th>Author</th>
            <th> </th>
            <th> </th>
            <th> </th>
          </tr>
          </thead>
          <tbody>
          {songs.map(({ name, id, price, image, genre, author }) => {
            return (
              <tr>
                <th>{id}</th>
                <th><img src={`${image}`} alt={`${id}`} className={'imageSong'} /></th>
                <th>{name}</th>
                <th>{price / 100}$</th>
                <th>{genre.name}</th>
                <th>{author.name}</th>
                {(() => {
                  if (!songsInWishlist.map((song) => song.id).includes(id)) {
                    return (
                      <th><Button color="warning" onClick={() => handleAddToWishlist(id)}>
                        Add to wishlist
                      </Button></th>
                    );
                  } else {
                    return (
                      <th><Button color="warning" onClick={() => handleDeleteFromWishlist(id)}>
                        Delete from wishlist
                      </Button></th>
                    );
                  }
                })()}
                {(() => {
                  if (
                    !songsInCart.map((song) => song.id).includes(id) &&
                    !boughtSongs.map((song) => song.id).includes(id)
                  ) {
                    return (
                      <th><Button color="warning" onClick={() => handleAddToCart(id)}>
                        Add to cart
                      </Button></th>
                    );
                  } else if (!boughtSongs.map((song) => song.id).includes(id)) {
                    return (
                      <th><Button color="warning" onClick={() => handleDeleteFromCart(id)}>
                        Delete from cart
                      </Button></th>
                    );
                  } else {
                    return(
                      <th> </th>
                    )
                  }
                })()}
                {(() => {
                  if (JSON.parse(localStorage?.getItem("role"))?.role === 'admin') {
                    return (
                      <th><Button color="warning" onClick={() => setShowSongSettings({show: true, id})}>Settings</Button></th>
                    )
                  } else {
                    return (
                      <th> </th>
                    )
                  }
                })()}
              </tr>
            );
          })}
          </tbody>
        </Table>
      </>
      {showCart && <CartComponent
        token={token}
        setShowCart={setShowCart}
        setSongsInCart={setSongsInCart}
        songsInCart={songsInCart}
      />}
      {showSongSettings.show && <SettingsComponent id={showSongSettings.id} setShowSongSettings={setShowSongSettings} token={token}/>}
      {
        (() => {
          if (JSON.parse(localStorage?.getItem("role"))?.role === 'admin') {
            return (
              <Button color="warning" onClick={() => goToAdminPage()}>Admin page</Button>
            )
          }
        })()
      }
    </div>
  );
};

export default User;
