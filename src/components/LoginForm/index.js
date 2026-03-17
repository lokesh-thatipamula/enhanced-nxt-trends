import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect, Link} from 'react-router-dom'

import './index.css'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
    isOtpSent: false,
    otp: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onChangeOtp = event => {
    this.setState({otp: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
    })
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password, isOtpSent, otp} = this.state

    if (!isOtpSent) {
      // Step 1: Login to get OTP
      const userDetails = {username, password}
      const url = 'http://localhost:5005/login'
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDetails),
      }
      const response = await fetch(url, options)
      const data = await response.json()
      if (response.ok === true) {
        if (data.mfa_required) {
          this.setState({isOtpSent: true, showSubmitError: false, errorMsg: ''})
        } else {
          // Fallback if MFA not enabled for some reason
          this.onSubmitSuccess(data.jwt_token)
        }
      } else {
        this.onSubmitFailure(data.error_msg)
      }
    } else {
      // Step 2: Verify OTP
      const url = 'http://localhost:5005/verify-otp'
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, otp}),
      }
      const response = await fetch(url, options)
      const data = await response.json()
      if (response.ok === true) {
        this.onSubmitSuccess(data.jwt_token)
      } else {
        this.onSubmitFailure(data.error_msg)
      }
    }
  }

  renderPasswordField = () => {
    const {password} = this.state

    return (
      <>
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="password-input-field"
          value={password}
          onChange={this.onChangePassword}
          placeholder="Password"
        />
      </>
    )
  }

  renderUsernameField = () => {
    const {username} = this.state

    return (
      <>
        <label className="input-label" htmlFor="username">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          className="username-input-field"
          value={username}
          onChange={this.onChangeUsername}
          placeholder="Username"
        />
      </>
    )
  }

  renderOtpField = () => {
    const {otp} = this.state

    return (
      <>
        <label className="input-label" htmlFor="otp">
          ENTER OTP
        </label>
        <input
          type="text"
          id="otp"
          className="username-input-field"
          value={otp}
          onChange={this.onChangeOtp}
          placeholder="6 Digit OTP"
          maxLength="6"
        />
      </>
    )
  }

  render() {
    const {showSubmitError, errorMsg, isOtpSent} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-form-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
          className="login-website-logo-mobile-img"
          alt="website logo"
        />
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-login-img.png"
          className="login-img"
          alt="website login"
        />
        <form className="form-container" onSubmit={this.submitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
            className="login-website-logo-desktop-img"
            alt="website logo"
          />
          {!isOtpSent ? (
            <>
              <div className="input-container">
                {this.renderUsernameField()}
              </div>
              <div className="input-container">
                {this.renderPasswordField()}
              </div>
            </>
          ) : (
            <div className="input-container">{this.renderOtpField()}</div>
          )}
          <button type="submit" className="login-button">
            {isOtpSent ? 'Verify OTP' : 'Login'}
          </button>
          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
          {isOtpSent && (
            <p className="otp-helper-text">
              We have sent a 6-digit OTP to your registered phone number.
            </p>
          )}
          {!isOtpSent && (
            <p className="register-link-text">
              Don&apos;t have an account? <Link to="/register">Register</Link>
            </p>
          )}
        </form>
      </div>
    )
  }
}

export default LoginForm
