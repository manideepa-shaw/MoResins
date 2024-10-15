import React from 'react'
import "../css/ConfirmDelete.css"

const ConfirmDelete = (props) => {
  return (
    <>
    <div className="outside flex">
        <div className="confirmDelete">
            Are you sure?
            <div className="flex">
                <button type="submit" className="left btn" onClick={props.changeDeleteHandlerState}>Cancel</button>
                <button type="submit" className="right btn btn-danger" onClick={props.deleteAccount}>Delete</button>
            </div>
        </div>
    </div>
    </>
  )
}

export default ConfirmDelete