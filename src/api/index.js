const _baseUrl = '/analysisapi'
export default {
  /**
   * 获取首页Banner图片数据
   */
  getPoolLogList (name) {
    return `${_baseUrl}/PoolLogList?name=${name}`
  },
  getBannerList () {
    return `${_baseUrl}/banner`
  },
  /**
   * 获取推荐歌单
   */
  getPersonalized () {
    return `${_baseUrl}/personalized`
  },
  /**
   * 获取推荐 mv
   */
  getPersonalizedMV () {
    return `${_baseUrl}/personalized/mv`
  },
  /**
   * @param dateStr
   * @returns {string}
   */
  getQuantMA (dateStr) {
    return `${_baseUrl}/QuantRes?datestr=${dateStr}`
  },
  getTimebucket (sd, ed) {
    return `${_baseUrl}/GetGroupDay?sd=${sd}&ed=${ed}`
  },
  getPoolResList (ID) {
    return `${_baseUrl}/PoolResList?ID=${ID}`
  },
  getSamePoolLogRes (poolIDArr) {
    return `${_baseUrl}/SamePoolLogRes?poolIDArr=${poolIDArr}`
  },
  delPoolResList (ID) {
    return `${_baseUrl}/deletepool`
  },
  /**
   * @param dateStr
   * @returns {string}
   */
  getPoolResLog (dateStr) {
    return `${_baseUrl}/PoolRes?datestr=${dateStr}`
  },
  /**
   * 获取歌词API
   * @param {Number} id
   */
  addTicketpool (name, pool, pd) {
    return `${_baseUrl}/PoolLog`
  },
  /**
   * 获取歌曲 播放URL
   * @param {Number} id
   */
  getSong (id) {
    return `${_baseUrl}/song/url?id=${id}`
  }
}
