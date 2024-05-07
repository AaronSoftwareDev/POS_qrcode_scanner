// src/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    newitems: [],
    tableNum: "",
    userinfor: "",
    userinfor1: "",
    isAuthenticated: false,
    userRole: null,
    dbUsername: null,
  },
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload);
    },
    addTable: (state, action) => {
      state.tableNum = action.payload;
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.userRole = action.payload.userRole;
      state.dbUsername = action.payload.dbUsername;
      console.log("this is the store user name " + state.dbUsername);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userRole = null;
      state.dbUsername = null;
    },
    addUserinfor: (state, action) => {
      state.userinfor = action.payload;
    },
    addUserinfor1: (state, action) => {
      state.userinfor1 = action.payload;
    },
    addNewItem: (state, action) => {
      state.newitems.push(action.payload);
    },
    removeItem: (state, action) => {
      const indexOfdelItem = state.items.findIndex(
        (obj) => obj.name === action.payload
      );

      if (indexOfdelItem !== -1) {
        state.items.splice(indexOfdelItem, 1);
      }
    },
    updateQuantity: (state, action) => {
      const { name, quantity } = action.payload;
      const itemIndex = state.items.findIndex((item) => item.name === name);
      if (itemIndex !== -1) {
        state.items[itemIndex].selectedQty = quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  addNewItem,
  addTable,
  addUserinfor,
  addUserinfor1,
  loginSuccess,
  logout,
} = cartSlice.actions;

export default cartSlice.reducer;
