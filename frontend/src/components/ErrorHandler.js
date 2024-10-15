import React from 'react'
import "../css/ConfirmDelete.css"

const ErrorHandler = (props) => {
  return (
    <>
    <div className="outside flex">
        <div className="confirmDelete">
            {props.error}
            <div className="flex">
                <button type="submit" className="left btn" onClick={props.closeError}>OK</button>
            </div>
        </div>
    </div>
    </>
  )
}

export default ErrorHandler