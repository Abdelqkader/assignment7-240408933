import { useEffect, useReducer } from 'react';

const initialState = { loading: true, error: null, data: null };

function fetchReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { loading: true, error: null, data: null };
    case 'FETCH_SUCCESS':
      return { loading: false, error: null, data: action.payload };
    case 'FETCH_ERROR':
      return { loading: false, error: action.payload, data: null };
    default:
      return state;
  }
}

// fetcher receives an AbortSignal. deps decide when the request runs again.
export function useFetch(fetcher, deps) {
  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: 'FETCH_START' });

    fetcher(controller.signal)
      .then((data) => dispatch({ type: 'FETCH_SUCCESS', payload: data }))
      .catch((error) => {
        // An aborted request is not a real error: the component moved on.
        if (error.name !== 'AbortError') {
          dispatch({ type: 'FETCH_ERROR', payload: error });
        }
      });

    return () => controller.abort();
    // The caller passes the inputs the fetcher depends on, like a normal dependency list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
