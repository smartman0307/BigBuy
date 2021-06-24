import React, { useEffect } from 'react'
import MetaData from '../components/layouts/MetaData'

import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '../actions/productActions'

import Product from '../components/products/Product'
import Loader from '../components/layouts/Loader'

const Home = () => {
  const dispatch = useDispatch()

  const { products, loading, error, productsCount } = useSelector(
    (state) => state.products
  )

  useEffect(() => {
    dispatch(getProducts())
  }, [dispatch])

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title={'Buy Products Online'} />
          <h1 id='products_heading'>Latest Products</h1>
          <section id='products' className='container mt-5'>
            <div className='row'>
              {products &&
                products.map((product) => <Product product={product} />)}
            </div>
          </section>
        </>
      )}
    </>
  )
}

export default Home
