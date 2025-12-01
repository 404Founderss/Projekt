import api from './api';

export const userService = {
  // Profil lekérése
  getProfile: () => api.get('/api/user/profile'),
  
  // Profil frissítése (email)
  updateProfile: (email) => api.put('/api/user/profile', { email }),
  
  // Jelszó változtatás
  changePassword: (oldPassword, newPassword) => 
    api.put('/api/user/password', { oldPassword, newPassword }),
  
  // Profilkép feltöltés
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
