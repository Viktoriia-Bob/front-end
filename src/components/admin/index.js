import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { makeRequest } from "../../hooks/request.hook";
import CreateSong from "../createComponents/createSong";
import {Button, Navbar, Table} from "reactstrap";
import {useRouter} from "../../hooks/useRouter.hook";
import "./styles.css";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const { token } = useContext(AuthContext);
  const [showPopUp, setShowPopUp] = useState(false);
  const router = useRouter();
  const {deleteTokenFromLocalStorage} = useContext(AuthContext);

  const logout = () => {
    deleteTokenFromLocalStorage();
    router.push('/sign-in');
  };

  useEffect(() => {
    makeRequest("GET", "/users/", {}, token).then((response) =>
      setUsers(response)
    );
  }, [token]);

  const handleMakeAdmin = async (id, role) => {
    await makeRequest("PUT", `/users/update-user-role/${id}`, {
      role: role,
    }, token).then(
      (response) =>
        response.role === "admin"
          ? console.log(`${response.username} is admin now`)
          : console.log(`${response.username} is not admin now`)
    );
    makeRequest("GET", "/users/", {}, token).then((response) =>
      setUsers(response)
    );
  };
  const handleBlockUser = async (id) => {
    await makeRequest("PUT", `/users/block-user/${id}`, {}, token).then(
      (response) =>
        response.isBlocked
          ? console.log(`${response.username} is blocked now`)
          : console.log(`${response.username} is unblocked now`)
    );
    makeRequest("GET", "/users/", {}, token).then((response) =>
      setUsers(response)
    );
  };

  const goToUserPage = () => router.push('/user');
  const userStatistics = (id) => router.push('/statistics/' + id);

  return (
    <>
      <div>
        <Navbar color='dark' light expand="md" className='adminHeader'>
          <h1>Admin</h1>
          <Button color="danger" onClick={logout}>LogOut</Button>
        </Navbar>
        <Table dark>
          <thead></thead>
          <tbody>
        {users?.map(({ username, id, role, isBlocked }) => {
          return (
            <tr>
              <th>{id} </th>
              <th>{username} </th>
              {(() => {
                if (role === "admin") {
                  return (
                    <th>
                    <Button color="warning" onClick={() => handleMakeAdmin(id, role)}>
                      Make user
                    </Button>
                    </th>
                  );
                } else {
                  return (
                    <th>
                    <Button color="warning" onClick={() => handleMakeAdmin(id, role)}>
                      Make admin
                    </Button>
                    </th>
                  );
                }
              })()}
              {(() => {
                if (isBlocked === true) {
                  return (
                    <th>
                    <Button color="warning" onClick={() => handleBlockUser(id)}>Unblock</Button>
                    </th>
                  );
                } else {
                  return (
                    <th>
                    <Button color="warning" onClick={() => handleBlockUser(id)}>Block</Button>
                    </th>
                  );
                }
              })()}
              <th>
                <Button color="warning" onClick={() => userStatistics(id)}>Statistics</Button>
              </th>
            </tr>
          );
        })}
          </tbody>
        </Table>
        <div className="buttons">
          <Button color="warning" onClick={() => setShowPopUp(true)}>Create new song</Button>
          <Button color="warning" onClick={() => goToUserPage()}>User Page</Button>
        </div>
      </div>
      {showPopUp && <CreateSong token={token} setShowPopUp={setShowPopUp} />}
    </>
  );
};

export default Admin;
