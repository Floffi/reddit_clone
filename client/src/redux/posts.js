import { combineReducers } from 'redux';

// Action Types
const GET_COMMUNITY_POSTS_REQUEST = 'GET_COMMUNITY_POSTS_REQUEST';
const GET_COMMUNITY_POSTS_SUCCESS = 'GET_COMMUNITY_POSTS_SUCCESS';
const GET_COMMUNITY_POSTS_FAILURE = 'GET_COMMUNITY_POSTS_FAILURE';
const CREATE_POST_REQUEST = 'CREATE_POST_REQUEST';
const CREATE_POST_SUCCESS = 'CREATE_POST_SUCCESS';
const CREATE_POST_FAILURE = 'CREATE_POST_FAILURE';
const VOTE_REQUEST = 'VOTE_REQUEST';
const VOTE_SUCCESS = 'VOTE_SUCCESS';
const VOTE_FAILURE = 'VOTE_FAILURE';

const initialState = {
  items: [],
  isFetching: false,
  isCreating: false,
  isVoting: false,
};
// Reducer
const community = (state = initialState, action) => {
  switch (action.type) {
    case GET_COMMUNITY_POSTS_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case GET_COMMUNITY_POSTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        items: action.posts,
      };
    case GET_COMMUNITY_POSTS_FAILURE:
      return {
        ...state,
        isFetching: false,
      };
    case CREATE_POST_REQUEST:
      return {
        ...state,
        isCreating: true,
      };
    case CREATE_POST_SUCCESS:
      return {
        ...state,
        isCreating: false,
        items: [...state.items, action.post],
      };
    case CREATE_POST_FAILURE:
      return {
        ...state,
        isCreating: false,
      };
    case VOTE_REQUEST:
      return {
        ...state,
        isVoting: true,
      };
    case VOTE_SUCCESS:
      return {
        ...state,
        isVoting: false,
        items: state.items.map((item) => {
          // If post id and id of the post we voted for are equal, update it.
          if (item.id === action.data.vote.post_id) {
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
    case VOTE_FAILURE:
      return {
        ...state,
        isVoting: false,
      };
    default:
      return state;
  }
};

const discussion = (
  state = { item: null, isFetching: false, isVoting: false },
  action
) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default combineReducers({
  community,
  discussion,
});

// Action Creators
const getCommunityPostsRequest = () => ({
  type: GET_COMMUNITY_POSTS_REQUEST,
});

const getCommunityPostsSuccess = (posts) => ({
  type: GET_COMMUNITY_POSTS_SUCCESS,
  posts,
});

const getCommunityPostsFailure = (error) => ({
  type: GET_COMMUNITY_POSTS_FAILURE,
  error,
});

const createPostRequest = () => ({
  type: CREATE_POST_REQUEST,
});

const createPostSuccess = (post) => ({
  type: CREATE_POST_SUCCESS,
  post,
});

const createPostFailure = (error) => ({
  type: CREATE_POST_FAILURE,
  error,
});

const voteRequest = () => ({
  type: VOTE_REQUEST,
});

const voteSuccess = (data) => ({
  type: VOTE_SUCCESS,
  data,
});

const voteFailure = (error) => ({
  type: VOTE_FAILURE,
  error,
});

export const getCommunityPosts = (communityName) => async (dispatch) => {
  dispatch(getCommunityPostsRequest());
  try {
    const accessToken = localStorage.getItem('accessToken');
    const opts = {};
    if (accessToken) {
      opts.headers = {
        authorization: `Bearer ${accessToken}`,
      };
    }
    const url = communityName
      ? `/api/posts/community/${communityName}`
      : ' api/posts/community';
    const response = await fetch(url, opts);
    const { status, data, error } = await response.json();
    if (response.ok) {
      if (status === 'success') {
        dispatch(getCommunityPostsSuccess(data.posts));
      } else {
        dispatch(getCommunityPostsFailure(error));
      }
    }
  } catch (error) {
    dispatch(getCommunityPostsFailure(error));
  }
};

export const createPost = (inputsData) => async (dispatch) => {
  dispatch(createPostRequest());
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      return dispatch(createPostFailure('Access token not found'));
    }
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputsData),
    });
    const { status, data, error } = await response.json();
    if (response.ok) {
      if (status === 'success') {
        dispatch(createPostSuccess(data.post));
      } else {
        dispatch(createPostFailure(error));
      }
    }
  } catch (error) {
    dispatch(createPostFailure(error));
  }
};

export const vote = (postId, direction) => async (dispatch) => {
  dispatch(voteRequest());
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      return dispatch(voteFailure('Access token not found'));
    }
    const response = await fetch(`/api/posts/vote/${postId}`, {
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
        dispatch(voteSuccess(data));
      } else {
        dispatch(voteFailure(error));
      }
    } else {
      dispatch(voteFailure());
    }
  } catch (error) {
    console.log('Error', error);
    dispatch(voteFailure(error));
  }
};
