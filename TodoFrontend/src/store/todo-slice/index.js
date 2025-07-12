import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { act } from "react";
axios.defaults.withCredentials = true;

const initialState = {
  todos: [],
  isLoading: false,
  error: null,
};

// Async thunk to add a todo task
export const addTodo = createAsyncThunk(
  "todo/addTodo",
  async (todo, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/todo/addtask",
        todo,
        {
          withCredentials: true,
        }
      );
      console.log("response:", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add task"
      );
    }
  }
);

export const getAllTasks = createAsyncThunk(
  "todo/alltasks",
  async (todo, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/todo/alltasks",

        {
          withCredentials: true,
        }
      );
      //   console.log("response:", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add task"
      );
    }
  }
);

export const updateTask = createAsyncThunk(
  "todo/updateTask",
  async ({ id, ...updateFields }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/todo/update/${id}`,
        updateFields,
        {
          withCredentials: true,
        }
      );
      console.log("updateTask response:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update task"
      );
    }
  }
);

export const deleteTask = createAsyncThunk(
  "todo/deleteTask",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/todo/delete/${id}`,
        {
          withCredentials: true,
        }
      );
      console.log("deleteTask response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting task (Redux Thunk):", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete task"
      );
    }
  }
);

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(addTodo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todos.push(action.payload);
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getAllTasks.pending, (state) => {
        state.error = null;
        state.loading = true;
      })

      .addCase(getAllTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        if (action.payload.tasks) {
          state.todos = action.payload.tasks;
        } else {
          state.todos = [];
        }
      })
      .addCase(getAllTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        if (action.payload.task) {
          const index = state.todos.findIndex(
            (todo) => todo._id === action.payload.task._id
          );
          if (index !== -1) {
            state.todos[index] = action.payload.task;
          }
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        if (action.payload.task && action.payload.task._id) {
          state.todos = state.todos.filter(
            (todo) => todo._id !== action.payload.task._id
          );
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default todoSlice.reducer;
