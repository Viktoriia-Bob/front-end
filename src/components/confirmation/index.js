import React, {useEffect} from 'react';
import {useRouter} from "../../hooks/useRouter.hook";
import {makeRequest} from "../../hooks/request.hook";
import {Button, Label} from "reactstrap";

const Confirmation = () => {
    const {query: { token }} = useRouter();
    const router = useRouter();
    useEffect(()=> {
        makeRequest('GET', `/auth/confirm?token=${token}`).then((response) =>{
            console.log(response);
        });
    },[token])

  const returnToSignIn = () => router.push('/sign-in');

    return (
      <div className="returnGroup">
        <Label>Your email is confirmed!</Label>
        <Button onClick={returnToSignIn}>Sign In</Button>
      </div>
    )
}

export default Confirmation;