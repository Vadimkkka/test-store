export default {
  namespaced: true,
  state: {
    cart: [],
  },
  mutations: {
    addToCart({ cart }, { groupId, productId }) {
      const itemIndex = cart.findIndex(x => x.groupId === groupId && x.productId === productId)
      if (itemIndex !== -1) {
        cart[itemIndex].quantity++
      } else {
        cart.push({ groupId, productId, quantity: 1})
      }
    },
    removeFromCart({ cart }, { groupId, productId }) {
      const itemIndex = cart.findIndex(x => x.groupId === groupId && x.productId === productId)
      if (itemIndex !== -1) {
        cart.splice(itemIndex, 1)
      }
    },
  },
}
