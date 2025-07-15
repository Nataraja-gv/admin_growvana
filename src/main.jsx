import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "./utils/store/reduxStrore.js";
import { SnackbarProvider } from "notistack";
import { Provider } from "react-redux";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

createRoot(document.getElementById("root")).render(
  <SnackbarProvider
    maxSnack={2}
    anchorOrigin={{ vertical: "top", horizontal: "right" }}
    autoHideDuration={1000}
  >
      <LocalizationProvider dateAdapter={AdapterDayjs}> 
    <Provider store={store}>
      <App />
    </Provider>
  </LocalizationProvider>
  </SnackbarProvider>
);
