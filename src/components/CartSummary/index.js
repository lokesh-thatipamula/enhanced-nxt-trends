import CartContext from '../../context/CartContext'

import './index.css'

const CartSummary = () => (
  <CartContext.Consumer>
    {value => {
      const {cartList} = value

      let total = 0
      cartList.forEach(each => {
        total += each.quantity * each.price
      })

      return (
        <div className="cart-summary-container">
          <h1 className="summary-heading">
            Order Total:
            <span className="total-amount"> Rs {total}/-</span>
          </h1>
          <p>{cartList.length} items in cart</p>
          <button className="summary-btn" type="button">
            Checkout
          </button>
        </div>
      )
    }}
  </CartContext.Consumer>
)

export default CartSummary
