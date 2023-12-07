import React,{ Suspense } from 'react'
import SellItem from '../components/SellItem'

import Loading from '../components/Loading'

export default function sell() {
  return (
    <div className='w-4/5 lg:w-2/3'>
        <Suspense fallback={<Loading/>}>
          <SellItem/>
        </Suspense>
        
    </div>
  )
}
