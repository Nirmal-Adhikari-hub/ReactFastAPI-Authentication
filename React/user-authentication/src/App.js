import React, { useState, useEffect, useRef } from 'react';
import api from './api';

const App = () => {
  const [users, setUsers] = useState([]);
  const closeButtonRef = useRef(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  const fetchUsers = async () => {
    const response = await api.get('/users/');
    setUsers(response.data);
  };

  useEffect(() => {
    fetchUsers();
    const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (storedUser) {
      setLoggedInUser(storedUser);
    }
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    await api.post('/users', formData);
    fetchUsers();
    setFormData({
      username: '',
      password: '',
    });
  };

  const handleLoginInputChange = (event) => {
    const { name, value } = event.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post('/auth/token', loginData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const accessToken = response.data.access_token;
      const userData = await api.get('/users/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setLoggedInUser(userData.data);
      setLoginData({
        username: '',
        password: '',
      });

      // Trigger a click event on the close button to close the modal
      if (closeButtonRef.current) {
      closeButtonRef.current.click();
      }
    } catch (error) {
      console.error("Login error:", error);
      // Handle login error here
    }
  }; 

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('loggedInUser');
  };

  useEffect(() => {
    if (loggedInUser) {
      localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
    }
  }, [loggedInUser]);

  return (
    <div>
      <nav className='navbar navbar-expand-lg bg-body-tertiary'>
        <div className='container-fluid'>
          <a className='navbar-brand' href='#'>
            User Authentication App
          </a>
          {loggedInUser ? (
            <button className='btn btn-danger' onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button
              className='btn btn-primary me-2'
              data-bs-toggle='modal'
              data-bs-target='#loginModal'
            >
              Login
            </button>
          )}
        </div>
      </nav>

      <div className='modal' id='loginModal' tabIndex='-1' aria-labelledby='loginModalLabel' aria-hidden='true'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='loginModalLabel'>Login</h5>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close' ref={closeButtonRef}></button>
            </div>
            <div className='modal-body'>
              <form onSubmit={handleLoginSubmit}>
                <div className='mb-3'>
                  <label htmlFor='loginUsername' className='form-label'>Username</label>
                  <input type='text' className='form-control' id='loginUsername' name='username' value={loginData.username} onChange={handleLoginInputChange} />
                </div>
                <div className='mb-3'>
                  <label htmlFor='loginPassword' className='form-label'>Password</label>
                  <input type='password' className='form-control' id='loginPassword' name='password' value={loginData.password} onChange={handleLoginInputChange} />
                </div>
                <button type='submit' className='btn btn-primary'>Login</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {loggedInUser ? (
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-md-5 mt-4'>
              <div className='alert alert-success'>
                Welcome, {loggedInUser.username}!
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-md-5 mt-4'>
              <form onSubmit={handleFormSubmit} className='bg-light p-4 rounded'>
                <h2 className='mb-4'>Sign Up</h2>
                <div className='mb-3'>
                  <label htmlFor='username' className='form-label'>
                    Username
                  </label>
                  <input
                    type='text'
                    className='form-control'
                    id='username'
                    name='username'
                    onChange={handleInputChange}
                    value={formData.username}
                  />
                </div>
                <div className='mb-3'>
                  <label htmlFor='password' className='form-label'>
                    Password
                  </label>
                  <input
                    type='password'
                    className='form-control'
                    id='password'
                    name='password'
                    onChange={handleInputChange}
                    value={formData.password}
                  />
                </div>
                <button type='submit' className='btn btn-primary'>
                  Submit
                </button>
              </form>
            </div>
            <div className='col-md-4 mt-4 ms-5'>
              <table className='table table-striped table-bordered table-hover'>
                <thead>
                  <tr>
                    <th>Users</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.username}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
