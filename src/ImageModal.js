import React, { useState } from 'react';
import Modal from 'react-modal';

const ImageModal = ({ isOpen, closeModal }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [fileinp, setFileinp] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFileinp(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Add logic to save the selectedImage, e.g., send it to the server or update the state.
    // For now, you can just log it to the console.
    var myHeaders = new Headers();
    const token = localStorage.getItem('token');
    myHeaders.append("Authorization", "Bearer "+token);
    const fileInput = document.getElementById("file");
    var formdata = new FormData();
    formdata.append("image", fileInput.files[0]);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch("https://lionfish-wired-fairly.ngrok-free.app/api/UploadImage", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
    
    window.location.reload();
    closeModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Image Modal"
      style={{
        overlay: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
        content: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        },
      }}
    >
      <h2>Upload Your Image</h2>
      <input type="file" id='file' accept="image/*" onChange={handleImageChange} />
      {selectedImage && (
        <img
          src={selectedImage}
          alt="Selected"
          style={{ maxWidth: '100%', maxHeight: '200px', margin: '10px 0' }}
        />
      )}
      <div className='row'>
      <button onClick={handleSave} className='choose-button'>OK</button>
      <button onClick={closeModal} className='no-button'>Cancel</button>
      </div>
    </Modal>
  );
};

export default ImageModal;
