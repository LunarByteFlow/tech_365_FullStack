import React from 'react'

const Loading = () => {
  return (
    <div>
      <div>
        <div className="fixed top-0 left-0 w-full h-full bg-black opacity-70 z-50 flex justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500"></div>
        </div>
      </div>
    </div>
  )
}

export default Loading
