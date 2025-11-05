import Popup from 'reactjs-popup'

import {useState} from 'react'

import CartContext from '../../context/CartContext'

import './index.css'

const CartSummary = () => {
  const [cod, setCod] = useState(false)

  const [success, addSuccessMsg] = useState(false)

  const changePayment = () => {
    setCod(prevState => !prevState.cod)
  }

  const displaySuccessMsg = () => {
    addSuccessMsg(true)
  }

  return (
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
            <Popup
              modal
              trigger={
                <button className="summary-btn" type="button">
                  Checkout
                </button>
              }
            >
              <div className="popup-container">
                <div>
                  <label>
                    <input type="radio" value="Card" disabled />
                    Card
                  </label>
                  <label>
                    <input type="radio" value="Net Banking" disabled />
                    Net Banking
                  </label>
                  <label>
                    <input type="radio" value="UPI" disabled />
                    UPI
                  </label>
                  <label>
                    <input type="radio" value="Wallet" disabled />
                    Wallet
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="Cash on Delivery"
                      onChange={changePayment}
                    />
                    Cash on Delivery
                  </label>
                </div>
                <h1 className="summary-heading">
                  Order Total:
                  <span className="total-amount"> Rs {total}/-</span>
                </h1>
                <p>{cartList.length} items in cart</p>
                <button
                  type="button"
                  disabled={!cod}
                  onClick={displaySuccessMsg}
                  className="summary-btn"
                >
                  Confirm Order
                </button>
                {success && (
                  <p className="success-msg">
                    Your order has been placed successfully
                  </p>
                )}
              </div>
            </Popup>
          </div>
        )
      }}
    </CartContext.Consumer>
  )
}
export default CartSummary
