import { Button, CircularProgress, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { registerUser, setAuthSlice } from "../redux/authSlice";
import { useMutation, gql } from '@apollo/client';

const SIGNUP_MUTATION = gql`
  mutation UserMutation($name: String!, $email: String!, $password: String!, $profileUrl: String) {
  signup(name: $name, email: $email, password: $password, profile_url: $profileUrl) {
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

export default function RegisterForm() {
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    profile_url: "",
  });
  const dispatch = useDispatch();
  const history = useHistory();
  const { status, isLoggedIn } = useSelector((state) => state.auth);

  // GraphQL
  const [signUp, { data, loading, error }] = useMutation(SIGNUP_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {data: { signup: signUpResponse }} = await signUp({ variables: registerData });
    console.log("signup response", signUpResponse)
  dispatch(setAuthSlice(signUpResponse));
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
    <form onSubmit={handleSubmit}>
      <TextField
        onChange={(e) =>
          setRegisterData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }))
        }
        name="name"
        sx={{ width: "100%", margin: "1rem 0", bgcolor: "#fff" }}
        variant="outlined"
        label="Enter full name"
        type="text"
        required
      />
      <TextField
        name="email"
        onChange={(e) =>
          setRegisterData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }))
        }
        sx={{ width: "100%", margin: "1rem 0", bgcolor: "#fff" }}
        variant="outlined"
        label="Enter Email"
        type="email"
        required
      />
      <TextField
        name="password"
        onChange={(e) =>
          setRegisterData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }))
        }
        sx={{ width: "100%", margin: "1rem 0", bgcolor: "#fff" }}
        variant="outlined"
        label="Enter Password"
        type="password"
        required
      />
      <TextField
        name="profile_url"
        onChange={(e) =>
          setRegisterData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }))
        }
        sx={{ width: "100%", margin: "1rem 0", bgcolor: "#fff" }}
        variant="outlined"
        label="Paste url to your profile image"
        type="text"
        required
      />
      <Button
        disabled={
          registerData.email.trimStart().length === 0 ||
          registerData.password.trimStart().length === 0 ||
          registerData.profile_url.trimStart().length === 0 ||
          registerData.name.trimStart().length === 0
        }
        type="submit"
        sx={{
          width: "100%",
          margin: "1.5rem 0",
          padding: "12px 0",
          borderRadius: "28px",
        }}
        variant="contained"
        color="primary"
      >
        {status === "loading" ? (
          <CircularProgress size={24} sx={{ color: "#FFF" }} />
        ) : (
          "Register"
        )}
      </Button>
    </form>
  );
}
