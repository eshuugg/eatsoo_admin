const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Create FormData object for file upload
      const data = new FormData();
      
      // Append all form data
      for (const key in formData) {
        data.append(key, formData[key]);
      }
      
      // Append the image file
      if (userImage) {
        data.append('userImage', userImage);
      }

      // Make the API call
      const response = await api.post('/users', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('User created successfully!');
      console.log('User created:', response.data);
      
      // Store token if needed
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        roleName: 'USER',
      });
      setUserImage(null);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };