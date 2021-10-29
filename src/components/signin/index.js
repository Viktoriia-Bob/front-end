import React, {useContext, useRef} from "react";
import { makeRequest } from "../../hooks/request.hook";
import { AuthContext } from "../../context/AuthContext";
import { useRouter } from "../../hooks/useRouter.hook";
import "./styles.css";
import {Button, Form, Input} from "reactstrap";

const Signin = () => {
  const formRef = useRef();
  const router = useRouter();
  const { setTokenToLocalStorage } = useContext(AuthContext);
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = Array.from(formRef.current.children).map((item) => item.value);
    makeRequest("POST", "/auth/sign-in", {
      email: data[0],
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
        <Input className={"inputValue"} type="email" placeholder="Enter your email" />
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
