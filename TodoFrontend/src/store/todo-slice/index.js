import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "@/lib/axios";

const initialState = {
  todos: [],
  isLoading: false,
  error: null,
};

// Add Task
export const addTodo = createAsyncThunk(
  "todo/addTodo",
  async (todo, { rejectWithValue }) => {
    try {
      const response = await API.post("/api/todo/addtask", todo);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add task"
      );
    }
  }
);

// Get All Tasks
export const getAllTasks = createAsyncThunk(
  "todo/alltasks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/api/todo/alltasks");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tasks"
      );
    }
  }
);

// Update Task
export const updateTask = createAsyncThunk(
  "todo/updateTask",
  async ({ id, ...updateFields }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/api/todo/update/${id}`, updateFields);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update task"
      );
    }
  }
);

// Delete Task
export const deleteTask = createAsyncThunk(
  "todo/deleteTask",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.delete(`/api/todo/delete/${id}`);
      return response.data;
    } catch (error) {
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
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todos = action.payload.tasks || [];
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
        const index = state.todos.findIndex(
          (todo) => todo._id === action.payload.task._id
        );
        if (index !== -1) {
          state.todos[index] = action.payload.task;
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
        state.todos = state.todos.filter(
          (todo) => todo._id !== action.payload.task._id
        );
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default todoSlice.reducer;
