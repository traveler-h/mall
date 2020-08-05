import {debounce} from 'common/utils'
import BackTop from 'components/content/backTop/BackTop'

export const itemListenerMixin = {
  data () {
    return {
      itemImgListener: null,
      refresh: null
    }
  },
  mounted () {
    this.refresh = debounce(this.$refs.scroll.refresh, 100)
    //对全局事件进行监听
    this.itemImgListener = () => {
      this.refresh()
    }

    this.$bus.$on('itemImgLoad', this.itemImgListener)
    // window.console.log('混入的内容')
  }
}

export const backTopMixin = {
  data () {
    return {
      isShowBackTop: false,
    }
  },
  components: {
    BackTop
  },
  methods: {
    backClick () {
      this.$refs.scroll.scrollTo(0, 0)
    },
    ListenShowBackTop (position) {
      this.isShowBackTop = -(position.y) > 1000
    },
  }
}

export const tabControlMixin = {
  data: function () {
    return {
      currentType: 'pop'
    }
  },
  methods: {
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = 'pop'
          break
        case 1:
          this.currentType = 'new'
          break
        case 2:
          this.currentType = 'sell'
          break
      }
      window.console.log(this.currentType);
    }
  }
}