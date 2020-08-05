<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control class="tab-control" 
                  :titles="['流行', '新款', '精选']"
                  @tabClick="tabClick"
                  ref="tabControl1"
                  v-show="isTabFixed"/>
    <scroll class="content" ref="scroll" 
            :probe-type="3" 
            @scroll="contentScroll" 
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners"
       @swiperImageLoad="swiperImageLoad"/>
      <home-recommend-view :recommends="recommends"/>
      <home-feature-view/>
      <tab-control :titles="['流行', '新款', '精选']"
                  @tabClick="tabClick"
                  ref="tabControl2"/>
      <goods-list :goods="showGoods"/>
    </scroll>

    <back-top @click.native="backClick" 
              v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll'


import HomeSwiper from './childComps/HomeSwiper'
import HomeRecommendView from './childComps/HomeRecommendView'
import HomeFeatureView from './childComps/HomeFeatureView'

import {getHomeMultidata, getHomeGoods} from 'network/home'
import {itemListenerMixin, backTopMixin} from 'common/mixin'

export default {
  name: "Home",
  components: {
    NavBar,
    HomeSwiper,
    HomeRecommendView,
    HomeFeatureView,
    TabControl,
    GoodsList,
    Scroll
  },
  mixins: [itemListenerMixin, backTopMixin],
  data () {
    return {
      banners: [],
      recommends: [],
      goods: {
        'pop': {page: 0, list: []},
        'new': {page: 0, list: []},
        'sell': {page: 0, list: []}
      },
      currentType: 'pop',
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0
    }
  },
  computed: {
    showGoods () {
      return this.goods[this.currentType].list
    }
  },
  activated () {
    this.$refs.scroll.scrollTo(0, this.saveY, 0)
    this.$refs.scroll.refresh()
  },
  deactivated () {
    this.saveY = this.$refs.scroll.getScrollY()

    //取消全局事件的监听
    this.$bus.$off('itemImgLoad',this.itemImgListener)
  },
  created () {
    //请求多个数据
    this.getHomeMultidata(),
    //请求商品数据
    this.getHomeGoods('pop'),
    this.getHomeGoods('new'),
    this.getHomeGoods('sell')
    
  },
  mounted () {
     this.tabClick(0)
    
  },
  methods: {
    /**
     * 事件监听相关方法
     */
    
    tabClick (index) {
      switch (index) {
       case 0: 
        this.currentType = 'pop'
        break
      case 1: 
        this.currentType = 'new'
        break
      case 2:
        this.currentType =  'sell'
        break
      }
      // if (this.$refs.tabControl1 !== undefined) {
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
      // }
    },
    contentScroll (position) {
      //判断BackTop是否显示
      this.ListenShowBackTop(position)
      //判断是否吸顶(position: fixed)
      this.isTabFixed = -(position.y) > this.tabOffsetTop
    },
    loadMore () {
      this.getHomeGoods(this.currentType)
    },
    //获取tabControl的offsetTop
    swiperImageLoad () {
      //$el用于获取组件中的元素
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
    },

    /**
     * 网络请求相关方法
     */
    getHomeMultidata () {
      getHomeMultidata().then(res => {
        this.banners = res.data.banner.list
        this.recommends = res.data.recommend.list
     })
    },
    getHomeGoods (type) {
      const page = this.goods[type].page + 1
      getHomeGoods(type, page).then(res => {
        window.console.log(res)
        const goodlist = res.data.list
        this.goods[type].list.push(...goodlist)
        this.goods[type].page + 1

        this.$refs.scroll.finishPullUp()
     })
    }
  }
}
</script>

<style scoped>
  #home {
    /* padding-top: 44px; */
    height: 100vh;
    position: relative;
  }
  .home-nav {
    background-color: var(--color-tint);
    color: #fff;
    /*在使用原生滚动时为了不让导航一起滚动 */
    /* position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 1; */
  }
  /*原生吸顶效果，浏览器支持率低 
  .tab-control {
    position: sticky;  不起作用了
    top: 44px; 
    background: #fff;
    z-index: 2;
  } */
  .tab-control {
    position: relative;
    z-index: 2;
    background-color: #fff;
  }
  .content {
    overflow: hidden;
    position: absolute;
    top: 44px;
    left: 0;
    right: 0;
    bottom: 49px;
  }
/** 方法一
.content{
    margin-top: 44px;
    height: calc(100% - 93px);
    overflow: hidden;
  }
*/
</style>