<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  name: 'Scroll',
  props: {
    probeType: {
      type: Number,
      default: 0
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      scroll: {}
    }
  },
  mounted () {
    // setTimeout(this.__initScroll, 20)
      //1.创建BScroll对象
      this.scroll = new BScroll(this.$refs.wrapper, {
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad,
      click: true
    })
    //2.监听滚动到的位置
    if (this.probeType === 2 || this.probeType === 3){
      this.scroll.on('scroll', position => {
        this.$emit('scroll', position)
      })
      // this.scroll.on('scroll', (position) => {
      //   this.$emit('scroll', position)
      // })
    }
    //3.监听上拉事件
    if (this.pullUpLoad) {
      this.scroll.on('pullingUp', () => {
        this.$emit('pullingUp')
      })
    }
  },
  methods: {
    scrollTo(x, y, time=300) {
      this.scroll && this.scroll.scrollTo(x, y, time)
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp()
    },
    // watch: {
    //   data () {
    //     setTimeout(this.refresh, 20)
    //   }
    // },
    getScrollY() {
      return this.scroll ? this.scroll.y : 0
    }
  }  
}

</script>

<style scoped>

</style>