import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import store from "./store/store";
import { AuthProvider } from "./context/AuthContext";
import "bootstrap-icons/font/bootstrap-icons.css";


function App() {
  return (
    <Provider store={store}>
      <Router>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </Router>
    </Provider>
  );
}

export default App;
