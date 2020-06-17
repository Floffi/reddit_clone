// Action Types
const CREATE_COMMUNITY_REQUEST = 'CREATE_COMMUNITY_REQUEST';
const CREATE_COMMUNITY_SUCCESS = 'CREATE_COMMUNITY_SUCCESS';
const CREATE_COMMUNITY_FAILURE = 'CREATE_COMMUNITY_FAILURE';
const GET_COMMUNITIES_REQUEST = 'GET_COMMUNITIES_REQUEST';
const GET_COMMUNITIES_SUCCESS = 'GET_COMMUNITIES_SUCCESS';
const GET_COMMUNITIES_FAILURE = 'GET_COMMUNITIES_FAILURE';

const initialState = {
  items: [],
  isFetching: false,
};
// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_COMMUNITY_REQUEST:
    case GET_COMMUNITIES_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case CREATE_COMMUNITY_SUCCESS:
      return {
        ...state,
        isFetching: false,
        items: [...state.items, action.community],
      };
    case GET_COMMUNITIES_SUCCESS:
      return {
        ...state,
        isFetching: false,
        items: action.communities,
      };
    case CREATE_COMMUNITY_FAILURE:
    case GET_COMMUNITIES_FAILURE:
      return {
        ...state,
        isFetching: false,
      };
    default:
      return state;
  }
};

// Action Creators
const createCommunityRequest = () => ({
  type: CREATE_COMMUNITY_REQUEST,
});

const createCommunitySuccess = (community) => ({
  type: CREATE_COMMUNITY_SUCCESS,
  community,
});

const createCommunityFailure = (error) => ({
  type: CREATE_COMMUNITY_FAILURE,
  error,
});

const getCommunitiesRequest = () => ({
  type: GET_COMMUNITIES_REQUEST,
});

const getCommunitiesSuccess = (communities) => ({
  type: GET_COMMUNITIES_SUCCESS,
  communities,
});

const getCommunitiesFailure = (error) => ({
  type: GET_COMMUNITIES_FAILURE,
  error,
});

export const createCommunity = (inputData, setErrors, closeModal) => async (
  dispatch
) => {
  dispatch(createCommunityRequest());
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      return dispatch(
        createCommunityFailure({ accessToken: 'Access token not found' })
      );
    }
    const response = await fetch('/api/communities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(inputData),
    });
    const { status, data, error } = await response.json();
    if (response.ok) {
      if (status === 'success') {
        dispatch(createCommunitySuccess(data.community));
        closeModal();
      } else {
        dispatch(createCommunityFailure(error));
        setErrors(error);
      }
    }
  } catch (error) {
    dispatch(createCommunityFailure(error));
  }
};

export const getCommunities = () => async (dispatch) => {
  dispatch(getCommunitiesRequest());
  try {
    const response = await fetch('/api/communities');
    const { status, data, error } = await response.json();
    if (response.ok) {
      if (status === 'success') {
        dispatch(getCommunitiesSuccess(data.communities));
      } else {
        dispatch(getCommunitiesFailure(error));
      }
    } else {
      dispatch(getCommunitiesFailure());
    }
  } catch (error) {
    dispatch(getCommunitiesFailure(error));
  }
};
