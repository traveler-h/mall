<template>
  <div id="detail">
    <detail-nav-bar @itemClick="itemClick" ref="nav"/>
    <scroll class="content" 
            ref="scroll" 
            :probe-type="3"
            @scroll="contentScroll" >
      <div>
        <!-- <ul>
          <li v-for="item in $store.state.cartList" :key="item.value">{{item}}</li>
        </ul> -->
        <detail-swiper :topImages="topImages"></detail-swiper>
        <detail-base-info :goods="goods"/>
        <detail-shop-info :shop="shop" />
        <detail-goods-info :detail-info="detailInfo" @detailImgLoad="detailImgLoad"/>
        <detail-params-info ref="params" :item-params="itemParams" />
        <detail-comment-info ref="comment" :comment="comment" />
        <goods-list ref="recommend" :goods="recommends"/>
      </div>
    </scroll>
    <detail-bottom-bar @addCart="addToCart" />
    <back-top @click.native="backClick" 
          v-show="isShowBackTop"></back-top>
    <!-- <toast :message="message" :show="show"></toast> -->
  </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamsInfo from './childComps/DetailParamsInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
import DetailBottomBar from './childComps/DetailBottomBar'

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'
// import Toast from 'components/common/toast/Toast'

import {getDetail, getRecommend, Goods, Shop} from 'network/detail'
import {itemListenerMixin, backTopMixin} from 'common/mixin'
import {debounce} from 'common/utils'

import {mapActions} from 'vuex'


export default {
  name: 'Detail',
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamsInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList
    // Toast
  },
  mixins: [itemListenerMixin, backTopMixin],
  data () {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      itemParams: {},
      comment: {},
      recommends: [],
      themeTopYs:[],
      getThemeTopY: null,
      currentIndex: 0
      // message: '',
      // show:false
    }
  },
  created () {
    this.iid = this.$route.params.iid

    getDetail(this.iid).then(res => {
      const data = res.result
      this.topImages = data.itemInfo.topImages

      // 获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

      //获取商家信息
      this.shop = new Shop(data.shopInfo)

      //获取详情信息
      this.detailInfo = data.detailInfo

      //取出参数信息
      this.itemParams = data.itemParams

      //取出评论信息
      if (data.rate.cRate !== 0) {
        this.comment = data.rate.list[0]
        
        /*this.themeTopYs = []
        this.themeTopYs.push(0)
        this.themeTopYs.push(-this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(-this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(-this.$refs.recommend.$el.offsetTop)

        window.console.log(this.themeTopYs)*/
      }

     /* this.$nextTick(() => {
        //根据最新的数据，对应的DOM已经被渲染出来，但是图片依然没有加载完
        //offsetTop值不对一般时因为图片没有加载完
        this.themeTopYs = []
        this.themeTopYs.push(0)
        this.themeTopYs.push(-this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(-this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(-this.$refs.recommend.$el.offsetTop)

        window.console.log(this.themeTopYs)
      })
      */
    })

    getRecommend().then(res => {
      // window.console.log(res)
      this.recommends = res.data.list
    })

    //给getThemeTopY赋值
    this.getThemeTopY = debounce(() => {
      this.themeTopYs = []
      this.themeTopYs.push(0)
      this.themeTopYs.push(-this.$refs.params.$el.offsetTop)
      this.themeTopYs.push(-this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(-this.$refs.recommend.$el.offsetTop)
      // this.themeTopYs.push(Number.MAX_VALUE)方案二

      window.console.log(this.themeTopYs)
    },500)

  },
  mounted () {
  },
  /*updated () {
    this.themeTopYs = []

    this.themeTopYs.push(0)
    this.themeTopYs.push(this.$refs.params.$el.offsetTop)
    this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
    this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)

    window.console.log(this.themeTopYs)
  },*/
  destroyed () {
    this.$bus.$off('itemImgLoad', this.itemImgListener)
  },
  methods: {
    ...mapActions(['addCart']),
    detailImgLoad () {
      this.refresh()
      this.getThemeTopY()
    },
    itemClick (index) {
      this.$refs.scroll.scrollTo(0, this.themeTopYs[index], 200)
      window.console.log(index)
    },
    contentScroll (position) {
      //1.获取y值
      const positionY = -position.y
      // window.console.log(position.y)
      // window.console.log(positionY) +
      // window.console.log(this.themeTopYs) -
      // 2.positionY和主题中值进行对比
      // for(let i in this.themeTopYs){
      let length = this.themeTopYs.length
      for(let i = 0; i < length - 1; i++){
        if(this.currentIndex !== i && ((i < length - 1 && positionY > -this.themeTopYs[i] && positionY < -this.themeTopYs[i + 1]) || (i === length -1 && positionY > -this.themeTopYs[i]))){
          this.currentIndex = i
          this.$refs.nav.currentIndex = this.currentIndex
        }
        //方案二 （推荐不联动）
        // if(this.currentIndex !== i && (positionY >= -this.themeTopYs[i] && positionY < -this.themeTopYs[i + 1])) {
        //   this.currentIndex = i
        //   this.$refs.nav.currentIndex = this.currentIndex
        // }
      }
      this.ListenShowBackTop(position)
    },
    addToCart () {
      //1.获取购物车展示的信息
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.realPrice
      product.iid = this.iid

      //2.将商品加入到购物车
      //3.添加到购物车成功
      this.addCart(product).then(res => {
        // window.console.log(res)
        // this.show = true
        // this.message = res
        // setTimeout(() => {
        //   this.show = false
        //   this.message = ''
        // }, 1500)
        this.$toast.show(res)
      })
      // this.$store.dispatch('addCart', product).then(res => {
      //   window.console.log(res)
      // })

      // window.console.log(this.$store.state.cartList)

      
    }
  }
}
</script>

<style scoped>
  #detail {
    height: 100vh;
    position: relative;
    z-index: 1;
    background-color: #fff;
  }

  .content {
    /* position: absolute;
    top: 44px;
    bottom: 49px; */
    overflow: hidden;
    height: calc(100% - 44px - 49px);
  }

  .back-top {
    position: fixed;
    right: 10px;
    bottom: 65px;
  }
</style>