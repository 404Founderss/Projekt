import api from './api';

export const userService = {
  // Get profile
  getProfile: () => api.get('/api/user/profile'),
  
  // Update profile (username and email)
  updateProfile: (username, email) => api.put('/api/user/profile', { username, email }),
  
  // Change password
  changePassword: (oldPassword, newPassword) => 
    api.put('/api/user/password', { oldPassword, newPassword }),
  
  // Upload profile picture
  uploadProfilePicture: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/user/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};
