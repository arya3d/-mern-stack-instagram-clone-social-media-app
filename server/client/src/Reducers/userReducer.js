export const initState = null;

export default function userReducer(state, action) {
  switch (action.type) {
    case "ADD_USER":
      return action.payload;
    case "UPDATE-USER":
      return {
        ...state,
        followers: action.payload.followers,
        following: action.payload.following,
      };
    case "REMOVE_USER":
      return null;
    default:
      return state;
  }
}
