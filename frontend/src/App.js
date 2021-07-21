import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import axios from 'axios'
import './index.css'
import Header from './components/layouts/Header'
import Footer from './components/layouts/Footer'
import Home from './components/Home'
import ProductDetails from './components/products/ProductDetails'
import Login from './components/user/Login'
import Register from './components/user/Register'
import Profile from './components/user/Profile'
import UpdateProfile from './components/user/UpdateProfile'
import UpdatePassword from './components/user/UpdatePassword'
import ForgotPassword from './components/user/ForgotPassword'
import ResetPassword from './components/user/ResetPassword'
import ProtectedRoute from './components/route/ProtectedRoute'
import Cart from './components/cart/Cart'
import Shipping from './components/cart/Shipping'
import ConfirmOrder from './components/cart/ConfirmOrder'
import Payment from './components/cart/Payment'
import OrderSuccess from './components/cart/OrderSuccess'
import ListOrders from './components/order/ListOrders'
import OrderDetails from './components/order/OrderDetails'

import { loadUser } from './actions/userActions'
import store from './store'

// Payment
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

function App() {
  const [stripeApiKey, setStripeApiKey] = useState('')

  useEffect(() => {
    store.dispatch(loadUser())

    async function getStripApiKey() {
      const { data } = await axios.get('/api/v1/stripeapi')

      setStripeApiKey(data.stripeApiKey)
    }

    getStripApiKey()
  }, [])

  return (
    <Router>
      <div className='App'>
        <Header />
        <div className='container container-fluid'>
          <Route path='/' component={Home} exact />
          <Route path='/search/:keyword' component={Home} />
          <Route path='/product/:id' component={ProductDetails} />
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register} />
          <Route path='/cart' component={Cart} />
          <Route path='/password/forgot' component={ForgotPassword} exact />
          <Route
            path='/password/reset/:token'
            component={ResetPassword}
            exact
          />
          <ProtectedRoute path='/profile' component={Profile} exact />
          <ProtectedRoute path='/shipping' component={Shipping} />
          <ProtectedRoute path='/order/confirm' component={ConfirmOrder} />
          <ProtectedRoute path='/success' component={OrderSuccess} />

          <ProtectedRoute path='/orders/me' component={ListOrders} exact />
          <ProtectedRoute path='/order/:id' component={OrderDetails} />

          {stripeApiKey && (
            <Elements stripe={loadStripe(stripeApiKey)}>
              <ProtectedRoute path='/payment' component={Payment} />
            </Elements>
          )}
          <ProtectedRoute
            path='/profile/update'
            component={UpdateProfile}
            exact
          />
          <ProtectedRoute
            path='/password/update'
            component={UpdatePassword}
            exact
          />
        </div>
        <Footer />
      </div>
    </Router>
  )
}

export default App
