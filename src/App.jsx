import { Provider } from "react-redux";
import AppRouter from "./routes/AppRouter";
import store from "./store/store";
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
}

export default App;
