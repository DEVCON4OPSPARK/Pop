import React, { useState } from 'react';
import styled from 'styled-components';
import Confirmation from '../../components/Confirmation.jsx';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next'

const Div = styled.div`
margin-bottom: 9px;
`
const Div2 = styled.div`
margin-bottom: 60px;
`

const H3 = styled.h1`
margin-top: 53px;
text-shadow: 2px 2px 4px #000000;
`
const Buss = styled.h3`
margin-top: 15px;

`
const Input = styled.input`
margin-bottom: -14px;
`
const Cat = styled.h3`
margin-bottom: 3px;
`
const Info = styled.h3`
margin-top: -30px;
`

const CreatePop = ({ user, setUser, yourPopups, setYourPopups, currentLocMarker, setCurrentLocMarker, merchData, setMerchData }) => {
  const [ businessName, setBusinessName ] = useState('');
  const [ category, setCategory ] = useState();
  const [ info, setInfo ] = useState('');
  const [ website, setWebsite ] = useState('');
  const [ createConfirm, setCreateConfirm ] = useState(false);
  const [ cancelConfirm, setCancelConfirm ] = useState(false);
  const [ addCreateButtons, setAddCreateButtons ] = useState(true);
  const [ nameTakenBool, setNameTakenBool ] = useState(false);
  const [ pickCategoryBool, setPickCategoryBool ] = useState(false);
  const back = useHistory();
  const {t} = useTranslation();
  console.log(currentLocMarker);

  const finalizeCreation =  async () => {
    try {
      const merchNames = await axios.get('/api/merchants');
      !merchNames.data.filter(merch => businessName.toLowerCase() === merch.name.toLowerCase()).length ?
      console.log('there is no merchant with this name') :
      setNameTakenBool(true);

      !category ? setPickCategoryBool(true) : setPickCategoryBool(false);

      if (!nameTakenBool && !pickCategoryBool) {

      const newPop = await axios.post('/api/merchants/add', {
        name: businessName,
        category: category,
        info: info,
        website: website,
        adminId: user.id,
        isOpen : false
      })
      setYourPopups([newPop.data, ...yourPopups]);
      setMerchData([newPop.data, ...merchData]);
      console.log('POP CREATED!')
      back.push('/yourpopups')
      } else {
        console.log('choose category');
      }

    } catch (e) {
      console.log(e);
    }
  }

    return (

      <div>
        <Div></Div>
        <H3>{t("createPopUpBtn")}</H3>
        <hr/>
        <Buss>{t("businessNameTxt")}</Buss>
        { nameTakenBool ? <h5 className='issue'>{`${businessName} is already taken!`}</h5> : ''}
        <Input onChange={(e) => {
          setNameTakenBool(false);
          console.log(e.target.value);
          setBusinessName(e.target.value);
          }}></Input>
         <Div2></Div2>
        <Cat>{t("categoryTxt")}</Cat>

        {
        pickCategoryBool ?
        <h5 className='issue'>{`You must pick a category!`}</h5>
        : ''}
        <select onChange={(e) => {
          setPickCategoryBool(false);
          setCategory(e.target.value);
          }}>
          <option value="" selected disabled hidden>{t("categoryTxt")}</option>
          <option value={'foodpopup'}>{t("foodPopTxt")}</option>
          <option value={'foodtruck'}>{t("foodTrucktxt")}</option>
          <option value={'performer'}>{t("Performertxt")}</option>
          <option value={'arts'}>{t("Artandcraftstxt")}</option>
          <option value={'produce'}>{t("markettxt")}</option>
        </select>
        <Div2></Div2>
        <Info>{t("infoTxt")}</Info>
        <form onSubmit={(e) => {
          e.preventDefault();

        }}>
          <input type="text" maxlength="255" value={info}  onChange={(e) => {setInfo(e.target.value)}}></input>
          <Div></Div>
        </form>
        {
          createConfirm ?
          <Confirmation
            text={`${t("createBtn")} ${businessName}?`}
            yesContext={() => finalizeCreation()}
            noContext={() =>{
              setAddCreateButtons(true)
              setCreateConfirm(false)
            }}
          /> :
          ''
        }
        {
          cancelConfirm ?
          <Confirmation
            text={t("cancel?")}
            yesContext={() => {
              back.push('/yourpopups')
            }}
            noContext={() =>{
              setAddCreateButtons(true)
              setCancelConfirm(false)
            }}
          /> :
          ''
        }
        {
          addCreateButtons ?
        <div>
          <button
            onClick={() => {
              setCreateConfirm(true);
              setAddCreateButtons(false);
            }}
          >{t("createBtn")}</button>
          <button
            onClick={() => {
              setCancelConfirm(true);
              setAddCreateButtons(false);
            }}
          >{t("cancelBtn")}</button>
          </div>
          :
          ''
        }

      </div>
  )
}

export default CreatePop;