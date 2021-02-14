
<template>
  <div>
    <a-list :data-source="cart">
      <a-list-item 
        slot="renderItem" 
        slot-scope="{ groupId, productId, quantity }, itemIndex"
      >
        <a-list-item-meta>
          <a-tag slot="avatar" color="orange">
            {{ productsByGroups[groupId].groupName }}
          </a-tag>
          <span slot="title">
            {{ productsByGroups[groupId].products[productId].name }}
          </span>
        </a-list-item-meta>
        <a-input-number 
          slot="actions" 
          v-model="cart[itemIndex].quantity"
          :min="1" 
          :max="productsByGroups[groupId].products[productId].quantity" 
          :parser="value => value.replace(/(\.*)/g, '')"
        />
        <a-tag 
          slot="actions" 
          :color="productsByGroups[groupId].products[productId].priceChangeStatus">
            ₽ {{ productsByGroups[groupId].products[productId].price.RUB }}
          </a-tag>
          <a-button 
            slot="actions"
            type="danger" 
            icon="delete"
            @click="removeFromCart({ groupId, productId })"
          />
      </a-list-item>
    </a-list>
    <a-statistic 
      v-if="total" 
      title="Общая стоимость:" 
      :precision="2" 
      :value="total"
    >
      <template slot="prefix">₽</template>
    </a-statistic>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState({
      cart: state => state.cart.cart,
      productsByGroups: state => state.products.productsByGroups
    }),
    total() {
      let result = 0
      for (let { groupId, productId, quantity } of this.cart) {
        result += this.productsByGroups[groupId].products[productId].price.RUB * quantity
      }
      return +(result).toFixed(2)
    }
  },
  methods: {
    ...mapMutations('cart',['removeFromCart']),
  }
}
</script>
<style scoped>
</style>

