// 请求地址
const url = 'http://192.168.22.46'
/**
 * 
 * @param {String} api  请求地址aip
 * @param {Object} data 请求参数
 * @param {String} method  请求方式
 */
function httpApi (api, data={}, method, ) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: url + api,
            data: data,
            method: method || 'GET',
            header: {
                'content-type': 'application/x-www-form-urlencoded' 
            },
            success (res) {
                return resolve(res.data)
            },
            fail (err) {
                return reject(err)
            }
        })
    })
}

// 导出
module.exports = {
    httpApi
}