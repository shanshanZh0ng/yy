import * as types from './mutations-types'

const mutations = {
  [types.SET_APPLICATION_NAME] (state, name) {
    state.application.name = name
  }
}

export default mutations
