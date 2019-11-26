import React, { useState, useEffect, createContext } from "react";
import { Grid } from "semantic-ui-react";
import { Route, Switch } from "react-router-dom";
import HomePage from "./components/Home/HomePage";
import SideBar from "./components/SideBar/SideBar";

import firebase from "./config/firebase-config";
import Navbar from "./components/Header/Navbar";
import UserPage from "./components/Home/UserPage";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FoodReportListPage } from "./components/FoodReport/FoodReportListPage";
toast.configure();
export const UserContext = createContext();
const App = () => {
  const [user, setUser] = useState(null);
  const [storeUser, setStoreUser] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    firebase.auth().onAuthStateChanged(currentUser => {
      if (currentUser) {
        if (currentUser !== user) {
          setUser(currentUser);
        }
        setIsLogin(true);
        const getFirestoreState = async () => {
          try {
            if (user) {
              let loginUserRef = firebase
                .firestore()
                .collection("user")
                .doc(user.uid);
              let loginUser = await loginUserRef.get();
              setStoreUser({
                data: loginUser.data(),
                ref: loginUserRef
              });
            }
          } catch (error) {
            console.log(error);
          }
        };

        getFirestoreState();
      } else {
        const f = async () => {
          await firebase
            .firestore()
            .collection("user")
            .doc(user.uid)
            .update({ isLogin: false });
        };
        user && f();
        setUser(null);
        setIsLogin(false);
        setStoreUser(null);
      }
    });
    window.scrollTo(0, 0);
    console.log("render");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin]);

  return (
    <UserContext.Provider value={{ user, isLogin, storeUser }}>
      <Grid container>
        <Grid.Row>
          <Navbar />
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={3}>
            <SideBar />
          </Grid.Column>
          <Grid.Column width={13}>
            <Switch>
              <Route path="/home" exact>
                <HomePage />
              </Route>
              <Route path="/user/:id" exact>
                <UserPage />
              </Route>
              <Route path="/foodrepolist" exact>
                <FoodReportListPage />
              </Route>
            </Switch>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <ToastContainer />
    </UserContext.Provider>
  );
};

export default App;
