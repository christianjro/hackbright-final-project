import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddFriend() {
  const navigate = useNavigate()
  const [ recipient, setRecipient ] = useState({recipient_email: ""})

  function handleChange(event) {
    setRecipient(prevFormData => {
      return {
        ...prevFormData,
        [event.target.name] : event.target.value
      }
    })
  }

  function handleSubmit(event) {
    event.preventDefault()

    fetch("/new_friend_request", {
      method: "POST", 
      headers: {"Content-Type" : "application/json"},
      body: JSON.stringify(recipient)
    })
      .then(response => {
        if (response.status === 200) {
          return response.json()
        } else {
          throw new Error("Could not send friend request")
        }
      })
    navigate("/")
  }

  return (
    <div className="row mb-5">
        <div className="col">
          <h4>Add Friend</h4>

          <form className="card d-flex flex-row bg-body-secondary border-0 justify-content-center p-3" onSubmit={handleSubmit}>
            <div className="w-100">
                <label className="visually-hidden" htmlFor="recipientEmail">Friend Email:</label>
                <input className="form-control" placeholder="Friend's email" id="recipientEmail" type="text" name="recipient_email" value={recipient.recipient_email} onChange={handleChange} />
            </div>

            <div>
              <button className="btn btn-dark ms-2 text-nowrap" type="submit">Send Request</button>
            </div>
          </form>
        </div>
    </div>
  )
}