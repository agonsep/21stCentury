import React, { useState } from 'react';

const UserForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    const success = await onSubmit({ name: name.trim(), email: email.trim() });
    
    if (success) {
      setName('');
      setEmail('');
    }
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter user name"
          disabled={isSubmitting}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter user email"
          disabled={isSubmitting}
        />
      </div>
      
      <button 
        type="submit" 
        className="button"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Adding...' : 'Add User'}
      </button>
    </form>
  );
};

export default UserForm;