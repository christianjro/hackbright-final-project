import React, {useState, useEffect} from 'react'

export default function ViewFriends() {
  const [friends, setFriends] = useState([])
  const [shouldRefetchFriends, setShouldRefetchFriends] = useState(false)

  useEffect(() => {
    fetch("/friends")
      .then(response => response.json())
      .then(data => setFriends(data.friends))
  }, [shouldRefetchFriends])

  function handleUnfriend(friend_id) {
    fetch("/delete_friendship", {
      method: "POST", 
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({friend_id})
    })
      .then(response => {
        if (response.status === 200) {
          setShouldRefetchFriends(prev => !prev)
        }
      })
  }

  const friendItems = friends.map(item => {
    return (
      <div key={item.id} className="card mx-auto my-3" style={{maxWidth: '40rem'}}>
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <h5 className="card-title text-light mb-0">{item.friend_name}</h5>
            <p className="text-secondary mb-0">{item.friend_email}</p>
          </div>
          
          <button className="btn btn-danger" onClick={() => handleUnfriend(item.friend_id)}>Unfriend</button>
        </div>
      </div>
    )
  })
  console.log(friends)

  return (
    <div className="row justify-content-center p-sm-4">
        <div className="col-md-8">
          <h4 className="mt-5 mb-4 text-primary">My Friends</h4>
          <div className="bg-dark-subtle p-4 rounded-3">
            {friendItems}
          </div>
        </div>
    </div>
  )
}