import { Button, CircularProgress, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { login } from "../redux/authSlice";
import { useMutation, gql } from '@apollo/client';

const LOGIN_MUTATION = gql`
  mutation UserMutation($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    user {
      _id
      name
      email
      password
      dob
      profile_url
      createdAt
    }
    token
  }
}
`;

export default function LoginForm() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const history = useHistory();
  const { status, isLoggedIn } = useSelector((state) => state.auth);

  // GraphQL
  const [loginReq, { data, loading, error }] = useMutation(LOGIN_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {data: { login: loginResponse }} = await loginReq({ variables: loginData });
      console.log("login response", loginResponse)
      dispatch(login(loginResponse));
    } catch (err) {
      console.log(err)
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      history.push("/");
    }
  }, [isLoggedIn, history]);
  return (
    <>
      <form onSubmit={handleSubmit}>
        <TextField
          onChange={(e) =>
            setLoginData((prev) => ({
              ...prev,
              [e.target.name]: e.target.value,
            }))
          }
          sx={{ width: "100%", margin: "1rem 0", bgcolor: "#fff" }}
          variant="outlined"
          label="Enter Email"
          type="email"
          required
          name="email"
        />
        <TextField
          sx={{ width: "100%", margin: "1rem 0", bgcolor: "#fff" }}
          variant="outlined"
          label="Enter Password"
          type="password"
          required
          onChange={(e) =>
            setLoginData((prev) => ({
              ...prev,
              [e.target.name]: e.target.value,
            }))
          }
          name="password"
        />
        <Button
          disabled={
            loginData.email.trimStart().length === 0 ||
            loginData.password.trimStart().length === 0
          }
          sx={{
            width: "100%",
            margin: "1.5rem 0",
            padding: "12px 0",
            borderRadius: "28px",
          }}
          variant="contained"
          color="primary"
          type="submit"
        >
          {status === "loading" ? (
            <CircularProgress size={24} sx={{ color: "#FFF" }} />
          ) : (
            "Login"
          )}
        </Button>
      </form>
      <Button
        sx={{
          width: "100%",
          margin: ".5rem 0 1rem 0.5rem",
          padding: "12px 0",
          borderRadius: "28px",
        }}
        variant="outlined"
        color="primary"
      >
        {status === "loading" ? "Logging in..." : "Login as guest"}
      </Button>
    </>
  );
}
