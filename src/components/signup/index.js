import React, {useRef, useState} from "react";
import { makeRequest } from "../../hooks/request.hook";
import {Button, Form, Input, Label} from "reactstrap";
import "./styles.css";
import {useRouter} from "../../hooks/useRouter.hook";

const Signup = () => {
  const formRef = useRef();
  const router = useRouter();
  const [checkEmail, setCheckEmail] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = Array.from(formRef.current.children).map((item) => item.value);
    makeRequest("POST", "/auth/sign-up", {
      email: data[0],
      password: data[2],
      username: data[1],
    }).then(({sendToEmail}) => {
      setCheckEmail(sendToEmail);
    });
  };

  const toSignIn = () => router.push("/sign-in");

  return (
    <div className={"signUpForm"}>
      <Form innerRef={formRef} onSubmit={handleSubmit}>
        <Input className={"inputValue"} type="email" placeholder="Enter your email" />
        <Input className={"inputValue"} type="text" placeholder="Enter your user name" />
        <Input className={"inputValue"} type="password" placeholder="Enter your password" />
        <div className="buttons">
          <Button color={"secondary"} type={"button"} onClick={toSignIn}>Sign In</Button>
          <Button color={"warning"} type={"submit"}>Submit</Button>
        </div>
      </Form>
      {(() => {
        if(checkEmail) {
          return (
            <Label>Please, check your email</Label>
          )
        }
      })()}
    </div>
  );
};

export default Signup;
