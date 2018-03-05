/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(function ($, Drupal, Backbone) {

  Drupal.commerceCart.CartContentsItemsView = Backbone.View.extend({
    cart: {},
    initialize: function initialize() {
      this.cart = this.$el.data('cart-contents');
    },

    events: {
      'change .cart-block--cart-table__quantity input[type="number"]': 'onQuantityChange',
      'click .cart-block--contents__update': 'updateCart'
    },
    onQuantityChange: function onQuantityChange(e) {
      var targetDelta = $(e.target).data('key');
      var value = e.target.value;
      this.cart.order_items[targetDelta].quantity = parseInt(value);
    },
    updateCart: function updateCart() {
      var endpoint = Drupal.url('cart/' + this.cart.order_id + '/items?_format=json');
      fetch(endpoint, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },

        method: 'PATCH',
        body: JSON.stringify(this.cart.order_items)
      }).then(function (res) {}).finally(function () {
        return Drupal.commerceCart.fetchCarts();
      });
    },
    render: function render() {
      var template = Drupal.commerceCart.getTemplate({
        id: 'commerce_cart_js_block_item_contents',
        data: '        <div>\n' + '        <table class="cart-block--cart-table">' + '         <tbody>\n' + '        <% _.each(cart.order_items, function(orderItem, key) { %>' + '            <tr>\n' + '              <td class="cart-block--cart-table__title"><%- orderItem.title %></td>\n' + '              <td class="cart-block--cart-table__quantity">' + '                <input type="number" data-key="<% print(key) %>" value="<% print(parseInt(orderItem.quantity)) %>" style="width: 35px" />' + '              </td>\n' + '              <td class="cart-block--cart-table__price"><%= orderItem.total_price.formatted %></td>\n' + '              <td class="cart-block--cart-table__remove"><button value="<% print(JSON.stringify([cart.order_id, orderItem.order_item_id]))  %>">x</button></td>' + '            </tr>\n' + '        <% }); %>' + '          </tbody>\n' + '          <tfoot>' + '<td/>' + '<td colspan="3"><button class="cart-block--contents__update">Update quantities</button></td>' + '          </tfoot>' + '        </table>\n' + '        </div>'
      });
      this.$el.html(template.render({
        cart: this.cart
      }));
    }
  });
})(jQuery, Drupal, Backbone);