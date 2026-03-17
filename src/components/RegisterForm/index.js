import {Component} from 'react'
import {Link} from 'react-router-dom'
import './index.css'

class RegisterForm extends Component {
  state = {
    username: '',
    password: '',
    phoneNumber: '',
    showSubmitError: false,
    errorMsg: '',
    registrationSuccess: false,
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onChangePhoneNumber = event => {
    this.setState({phoneNumber: event.target.value})
  }

  onSubmitSuccess = () => {
    this.setState({registrationSuccess: true, showSubmitError: false})
    setTimeout(() => {
      const {history} = this.props
      history.replace('/login')
    }, 2000)
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password, phoneNumber} = this.state
    const userDetails = {username, password, phoneNumber}
    const url = 'http://localhost:5005/register'
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
      this.onSubmitSuccess()
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  renderPhoneNumberField = () => {
    const {phoneNumber} = this.state
    return (
      <>
        <label className="input-label" htmlFor="phoneNumber">
          PHONE NUMBER (WITH COUNTRY CODE)
        </label>
        <input
          type="text"
          id="phoneNumber"
          className="username-input-field"
          value={phoneNumber}
          onChange={this.onChangePhoneNumber}
          placeholder="+91 XXXXXXXXXX"
        />
      </>
    )
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

  render() {
    const {showSubmitError, errorMsg, registrationSuccess} = this.state

    return (
      <div className="register-form-container">
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
          <h1 className="register-heading">Register</h1>
          <div className="input-container">{this.renderUsernameField()}</div>
          <div className="input-container">{this.renderPasswordField()}</div>
          <div className="input-container">{this.renderPhoneNumberField()}</div>
          <button type="submit" className="login-button">
            Register
          </button>
          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
          {registrationSuccess && (
            <p className="success-message">
              Registration Successful! Redirecting to login...
            </p>
          )}
          <p className="login-link-text">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    )
  }
}

export default RegisterForm
