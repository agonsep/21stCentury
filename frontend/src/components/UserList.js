import React from 'react';

const UserList = ({ users }) => {
  if (users.length === 0) {
    return <p>No users found. Add a user to get started!</p>;
  }

  return (
    <div className="user-list">
      {users.map((user) => (
        <div key={user.id} className="user-item">
          <h3>{user.name}</h3>
          <p>Email: {user.email}</p>
          <small>ID: {user.id}</small>
        </div>
      ))}
    </div>
  );
};

export default UserList;