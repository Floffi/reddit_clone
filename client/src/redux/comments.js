import { combineReducers } from 'redux';

// Action Types
const GET_POST_COMMENTS_REQUEST = 'GET_POST_COMMENTS_REQUEST';
const GET_POST_COMMENTS_SUCCESS = 'GET_POST_COMMENTS_SUCCESS';
const GET_POST_COMMENTS_FAILURE = 'GET_POST_COMMENTS_FAILURE';
const GET_USER_COMMENTS_REQUEST = 'GET_USER_COMMENTS_REQUEST';
const GET_USER_COMMENTS_SUCCESS = 'GET_USER_COMMENTS_SUCCESS';
const GET_USER_COMMENTS_FAILURE = 'GET_USER_COMMENTS_FAILURE';
const CREATE_COMMENT_REQUEST = 'CREATE_COMMENT_REQUEST';
const CREATE_COMMENT_SUCCESS = 'CREATE_COMMENT_SUCCESS';
const CREATE_COMMENT_FAILURE = 'CREATE_COMMENT_FAILURE';

const initialState = {
  items: [],
  isFetching: false,
};
// Reducers
const post = (state = initialState, action) => {
  switch (action.type) {
    case GET_POST_COMMENTS_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case GET_POST_COMMENTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        items: action.comments,
      };
    case GET_POST_COMMENTS_FAILURE:
      return {
        ...state,
        isFetching: false,
      };
    default:
      return state;
  }
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_COMMENTS_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case GET_USER_COMMENTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        items: state.comments,
      };
    case GET_USER_COMMENTS_FAILURE:
      return {
        ...state,
        isFetching: false,
      };
    default:
      return state;
  }
};

export default combineReducers({
  post,
  user,
});

// Action Creators
const getPostCommentsRequest = () => ({
  type: GET_POST_COMMENTS_REQUEST,
});

const getPostCommentsSuccess = (comments) => ({
  type: GET_POST_COMMENTS_SUCCESS,
  comments,
});

const getPostCommentsFailure = (error) => ({
  type: GET_POST_COMMENTS_FAILURE,
  error,
});

const createCommentRequest = () => ({
  type: CREATE_COMMENT_REQUEST,
});

const createCommentSuccess = (comment) => ({
  type: CREATE_COMMENT_SUCCESS,
  comment,
});

const createCommentFailure = (error) => ({
  type: CREATE_COMMENT_FAILURE,
  error,
});

export const getPostComments = (postId) => async (dispatch) => {
  dispatch(getPostCommentsRequest());
  try {
    const response = await fetch(`/api/comments/post/${postId}`);
    const { status, data, error } = await response.json();
    if (response.ok) {
      if (status === 'success') {
        dispatch(getPostCommentsSuccess(data.comments));
      } else {
        dispatch(getPostCommentsFailure(error));
      }
    }
  } catch (error) {
    dispatch(getPostCommentsFailure(error));
  }
};

export const createComment = (inputData) => async (dispatch) => {
  dispatch(createCommentRequest());
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      return dispatch(createCommentFailure('Access token not found'));
    }
    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputData),
    });
    const { status, data, error } = await response.json();
    if (response.ok) {
      if (status === 'success') {
        dispatch(createCommentSuccess(data.comment));
      } else {
        dispatch(createCommentFailure(error));
      }
    }
  } catch (error) {
    dispatch(createCommentFailure(error));
  }
};
