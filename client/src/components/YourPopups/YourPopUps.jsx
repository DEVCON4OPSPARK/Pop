import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import YourPopupView from './YourPopupView.jsx';
import styled, { css } from 'styled-components';
import CreatePop from './CreatePop.jsx'
import { useTranslation } from 'react-i18next'


const Ul = styled.ul`
background-color: ${props => props.theme.mode === 'dark' ? '#7392C4' : '#f5abc9'};
`
const H1 = styled.h1`
margin-top: 35px;
text-shadow: 2px 2px 4px #000000;
`
const YourPopUps = ({ yourPopups, setYourPopups, merchData, setMerchData, merchant, selectMerch, userSubs, setUserSubs }) => {
  const {t} = useTranslation()
  

  const Div = styled.div`
  margin: 30px;
  ` 
  return (
    <div>
      <br/> 
      <H1>{t('yourPopUpsBtn')}</H1>
      <hr/>
      <Div></Div>
      <Link to='/create'>
      <button
      onClick={() => {
        console.log(!!yourPopups)
      }}>{t('createPopUpBtn')}</button>
      <Div></Div>
      </Link>
        <Ul>
      { yourPopups ?
        yourPopups.map(merch => {
            return <YourPopupView
              key={merch.id}
              merchant={merch}
              selectMerch={selectMerch}
              merchData={merchData}
              setMerchData={setMerchData}
              yourPopups={yourPopups}
              setYourPopups={setYourPopups}
              userSubs={userSubs}
              setUserSubs={setUserSubs}
          />
            })
            :
            <h3>You don't own any Pop Ups</h3>
          }

          </Ul>
    </div>
  )
};

export default YourPopUps;