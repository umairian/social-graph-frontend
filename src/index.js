import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
// Chat UI Kit
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

const theme = createTheme({});

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

console.log(
  "Hey Developer,\n\nHope you're doing fine.\nThanks for stopping by.\n\n@wasifbaliyan"
);


const client = new ApolloClient({
  uri: "http://127.0.0.1:4000",
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
    },
    query: {
      fetchPolicy: 'no-cache',
    }
  }
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
