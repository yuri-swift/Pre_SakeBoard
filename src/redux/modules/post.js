import firebase from 'react-native-firebase';

const initialState = {
  creating: false,
  created: false,
  categoryId: 0,
  categoryName: '',
  sakeName: '',
  areaName: '',
  companyName: '',
  starCount: 0,
  text: '',
};

export default function reducers(state = initialState, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case 'SELECT':
      return {
        categoryId: payload.categoryId,
        categoryName: payload.categoryName,
        sakeName: payload.name,
        areaName: payload.areaName,
        companyName: payload.companyName,
        starCount: payload.starCount,
        text: payload.text,
      };
    case 'CLEAR': {
      return {
        initialState,
      };
    }
    case 'CREATE': {
      return {
        ...state,
        creating: true,
        created: false,
      };
    }
    case 'CREATE_SUCCESS': {
      return {
        ...state,
        creating: false,
        created: true,
      };
    }
    case 'CREATE_FAIL': {
      return {
        ...state,
        creating: false,
        created: true,
        error: payload,
      };
    }
    default:
      return state;
  }
}

export function selectSake(sake) {
  return {
    type: 'SELECT',
    payload: sake,
  };
}

function create() {
  return {
    type: 'CREATE',
  };
}

function createSuccess() {
  return {
    type: 'CREATE_SUCCESS',
  };
}

function createFail(err) {
  return {
    type: 'CREATE_FAIL',
    payload: err,
  };
}

export const createSakeRecord = item => (dispatch, getState) => {
  dispatch(create());

  const { user, post } = getState();
  const userCollection = firebase.firestore().collection('user');
  const postCollection = firebase.firestore().collection('post');

  const data = {
    categoryId: post.categoryId,
    categoryName: post.categoryName,
    sakeName: post.sakeName,
    areaName: post.areaName,
    companyName: post.companyName,
    starCount: item.starCount,
    text: item.text,
    timestamp: Date.now(),
    user: userCollection.doc(user.uid),
  };

  postCollection.add(data)
    .then(() => {
      dispatch(createSuccess());
    })
    .catch(e => createFail(e));
};