<template>
  <div id="Products">
    <a-collapse>
      <a-collapse-panel 
        v-for="({ groupName, products }, groupId) in productsByGroups"
        :key="groupId"
        :header="groupName"
        :disabled="Object.keys(products).length === 0"
      >
        <a-list 
          size="small"
          :data-source="Object.values(products)"
        >
          <a-list-item slot="renderItem" slot-scope="product">
            <a-list-item-meta :title="`${product.name} (${product.quantity})`"/>
            <a-tag slot="actions" :color="product.priceChangeStatus">₽ {{ product.price.RUB }}</a-tag>
            <div slot="actions">
              <a-button 
                type="primary" 
                icon="shopping-cart"
                :disabled="!product.quantity"
                @click="onClickAddToCart(groupId, product.id, product.quantity)"
              >
                Купить
              </a-button>
            </div>
          </a-list-item>
        </a-list>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState({
      productsByGroups: state => state.products.productsByGroups,
      cart: state => state.cart.cart
    })
  },
  methods: {
    ...mapMutations('cart', ['addToCart']),
    onClickAddToCart(groupId, productId, quantity) { 
      const cartItemIndex = this.cart.findIndex(x => x.groupId === groupId && x.productId === productId)
      if (this.cart[cartItemIndex]?.quantity === quantity) return false
      this.addToCart({ groupId, productId })
    }
  }
}
</script>
<style>
#Products {
  margin-right: 20px;
}

#Products .ant-collapse-content > .ant-collapse-content-box {
  padding: 8px;
}
</style>

