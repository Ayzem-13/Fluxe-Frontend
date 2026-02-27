import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/app/store";
import AppRoutes from "@/app/routes";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-right" />
      </BrowserRouter>
    </Provider>
  );
}
