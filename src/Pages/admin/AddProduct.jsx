const [preview, setPreview] = useState(null);

const handleImageChange = (e) => {

  const file = e.target.files[0];

  setFormData(prev => ({
    ...prev,
    image: file
    
  }));

  setPreview(URL.createObjectURL(file));
};