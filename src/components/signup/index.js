import React, {useRef, useState} from "react";
import { makeRequest } from "../../hooks/request.hook";
import {Button, Form, Input} from "reactstrap";
import "./styles.css";
import {useRouter} from "../../hooks/useRouter.hook";
import PhoneInput from 'react-phone-input-2'

const Signup = () => {
  const formRef = useRef();
  const router = useRouter();
  const [checkEmail, setCheckEmail] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(0);
  const [code, setCode] = useState(0);
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = Array.from(formRef.current.children).map((item) => item.value);
    makeRequest("POST", "/auth/sign-up", {
      password: data[2],
      username: data[1],
      phoneNumber: phoneNumber,
    }).then(({sendSms}) => {
      setCheckEmail(sendSms);
    });
  };

  const toSignIn = () => router.push("/sign-in");

  const submitCode = () => {
      makeRequest("POST", "/auth/confirm-code", {phoneNumber: phoneNumber, code: code}).then(({confirm}) => {
        if (confirm) {
          router.push("/sign-in");
        }
      })
  }

  return (
    <div className={"signUpForm"}>
      <Form innerRef={formRef} onSubmit={handleSubmit}>
        <PhoneInput
          className={"inputValue"}
          country={'ua'}
          value={phoneNumber}
          onChange={setPhoneNumber}
          placeholder="Enter your phone number"
        />
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
            <div>
            <Input className="inputValue" type="text" onChange={(e) => setCode(e.target.value)} />
            <Button color="warning" type="button" onClick={() => submitCode()}>Submit code</Button>
            </div>
          )
        }
      })()}
    </div>
  );
};

export default Signup;
