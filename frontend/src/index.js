import React from "react";
import ReactDOM from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import {App} from "./App";
import {
  Container,
} from "@mui/material";

const root = ReactDOM.createRoot(document.getElementById("root"));


root.render(
  <React.StrictMode>
    <CssBaseline />
    <Container style={{ padding: "1rem" }}>
      <App/>
    </Container>
  </React.StrictMode>
);
