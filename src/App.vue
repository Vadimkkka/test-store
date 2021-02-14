<template>
  <a-spin :spinning="isLoading">
    <div id="header"> 
      <a-space>
        Курс:
        <a-input-number
          :default-value="exchangeRates.RUB"
          :min="20"
          :max="80"
          :formatter="value => `₽ ${value}`"
          :parser="value => value.replace(/\₽\s?|(,*)/g, '')"
          @change="onChangeExchangeRate"
        />
      </a-space>
      <a-space>
        <a-statistic-countdown
          title="Обновление через:"
          :value="deadline"
          format="ss:SSS"
          @finish="onFinish"
        />
        <a-button type="link" icon="sync" @click="onFinish"/>
      </a-space>
    </div>
    <div id="workflow">
      <Products/>
      <Cart/>
    </div>
  </a-spin>
</template>

<script>
import Products from './components/Products'
import Cart from './components/Cart'
import { mapActions, mapState, mapMutations } from 'vuex'

export default {
  components: {
    Products,
    Cart
  },
  computed: {
    ...mapState({
      isLoading: state  => state.isLoading,
      exchangeRates: state => state.products.exchangeRates
    })
  },
  data() {
    return {
      deadline: Date.now() + 15000
    }
  },
  beforeMount() {
    this.getProducts()
  },
  methods: {
    ...mapActions('products', ['getProducts']),
    ...mapMutations('products', ['updateExchangeRates']),
    onChangeExchangeRate(val) {
      if (typeof val === 'number' && val >= 20 && val <= 80) {
        this.updateExchangeRates({ key: 'RUB', val })
      }
    },
    async onFinish() {
      await this.getProducts()
      this.deadline = Date.now() + 15000
    }
  }
}
</script>

<style>
body {
  padding: 0 16px;
}
#header {
  display:flex; 
  justify-content: space-around;
  padding: 16px;
}
#header .ant-statistic {
  display: flex;
  align-items: center;
}
#workflow {
  display: flex;
}
#workflow > div {
  flex: 1;
}
.ant-statistic-title {
  margin-right: 8px;
}
.ant-list-item-action .ant-tag {
  width: 70px;
}
</style>
