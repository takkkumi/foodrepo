import React, { useContext, useState, useEffect } from "react";
import { Header, Image, Menu, Container, Dropdown } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../../App";
import firebase from "firebase/app";
import "firebase/auth";
import LoginUser from "../../Actions/userActions/LoginUser";
import { japDate } from "../../util/Date";
import { getProps } from "../../util/CustomLodash";
const Navbar = () => {
  const auth = useContext(UserContext);
  const user = getProps(auth, "storeUser.data", null);
  const [userLogin, setUserLogin] = useState("");
  const SignOut = () => {
    firebase.auth().signOut();
  };
  useEffect(() => {
    if (getProps(user, "isLogin")) {
      setUserLogin("ログイン中");
    } else if (getProps(user, "lastLogin.toDate")) {
      setUserLogin(japDate(user.lastLogin.toDate(), "yo年MMMdo日HH時mm分"));
    }
  }, [user]);
  return (
    <Container>
      <Header as="h2" color="orange">
        {user ? (
          <>
            Hello {user.name}{" "}
            <Image size="mini" src={user.userPhoto} verticalAlign="top" />
            {userLogin}
          </>
        ) : (
          "Hello"
        )}

        <Menu fluid>
          <Menu.Menu position="right">
            <Menu.Item as={NavLink} to="/home">
              ok
            </Menu.Item>
            <Menu.Item as={NavLink} to="/foodrepolist">
              foodReportList
            </Menu.Item>
          </Menu.Menu>

          <Menu.Menu position="right">
            <Dropdown text="Setting" item simple>
              <Dropdown.Menu>
                {!auth.isLogin ? (
                  <Dropdown.Item onClick={() => LoginUser()}>
                    LogIn
                  </Dropdown.Item>
                ) : (
                  <Dropdown.Item onClick={() => SignOut()}>
                    LogOut
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>
        </Menu>
      </Header>
    </Container>
  );
};

export default Navbar;
