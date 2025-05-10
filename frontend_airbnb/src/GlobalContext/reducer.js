export const loginreducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_USER":
      return { ...state, person: action.person,role: action.role }

    case "LOGOUT":
      return { ...state, person: undefined ,role: undefined }

    default:
      return state;
  }
};
