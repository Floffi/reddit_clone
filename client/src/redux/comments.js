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
const VOTE_COMMENT_REQUEST = 'VOTE_COMMENT_REQUEST';
const VOTE_COMMENT_SUCCESS = 'VOTE_COMMENT_SUCCESS';
const VOTE_COMMENT_FAILURE = 'VOTE_COMMENT_FAILURE';

const initialState = {
  items: [],
  isFetching: false,
  isVoting: false,
  isCreating: false,
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
    case VOTE_COMMENT_REQUEST:
      return {
        ...state,
        isVoting: true,
      };
    case VOTE_COMMENT_SUCCESS:
      return {
        ...state,
        isVoting: false,
        items: state.items.map((item) => {
          // If comment id and id of the post we voted for are equal, update it.
          if (item.id === action.data.vote.comment_id) {
            let itemCopy = Object.assign({}, item);
            const { action: voteAction, vote } = action.data;
            if (voteAction === 'create') {
              itemCopy.vote = vote.direction;
              itemCopy.upvotes = itemCopy.upvotes ? itemCopy.upvotes : 0;
              itemCopy.upvotes = vote.direction
                ? itemCopy.upvotes + 1
                : itemCopy.upvotes - 1;
            }
            if (voteAction === 'update') {
              itemCopy.vote = vote.direction;
              itemCopy.upvotes = vote.direction
                ? itemCopy.upvotes + 2
                : itemCopy.upvotes - 2;
            }
            if (voteAction === 'delete') {
              const { vote: omit, ...rest } = itemCopy;
              itemCopy = rest;
              itemCopy.upvotes = vote.direction
                ? itemCopy.upvotes - 1
                : itemCopy.upvotes + 1;
            }
            return itemCopy;
          }
          return item;
        }),
      };
    case VOTE_COMMENT_FAILURE:
      return {
        ...state,
        isVoting: false,
      };
    case CREATE_COMMENT_REQUEST:
      return {
        ...state,
        isCreating: true,
      };
    case CREATE_COMMENT_SUCCESS:
      return {
        ...state,
        items: [...state.items, action.comment],
        isCreating: false,
      };
    case CREATE_COMMENT_FAILURE:
      return {
        ...state,
        isCreating: false,
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

const voteCommentRequest = () => ({
  type: VOTE_COMMENT_REQUEST,
});

const voteCommentSuccess = (data) => ({
  type: VOTE_COMMENT_SUCCESS,
  data,
});

const voteCommentFailure = (error) => ({
  type: VOTE_COMMENT_FAILURE,
  error,
});

export const getPostComments = (postId) => async (dispatch) => {
  dispatch(getPostCommentsRequest());
  try {
    const accessToken = localStorage.getItem('accessToken');
    const opts = {};
    if (accessToken) {
      opts.headers = {
        authorization: `Bearer ${accessToken}`,
      };
    }
    const response = await fetch(`/api/comments/post/${postId}`, opts);
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

export const voteComment = (commentId, direction) => async (dispatch) => {
  dispatch(voteCommentRequest());
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      return dispatch(voteCommentFailure('Access token not found'));
    }
    const response = await fetch(`/api/comments/vote/${commentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ direction }),
    });
    const { status, data, error } = await response.json();
    if (response.ok) {
      if (status === 'success') {
        dispatch(voteCommentSuccess(data));
      } else {
        dispatch(voteCommentFailure(error));
      }
    } else {
      dispatch(voteCommentFailure());
    }
  } catch (error) {
    dispatch(voteCommentFailure(error));
  }
};
