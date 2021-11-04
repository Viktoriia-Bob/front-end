import React, {useContext, useRef, useState} from "react";
import { makeRequest } from "../../hooks/request.hook";
import { AuthContext } from "../../context/AuthContext";
import { useRouter } from "../../hooks/useRouter.hook";
import "./styles.css";
import {Button, Form, Input} from "reactstrap";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/high-res.css'

const Signin = () => {
  const [phoneNumber, setPhoneNumber] = useState();
  const formRef = useRef();
  const router = useRouter();
  const { setTokenToLocalStorage } = useContext(AuthContext);
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = Array.from(formRef.current.children).map((item) => item.value);
    makeRequest("POST", "/auth/sign-in", {
      phoneNumber: phoneNumber,
      password: data[1],
    }).then(({ accessToken, user }) => {
      setTokenToLocalStorage(accessToken);
      console.log('after set token to local storage');
      localStorage.setItem(
        "role",
        JSON.stringify({
          role: user.role,
        })
      );
      console.log(accessToken);
      router.push(user.role === "admin" ? "/admin" : "/user");
    });
  };

  const toRegistration = () => router.push("/sign-up");

  return (
    <div className={"signInForm"}>
      <Form innerRef={formRef} onSubmit={handleSubmit}>
        {/*<Input className={"inputValue"} type="text" placeholder="Enter your phone number" />*/}
        <PhoneInput
          className={"inputValue"}
          country={'ua'}
          value={phoneNumber}
          onChange={setPhoneNumber}
          placeholder="Enter your phone number"
        />
        {/*<ReactPhoneInput defaultCountry={'ua'} onChange={setPhoneNumber}/>*/}
        <Input className={"inputValue"} type="password" placeholder="Enter your password" />
        <div className={"buttons"}>
          <Button color={"secondary"} type={"button"} onClick={toRegistration}>Registration</Button>
          <Button color={"warning"} type={"submit"}>Submit</Button>
        </div>
      </Form>
    </div>
  );
};

export default Signin;
