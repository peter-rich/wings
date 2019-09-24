import { BASE_API_URL, API_ROUTES } from '../../constants'

export const REQUEST_USER_BEGIN = 'REQUEST_USER_BEGIN'
export const REQUEST_USER_SUCCESS = 'REQUEST_USER_SUCCESS'
export const REQUEST_USER_FAIL = 'REQUEST_USER_FAIL'

// login
export function requestUser () {
  let url = `${BASE_API_URL}${API_ROUTES.REQUEST_USER}`
  let config = {
    method: 'GET',
  }

  return (dispatch, getState) => {
    dispatch({ type: REQUEST_USER_BEGIN })

    return fetch(url, config)
      .then(res => res.json())
      .then(json => {
        if (json.success === true) {
          dispatch({
            type: REQUEST_USER_SUCCESS,
            payload: { project_id: json.project_id }
          })
        } else {
          dispatch({
            type: REQUEST_USER_FAIL
          })
        }
      })
      .catch(err => {
        console.error(`error: ${err}`)
      })
  }
}
