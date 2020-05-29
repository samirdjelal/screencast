import {createSlice} from "@reduxjs/toolkit";

const appState = createSlice({
	name: 'app',
	initialState: {
		savingPath: ''
	},
	reducers: {
		changeSavingPath: (state, action) => {
			return {...state, path: action.payload}
		}
	}
})

export const {changeSavingPath} = appState.actions;

export default appState.reducer
