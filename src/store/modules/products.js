export default {
  namespaced: true,
  state: {
    productsByGroups: {},
    exchangeRates: { RUB: 60 },
  },
  mutations: {
    updateExchangeRates({ exchangeRates, productsByGroups }, { key, val }) {
      exchangeRates[key] = val
      // Обновляем стоимость для продуктов
      for (let groupId in productsByGroups) {
        for (let itemId in productsByGroups[groupId].products) {
          productsByGroups[groupId].products[itemId].price[key] = +(productsByGroups[groupId].products[itemId].price.USD * val).toFixed(2)
        }
      }
    },
    setProductsByGroups(state, { data, groups }) {
      // Преобразование групп, для дальнейшей работы
      const productsByGroups = Object.fromEntries(Object.entries(groups).map(x => [x[0], { groupName: x[1].G, products: {} }]))
      for (let {C: priceInUSD, G: groupId, T: productId, P: quantity} of data) {
        // Проверяем есть ли группа и продукт в этой группе
        if (groups[groupId]?.B[productId]) {
          let priceChangeStatus = ''
          // Проверяем был ли такой продукт в прошлом и сравниваем стоимость
          let previousPriceInUSD = state.productsByGroups.[groupId]?.products[productId]?.price.USD
          if (previousPriceInUSD !== undefined && previousPriceInUSD != priceInUSD) {
            priceChangeStatus = priceInUSD > previousPriceInUSD ? 'green' : 'red' 
          }
          productsByGroups[groupId].products[productId] = {
            id: productId,
            name: groups[groupId].B[productId].N, 
            quantity,
            priceChangeStatus,
            price: { 
              USD: priceInUSD, 
              RUB: +(state.exchangeRates.RUB * priceInUSD).toFixed(2) 
            }
          }
        }
      }
      state.productsByGroups = productsByGroups
    }
  },
  actions: {
    // Получаем данные о продуктах
    async getProducts({ dispatch, commit }) {
      try {
        commit('setLoading', true, { root: true })
        const data = await dispatch('getProductsData')
        const groups = await dispatch('getProductsGroups')
        commit('setProductsByGroups', { data: data.Value.Goods, groups })
        commit('setLoading', false, { root: true })
      } catch (e) {
        console.log(e)
      }
    },
    async getProductsData() {
      let response = await fetch('/products/data.json')
      if (response.ok) {
        return await response.json()
      }
      throw new Error("HTTP error " + response.status)
    },
    async getProductsGroups() {
      let response = await fetch('/products/names.json')
      if (response.ok) {
        return await response.json()
      }
      throw new Error("HTTP error " + response.status)
    }
  }
}
