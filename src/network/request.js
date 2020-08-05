import axios from 'axios'

export function request(option) {
    return new Promise((resolve, reject) => {
        const instance = axios.create({
            baseURL: 'http://123.207.32.32:8000',
            timeout: 5000
        })
        instance.interceptors.request.use(config => {
            return config
        }, err => {
            return err
        })
        instance.interceptors.response.use(res => {
            return res.data
        }, err => {
            window.console.log('来到了response拦截failure中')
            window.console.log(err)
            if (err && err.response) {
                switch (err.response.status) {
                    case 400:
                        err.message = '请求错误'
                        break
                    case 401:
                        err.message = '未授权的访问'
                        break
                }
            }
            return err
        })

        // 2.传入对象进行网络请求
        instance(option).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}