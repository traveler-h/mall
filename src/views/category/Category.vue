<template>
  <div id="category">
    <nav-bar class="nav-bar"><div slot="center">商品分类</div></nav-bar>
    <div class="content">
      <category-tab-menu :categories="categories" @selectItem="selectItem" ></category-tab-menu>
      <scroll class="tab-content" :data="[categoryData]">
        <div>
          <category-content :subcategories="showSubcategory"></category-content>
          <tab-control :title="['综合', '新品', '销量']"
                        @itemClick="tabClick"></tab-control>
          <category-content-detail :category-detail="showCategoryDetail">
          </category-content-detail>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
import Scroll from 'components/common/scroll/Scroll'
import TabControl from 'components/content/tabControl/TabControl'
import CategoryTabMenu from './childComps/CategoryTabMenu'
import CategoryContent from './childComps/CategoryContent'
import CategoryContentDetail from './childComps/CategoryContentDetail'

import {getCategory, getSubcategory, getCategoryDetail} from "network/category";
import {tabControlMixin} from "@/common/mixin";

export default {
  name: "Category",
  components: {
    NavBar,
    CategoryTabMenu,
    Scroll,
    TabControl,
    CategoryContent,
    CategoryContentDetail
  },
  mixins: [tabControlMixin],
  data () {
    return {
      categories: [],
      categoryData: {},
      currentIndex: -1
    }
  },
  created () {
    this._getCategory()
  },
  computed: {
    showSubcategory() {
      if (this.currentIndex === -1) return {}
      return this.categoryData[this.currentIndex].subcategories
    },
    showCategoryDetail() {
      if (this.currentIndex === -1) return []
      return this.categoryData[this.currentIndex].categoryDetail[this.currentType]
    }
  },
  methods: {
    _getCategory() {
      getCategory().then(res => {
        // 1.获取分类数据
        this.categories = res.data.category.list
        // 2.初始化每个类别的子数据
        for (let i = 0; i < this.categories.length; i++) {
          this.categoryData[i] = {
            subcategories: {},
            categoryDetail: {
              'pop': [],
              'new': [],
              'sell': []
            }
          }
        }
        // 3.请求第一个分类的数据
        this._getSubcategories(0)
      })
    },
    _getSubcategories(index) {
      this.currentIndex = index;
      const mailKey = this.categories[index].maitKey;
      getSubcategory(mailKey).then(res => {
        this.categoryData[index].subcategories = res.data
        this.categoryData = {...this.categoryData}
        this._getCategoryDetail('pop')
        this._getCategoryDetail('sell')
        this._getCategoryDetail('new')
      })
    },
    _getCategoryDetail(type) {
      // 1.获取请求的miniWallkey
      const miniWallkey = this.categories[this.currentIndex].miniWallkey;
      // 2.发送请求,传入miniWallkey和type
      getCategoryDetail(miniWallkey, type).then(res => {
        // 3.将获取的数据保存下来
        this.categoryData[this.currentIndex].categoryDetail[type] = res
        this.categoryData = {...this.categoryData}
      })
    },
    /**
     * 事件响应相关的方法
     */
    selectItem(index) {
      this._getSubcategories(index)
    }
  }
}
</script>

<style scoped>
  #category {
    height: 100vh;
    /* position: relative; */
  }

  .nav-bar {
    background-color: var(--color-tint);
    color: #fff;
    font-weight: 700;
  }
  
  .content {
    position: absolute;
    top:44px;
    bottom: 49px;
    left: 0;
    right: 0;
    display: flex;
    overflow: hidden;
  }

  .tab-content {
    height: 100%;
    flex: 3;
  }
</style>