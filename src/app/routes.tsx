import { useEffect, useRef } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";
import { fetchMe } from "@/domains/auth/slice";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Home from "@/pages/Home";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  return accessToken ? <>{children}</> : <Navigate to="/login" replace />;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  return accessToken ? <Navigate to="/home" replace /> : <>{children}</>;
}

export default function AppRoutes() {
  const dispatch = useDispatch<AppDispatch>();
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const didFetchMe = useRef(false);

  useEffect(() => {
    // Ne fetch qu'une seule fois au mount, pas à chaque changement de token
    if (accessToken && !didFetchMe.current) {
      didFetchMe.current = true;
      dispatch(fetchMe());
    }
    if (!accessToken) {
      didFetchMe.current = false;
    }
  }, [dispatch, accessToken]);

  return (
    <Routes>
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Signup /></GuestRoute>} />
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
