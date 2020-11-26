import logo from "./logo.svg";
import "./App.css";

import Zk from "@nuid/zk";
import jwt from "jsonwebtoken";

import { useState } from "react";

import { serverPost } from "./services/api";

const FormComponent = (props) => (
  <form onSubmit={props.handleSubmit}>
    <input
      type="text"
      name="login"
      value={props.login}
      onChange={(e) => props.setLogin(e.target.value)}
      placeholder="Login"
    />
    <input
      type="password"
      name="password"
      value={props.password}
      onChange={(e) => props.setPassword(e.target.value)}
      placeholder="Password"
    />
    <div className="wrapper-checkbox">
      <input
        type="checkbox"
        value={props.isLogin}
        onChange={(e) => props.setIsLogin(e.target.checked)}
      />
      <span>Login?</span>
    </div>
    <button type="submit" disabled={props.loading}>
      {!props.isLogin ? "Register" : !props.loading ? "Sign in" : "Loading"}
    </button>
  </form>
);

function App() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (isLogin) {
      setLoading(true);

      const { challengeJwt } = await serverPost("/challenge", { email: login });

      if (!challengeJwt) {
        window.alert("Fail to generate jwt");
        return;
      }

      const challengeClaims = jwt.decode(challengeJwt);

      console.log(challengeClaims);

      const proof = Zk.proofFromSecretAndChallenge(password, challengeClaims);

      const loginRes = await serverPost("/login", {
        email: login,
        proof: proof,
        challengeJwt,
      });

      if (!loginRes) {
        window.alert("Unauthorized");
        return;
      } else {
        setAuthenticated(true);
        setLoading(false);
      }
    } else {
      setLoading(true);

      const verifiedCredential = Zk.verifiableFromSecret(password);
      const res = await serverPost("/register", {
        credential: verifiedCredential,
        email: login,
      });

      setLoading(false);

      console.log(res);

      if (res) {
        window.alert("You are registered");
      }
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {authenticated ? (
          <p>You're authenticated!</p>
        ) : (
          <FormComponent
            login={login}
            setLogin={setLogin}
            password={password}
            setPassword={setPassword}
            isLogin={isLogin}
            setIsLogin={setIsLogin}
            handleSubmit={handleSubmit}
            loading={loading}
          />
        )}
      </header>
    </div>
  );
}

export default App;
