import {ADD_COUNTER, ADD_TO_CART} from './mutationTypes'

export default {
  addCart (context, payload) {
    return new Promise(resolve => {
    /* let oldProduct = null 
      方法一：
      for (let item of state.cartList) {
        if (item.iid === payload.iid) {
          oldProduct = item
        }
      }
      方法二：
      let index = state.cartList.indexOf(payload)
      方法三：*/
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)

      if (oldProduct) {
        //方法二
        // let oldProduct = state.cartList[index]
        context.commit(ADD_COUNTER, oldProduct)
        resolve('添加商品数量+1')
      } else {
        payload.count = 1
        // state.cartList.push(paload)
        context.commit(ADD_TO_CART, payload)
        resolve('添加了新的商品')
      }
    })
  }
}