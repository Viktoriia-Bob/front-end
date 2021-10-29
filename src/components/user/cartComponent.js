import React, {useEffect} from "react";
import { makeRequest } from "../../hooks/request.hook";
import { useCart } from "./useCart";
import {Button, Label, Table} from "reactstrap";

const CartComponent = ({ token, setShowCart, setSongsInCart, songsInCart }) => {
  useEffect(() => {
    makeRequest("GET", "/cart-with-songs/get-songs-from-cart", {}, token).then(
      (response) => {
        setSongsInCart(response);
      }
    );
  }, [setSongsInCart, token]);
  const { handleAddToCart, handleDeleteFromCart } = useCart(
    token,
    setSongsInCart
  );

  const closeCart = () => setShowCart(false);

  const buySongs = () => {
    makeRequest("POST", "/users/buy-song", songsInCart, token).then((response) => {
      console.log(response);
      window.location.href = response.url;
    });
  }

  return (
    <>
      <script src="https://js.stripe.com/v3/"></script>
    <div className={"popup"}>
      <Button color={"warning"} type={"button"} onClick={closeCart}>Close</Button>
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
            </tr>
            </thead>
            <tbody>
            {songsInCart.map(({ name, id, price, image, genre, author }) => {
              return (
                <tr>
                  <th>{id}</th>
                  <th><img src={`${image}`} alt={`${id}`} className={'imageSong'} /></th>
                  <th>{name}</th>
                  <th>{price / 100}$</th>
                  <th>{genre.name}</th>
                  <th>{author.name}</th>
                  {(() => {
                    if (!songsInCart?.map((song) => song.id).includes(id)) {
                      return (
                        <th><Button color="warning" onClick={() => handleAddToCart(id)}>
                          Add to cart
                        </Button></th>
                      );
                    } else {
                      return (
                        <th><Button color="warning" onClick={() => handleDeleteFromCart(id)}>
                          Delete from cart
                        </Button></th>
                      );
                    }
                  })()}
                </tr>
              );
            })}
            </tbody>
          </Table>
      <Label>
        Sum in cart:
        {songsInCart.length && songsInCart.map((song) => song.price).reduce((prev, cur) => prev + cur) / 100}
        $
      </Label>
      <Button color={"warning"} onClick={buySongs}>Buy</Button>
    </div>
    </>
  );
};

export default CartComponent;
