import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import { parseApiError } from "../../utils/parseApiError";
import type { LoginForm, RegisterForm, AuthResponse } from "../../entities/types";

interface JwtPayload {
    id: number
    email: string
}

function decodeToken(token: string): JwtPayload | null {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch {
        return null;
    }
}

interface AuthState {
    token: string | null
    userId: number | null
    email: string | null
    loading: boolean
    error: string | null
}

const storedToken = localStorage.getItem("token");
const storedPayload = storedToken ? decodeToken(storedToken) : null;

const initialState: AuthState = {
    token: storedToken,
    userId: storedPayload?.id ?? null,
    email: storedPayload?.email ?? null,
    loading: false,
    error: null,
};

export const loginThunk = createAsyncThunk<string, LoginForm, { rejectValue: string }>(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await api.post<AuthResponse>("/auth/login", credentials);
            return response.data.token;
        } catch (err) {
            return rejectWithValue(parseApiError(err, "Đăng nhập thất bại"));
        }
    }
);

export const registerThunk = createAsyncThunk<string, Omit<RegisterForm, "confirmPassword">, { rejectValue: string }>(
    "auth/register",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await api.post<AuthResponse>("/auth/register", credentials);
            return response.data.token;
        } catch (err) {
            return rejectWithValue(parseApiError(err, "Đăng ký thất bại"));
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.token = null;
            state.userId = null;
            state.email = null;
            state.error = null;
            localStorage.removeItem("token");
        },
        clearAuthError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload;
                const loginPayload = decodeToken(action.payload);
                state.userId = loginPayload?.id ?? null;
                state.email = loginPayload?.email ?? null;
                localStorage.setItem("token", action.payload);
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Đăng nhập thất bại";
            })
            .addCase(registerThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload;
                const registerPayload = decodeToken(action.payload);
                state.userId = registerPayload?.id ?? null;
                state.email = registerPayload?.email ?? null;
                localStorage.setItem("token", action.payload);
            })
            .addCase(registerThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Đăng ký thất bại";
            });
    },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
