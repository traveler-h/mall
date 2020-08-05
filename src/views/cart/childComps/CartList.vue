<template>
  <div class="cart-list">
    <scroll class="content">
      <cart-list-item v-for="(item, index) in cartList" 
                  :key="index" 
                  :item-info="item">
      </cart-list-item>
    </scroll>
  </div>
</template>

<script>
import CartListItem from './CartListItem'
import Scroll from 'components/common/scroll/Scroll'

import { mapGetters } from 'vuex'

export default {
  name: 'CartList',
  computed: {
    ...mapGetters(['cartList'])
  },
  components: {
    Scroll,
    CartListItem
  },
  // activated () {
  //   this.$refs.scroll.refresh()
  // }
}
</script>

<style scoped>
  .cart-list {
    height: 100vh;
  }
  .content {
    height:calc(100% - 44px - 49px - 40px);
    overflow: hidden;
  }
  
</style>
