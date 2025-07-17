import "./App.css";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/layout";
import NotFound from "./pages/pagenotfound";

import { useDispatch, useSelector } from "react-redux";
import { authCheck } from "./store/auth-slice";
import { useEffect } from "react";
import CheckAuth from "./components/common/check-auth";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import { Skeleton } from "./components/ui/skeleton";
import AllTask from "./pages/AllTasks";
import TodayTasks from "./pages/TodayTasks";
import TaskWraper from "./components/TaskWraper";
import SearchTask from "./components/SearchTask";
import CompletedTasks from "./pages/CompletedTasks";
import AddTaskDialog from "./components/AddTask";

function App() {
  const { isAuthenticated, user, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    // Only call authCheck if not already authenticated
    if (!isAuthenticated) {
      dispatch(authCheck());
    }
  }, [isAuthenticated]);

  if (isLoading) return <Skeleton className="h-[600px] w-[600px]" />;

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        {/* Auth routes */}
        <Route
          path="auth/"
          element={
            <CheckAuth isAuthenticated={isAuthenticated}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>

        {/* Main protected routes */}
        <Route
          path="/"
          element={
            <CheckAuth isAuthenticated={isAuthenticated}>
              <Layout />
            </CheckAuth>
          }
        >
          <Route path="/todo/addtasks" element={<AddTaskDialog />} />
          <Route
            path="/todo/tasks"
            element={
              <TaskWraper>
                <AllTask />
              </TaskWraper>
            }
          />
          <Route
            path="/todo/today"
            element={
              <TaskWraper>
                <TodayTasks />
              </TaskWraper>
            }
          />
          <Route
            path="/todo/search"
            element={
              <TaskWraper>
                <SearchTask />
              </TaskWraper>
            }
          />
          <Route
            path="/todo/completed"
            element={
              <TaskWraper>
                <CompletedTasks />
              </TaskWraper>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
