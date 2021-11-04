import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../context/AuthContext";
import {makeRequest} from "../../hooks/request.hook";
import {useParams} from "react-router";
import {Button, Table} from "reactstrap";
import {useRouter} from "../../hooks/useRouter.hook";

const UserStatistics = () => {
  const [payments, setPayments] = useState([]);
  const { token } = useContext(AuthContext);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    makeRequest("GET", "/users/payments/" + id, {}, token).then((response) => {
      setPayments(response.data);
    }
    );
  }, [id, token]);

  const goToAdminPage = () => router.push('/admin');

  return (
    <div>
      <Table dark>
        <thead>
        <h1>Payments</h1>
        </thead>
        <tbody>
        {payments?.map(({id, amount, receipt_url}) => {
          return (
            <tr>
              <th>{id}</th>
              <th>{amount}</th>
              <th><Button color="warning" href={receipt_url}>Receipt</Button></th>
            </tr>
          )
        })}
        </tbody>
      </Table>
      <Button color="warning" onClick={() => goToAdminPage()}>Admin page</Button>
    </div>
  )
}

export default UserStatistics;