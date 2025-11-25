"use client"

import { createSlice } from '@reduxjs/toolkit';

interface InitialState {
    username: string | null;
    is_admin: string | null;
    token: string | null;
    token_expires_after: string | null;
}

const initialState: InitialState = {
    username : localStorage.getItem('username'),
    is_admin : localStorage.getItem('is_admin'),
    token : localStorage.getItem('token'),
    token_expires_after : localStorage.getItem('token_expires_after'),
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
    
        init: (state, action) => {
            try{    
                state.token = action.payload.token;
                state.username = action.payload.username;
                state.is_admin = action.payload.is_admin;
                state.token_expires_after = action.payload.token_expires_after;
        
                if (typeof window !== "undefined") {
                    localStorage.setItem('token', JSON.stringify(action.payload.token));
                    localStorage.setItem('username', JSON.stringify(action.payload.username));
                    localStorage.setItem('is_admin', JSON.stringify(action.payload.is_admin));
                    localStorage.setItem('token_expires_after', JSON.stringify(action.payload.token_expires_after));
                }
    
            }catch(error) {
                console.error(error);
            }
        },

        flush: (state) => {
            state.token = null;
            state.username = null;
            state.is_admin = null;
            state.token_expires_after = null;
    
            if (typeof window !== "undefined") {
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                localStorage.removeItem("is_admin");
                localStorage.removeItem("token_expires_after");
            }
            
        },
    
    },
});

export default userSlice.reducer;