import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import { store } from "./store";
import { Provider } from "react-redux";
import SessionManager from "./components/SessionManager/SessionManager";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <SessionManager />
        <AppRouter />
      </BrowserRouter>
    </Provider>
  );
}
export default App;
