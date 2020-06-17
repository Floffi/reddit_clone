// Action Types
const OPEN_SIDEBAR = 'OPEN_SIDEBAR';
const CLOSE_SIDEBAR = 'CLOSE_SIDEBAR';
const OPEN_REGISTER = 'OPEN_REGISTER';
const CLOSE_REGISTER = 'CLOSE_REGISTER';
const OPEN_LOGIN = 'OPEN_LOGIN';
const CLOSE_LOGIN = 'CLOSE_LOGIN';
const OPEN_COMMUNITY = 'OPEN_COMMUNITY';
const CLOSE_COMMUNITY = 'CLOSE_COMMUNITY';

const initialState = {
  sidebar: false,
  login: false,
  register: false,
  community: false,
};
// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case OPEN_SIDEBAR:
      return {
        ...state,
        sidebar: true,
      };
    case CLOSE_SIDEBAR:
      return {
        ...state,
        sidebar: false,
      };
    case OPEN_REGISTER:
      return {
        ...state,
        register: true,
      };
    case CLOSE_REGISTER:
      return {
        ...state,
        register: false,
      };
    case OPEN_LOGIN:
      return {
        ...state,
        login: true,
      };
    case CLOSE_LOGIN:
      return {
        ...state,
        login: false,
      };
    case OPEN_COMMUNITY:
      return {
        ...state,
        community: true,
      };
    case CLOSE_COMMUNITY:
      return {
        ...state,
        community: false,
      };
    default:
      return state;
  }
};

// Action Creators
export const openSidebar = () => ({
  type: OPEN_SIDEBAR,
});

export const closeSidebar = () => ({
  type: CLOSE_SIDEBAR,
});

export const openRegister = () => ({
  type: OPEN_REGISTER,
});

export const closeRegister = () => ({
  type: CLOSE_REGISTER,
});

export const openLogin = () => ({
  type: OPEN_LOGIN,
});

export const closeLogin = () => ({
  type: CLOSE_LOGIN,
});

export const openCommunity = () => ({
  type: OPEN_COMMUNITY,
});

export const closeCommunity = () => ({
  type: CLOSE_COMMUNITY,
});
