import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { MainLayout } from "./components/MainLayout";

// Dummy-Komponenten für den ersten Test
const LoginPage = () => <h2>Login-Seite</h2>;

const DashboardPage = () => <h2>Willkommen im Dashboard!</h2>;
const ChildrenPage = () => <h2>Kinder-Übersicht</h2>;
const AdminPage = () => <h2>Admin-Verwaltung</h2>;
const UnauthorizedPage = () => <h2>403 - Keine Berechtigung für diese Seite</h2>;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Öffentliche Route */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Geschützte Routen innerhalb des MainLayouts */}
            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              {/* Routen für alle angemeldeten Nutzer */}
              <Route path="/dashboard" element={<DashboardPage />} />

              {/* Spezifische Rollen-Routen */}
              <Route
                path="/children"
                element={
                  <ProtectedRoute allowedRoles={["guardian"]}>
                    <ChildrenPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/overview"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Default-Redirect */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;



// import React from "react";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// import { AuthProvider } from "./context/AuthContext";
// import { MainLayout } from "./components/MainLayout";
 

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 1000 * 60 * 5,
//       gcTime: 1000 * 60 * 10,
//       retry: 1,
//       refetchOnWindowFocus: false,
//     },
//   }
//   });


// export const App: React.FC = () => {
//   return (
//   <QueryClientProvider client={queryClient}>
//     <AuthProvider>
//       <div className="app-container">
//         <h1>App-Fundement  bereit!</h1>
//         <p>Montage</p>
//       </div>
//   </AuthProvider>
//   </QueryClientProvider>
    
//   )
// }
  

// export default App;