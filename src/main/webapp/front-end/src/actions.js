/*
 * action types
 */

export const SET_USER = 'SET_USER'

/*
 * action creators
 */

export function setUser(userId) {
    return {
        type: SET_USER,
        userId: userId
    };
}