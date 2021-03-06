import axios from 'axios';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'

const UploadPic = ({ merchant, setUploadPicWindow }) => {
  const [ fileInputState, setFileInputState ] = useState('');
  const [ selectedFile, setSelectedFile ] = useState('');
  const [ previewSource, setPreviewSource ] = useState('');
  const [ profileOrFeed, setProfileOrFeed ] = useState('upload');
  const { t } = useTranslation()

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    previewFile(file);
  }

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result)
    }
  }

  const handleSubmitFile = (e) => {
    //console.log('submitting')
    e.preventDefault();
    if (!previewSource) {
      return
    }
    // const reader = new FileReader();
    // reader.readAsDataURL(selectedFile);
    uploadImage(previewSource);
  }

  const uploadImage = async (base64EncodedImage) => {
    try {
      const response = await axios.post(`/api/images/${profileOrFeed}/${merchant.id}`, {image: base64EncodedImage})
      alert(response.data)
      if (profileOrFeed === 'profilepic') {

      }
      setUploadPicWindow(false) 
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <div>
      <h1>{t("upoadTxt")}</h1>
      <button onClick={() => setUploadPicWindow(false)}>{t("cancelBtn")}</button>
      <select onChange={(e) => setProfileOrFeed(e.target.value)}>
        <option value={'upload'} >{t("pictureFeedTxt")}</option>
        <option value={'profilepic'}>{t("profileBtn")}</option>
      </select>
      <form onSubmit={handleSubmitFile}>
        <input
          type="file" name="image" onChange={handleFileInputChange} value={fileInputState} className="form-input"
        ></input>
        <button className="btn" type="submit">{t("uploadPhotoBtn")}</button>
      </form>
      {
        previewSource ?
        <div>
          <h3>image should preview</h3>
          <img src={previewSource} alt="chosen" style={{ height: "300px"}}/>
        </div>
        :
        ''  
      }
    </div>
  )
}

export default UploadPic;