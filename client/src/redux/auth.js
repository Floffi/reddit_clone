// Action Types
const REGISTER_REQUEST = 'REGISTER_REQUEST';
const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
const REGISTER_FAILURE = 'REGISTER_FAILURE';
const LOGIN_REQUEST = 'LOGIN_REQUEST';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILURE = 'LOGIN_FAILURE';
const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
const LOGOUT_FAILURE = 'LOGOUT_FAILURE';
const LOAD_SESSION_REQUEST = 'LOAD_SESSION_REQUEST';
const LOAD_SESSION_SUCCESS = 'LOAD_SESSION_SUCCESS';
const LOAD_SESSION_FAILURE = 'LOAD_SESSION_FAILURE';

const initialState = {
  session: null,
  isAuthenticated: false,
  isFetching: false,
};
// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_REQUEST:
    case LOGIN_REQUEST:
    case LOAD_SESSION_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
    case LOAD_SESSION_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        session: action.session,
      };
    case REGISTER_FAILURE:
    case LOGIN_FAILURE:
    case LOAD_SESSION_FAILURE:
      return {
        ...state,
        isFetching: false,
      };
    default:
      return state;
  }
};

// Action Creators
const registerRequest = () => ({
  type: REGISTER_REQUEST,
});

const registerSuccess = (session) => ({
  type: REGISTER_SUCCESS,
  session,
});

const registerFailure = (error) => ({
  type: REGISTER_FAILURE,
  error,
});

const loginRequest = () => ({
  type: LOGIN_REQUEST,
});

const loginSuccess = (session) => ({
  type: LOGIN_SUCCESS,
  session,
});

const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  error,
});

const logoutRequest = () => ({
  type: LOGOUT_REQUEST,
});

const logoutSuccess = () => ({
  type: LOGOUT_SUCCESS,
});

const logoutFailure = (error) => ({
  type: LOGOUT_FAILURE,
  error,
});

const loadSessionRequest = () => ({
  type: LOAD_SESSION_REQUEST,
});

const loadSessionSuccess = (session) => ({
  type: LOAD_SESSION_SUCCESS,
  session,
});

const loadSessionFailure = (error) => ({
  type: LOAD_SESSION_FAILURE,
  error,
});

export const register = (inputData, setErrors, closeModal) => async (
  dispatch
) => {
  dispatch(registerRequest());
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputData),
    });
    const { status, data, error } = await response.json();
    if (response.ok) {
      if (status === 'success') {
        dispatch(registerSuccess(data.session));
        localStorage.setItem('accessToken', data.accessToken);
        closeModal();
        window.location.reload();
      } else {
        dispatch(registerFailure());
        setErrors((prevErr) => ({
          ...prevErr,
          ...error,
        }));
      }
    } else {
      dispatch(registerFailure());
    }
  } catch (error) {
    dispatch(registerFailure(error));
  }
};

export const login = (inputData, setErrors, closeModal) => async (dispatch) => {
  dispatch(loginRequest());
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputData),
    });
    const { status, data, error } = await response.json();
    if (response.ok) {
      if (status === 'success') {
        dispatch(loginSuccess(data.session));
        localStorage.setItem('accessToken', data.accessToken);
        closeModal();
        window.location.reload();
      } else {
        dispatch(loginFailure(error));
        setErrors(error);
      }
    } else {
      dispatch(loginFailure());
    }
  } catch (error) {
    dispatch(loginFailure(error));
  }
};

export const logout = () => async (dispatch) => {
  dispatch(logoutRequest());
  try {
    const response = await fetch('/api/auth/logout', {
      credentials: 'include',
    });
    const { status, error } = await response.json();
    if (response.ok) {
      if (status === 'success') {
        dispatch(logoutSuccess());
        window.location.reload();
        localStorage.removeItem('accessToken');
      } else {
        dispatch(logoutFailure(error));
      }
    }
  } catch (error) {
    dispatch(logoutFailure(error));
  }
};

export const loadSession = () => async (dispatch) => {
  dispatch(loadSessionRequest());
  try {
    // Get access token from local storage.
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      return dispatch(loadSessionFailure());
    }
    const response = await fetch('/api/auth/load_session', {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
    const { status, data, error } = await response.json();
    if (response.ok) {
      if (status === 'success') {
        dispatch(loadSessionSuccess(data.user));
      } else {
        dispatch(loadSessionFailure(error));
      }
    } else {
      dispatch(loadSessionFailure());
      dispatch(logout());
    }
  } catch (error) {
    dispatch(loadSessionFailure(error));
  }
};
