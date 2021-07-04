import React, { useEffect, useState } from 'react'
import MetaData from '../components/layouts/MetaData'
import Pagination from 'react-js-pagination'

import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '../actions/productActions'

import Product from '../components/products/Product'
import Loader from '../components/layouts/Loader'

import { useAlert } from 'react-alert'

const Home = () => {
  const [currentPage, setCurrentPage] = useState(1)

  const alert = useAlert()
  const dispatch = useDispatch()

  const { products, loading, error, productsCount, resPerPage } = useSelector(
    (state) => state.products
  )

  useEffect(() => {
    if (error) {
      return alert.error(error)
    }

    dispatch(getProducts(currentPage))
  }, [dispatch, error, alert, currentPage])

  function setCurrentPageNo(pageNumber) {
    setCurrentPage(pageNumber)
  }

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
                products.map((product) => (
                  <Product product={product} key={product._id} />
                ))}
            </div>
          </section>
        </>
      )}
      {resPerPage <= productsCount && (
        <div className='d-flex justify-content-center mt-5'>
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={resPerPage}
            totalItemsCount={productsCount}
            onChange={setCurrentPageNo}
            nextPageText={'Next'}
            prevPageText={'Prev'}
            firstPageText={'First'}
            lastPageText={'Last'}
            itemClass='page-item'
            linkClass='page-link'
          />
        </div>
      )}
    </>
  )
}

export default Home
