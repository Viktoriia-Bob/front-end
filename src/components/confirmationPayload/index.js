import {useContext, useEffect} from "react";
import {makeRequest} from "../../hooks/request.hook";
import {AuthContext} from "../../context/AuthContext";
import {useRouter} from "../../hooks/useRouter.hook";
import {Button, Label} from "reactstrap";
import "./styles.css";

const ConfirmationPayload = () => {
  const { token } = useContext(AuthContext);
  const router = useRouter();
  useEffect(() => {
    makeRequest("GET", "/users/add-song-to-bought", {}, token);
  })
  const returnToList = () => router.push("/user");
  return (
    <div className="returnGroup">
      <Label>Your payload access</Label>
      <Button onClick={returnToList}>Return</Button>
    </div>
  )
}

export default ConfirmationPayload;