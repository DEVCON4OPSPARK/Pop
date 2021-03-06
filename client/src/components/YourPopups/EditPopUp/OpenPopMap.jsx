import React, { useEffect, useState } from 'react';
import mapStyles from '../../MapView/mapstyles';
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';
//import Window from '../MapView/Window.jsx'
import styled from 'styled-components'
import ToggleOpenClose from '../../ToggleOpenClose.jsx';
import Confirmation from '../../Confirmation.jsx';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Div = styled.div`
margin-top: 30px;
`

const libraries = ["places"];

const mapContainerStyle = {
  width: '100vw',
  height: '60vh',
}

const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  gestureHandling: 'greedy'
}

const Button = styled.button`
margin-top: 30px;
`
const H4 = styled.h4`
color: ${props => props.theme.mode === 'dark' ? '#fff' : 'black'};
`
const OpenPopupMap = ({ merchData, selectMerchant,
  currentLocMarker, setCurrentLocMarker, merchant,
  setMerchData, user,
  setSubs, setYourPopups
}) => {
  const [ selectedPopUp, setSelectedPopUp ] = useState(null);
  const [ center, setCenter ] = useState({lat: 29.956124, lng: -90.090509});
  const [ yourLocBool, setYourLocBool ] = useState(false);
  const [ openOrClosed, setOpenOrClosed ] = useState('');
  const [ cancelConfirm, setCancelConfirm ] = useState(false);
  const [ profilePic, setProfilePic ] = useState(merchant.picture);
  const back = useHistory();
  const { t } = useTranslation()
  //const [ currentLocMarker, setCurrentLocMarker ] = useState(null);
  const {isLoaded, loadError} = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
    libraries
  })

  const mapMarkerClick = React.useCallback(()=>{
    setSelectedPopUp(merch)
  } , []);

  const geoLocTest = async (result) => {
    try {
      await result;
      console.log('geoLocTest', {
        lat: result.coords.latitude,
        lng: result.coords.longitude
      })
      setCenter({
        lat: result.coords.latitude,
        lng: result.coords.longitude
      })
      setYourLocBool(true)
    } catch (err) {
      console.log(err)
    }
  }


  const failed = () => {
    console.log('location test failed');
  }

  useEffect(() => {
      navigator.geolocation.getCurrentPosition(geoLocTest, failed);
  },[])

  if (loadError) {
    return "error loading map"
  }

  if (!isLoaded) {
    return "loading maps"
  }


  return (
    <Div>
      <ToggleOpenClose
        merchant={merchant}
        openOrClosed={openOrClosed}
        setOpenOrClosed={setOpenOrClosed}
        merchData={merchData}
        setMerchData={setMerchData}
        selectMerchant={selectMerchant}
        center={center}
        user={user}
        setYourPopups={setYourPopups}
        setSubs={setSubs}
      />
      <br/>
      <Button onClick={() => {
        setCancelConfirm(true);
      }}>{t("cancelBtn")}</Button>
      {
        cancelConfirm ?
        <Confirmation
          text={`${t("cancelOpeningTxt")} ${merchant.name}?`}
          yesContext={() => back.push('/edit')}
          noContext={() => setCancelConfirm(false)}
        /> :
        ''
      }
        <H4>{t("touchMap")}</H4>
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={12}
      center={center}
      options={options}
      onClick={(event) =>{
        setCenter({
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
          time: new Date()
        })
        alert('location moved!');
      }}
    >
      <Marker
        position={{
          lat: +merchant.lat,
          lng: +merchant.lon
        }}
      />
      {
      yourLocBool ?
      <Marker
        position={
          center
        }
      /> :
      ''
    }
     {/* {merchData.map(merch => {
        if (merch.isOpen) {
          return <Marker
            key={merch.id}
            position={{
              lat: +merch.lat,
              lng: +merch.lon
            }}
            // icon={{
            //   url: './foodmarker.png',
            //   scaledSize: new window.google.maps.Size(30, 30),
            //   origin: new window.google.maps.Point(0, 0),
            //   anchor: new window.google.maps.Point(15, 0)
            // }}
             onClick={()=>{
              setSelectedPopUp(merch)
            }}
          />
        }
      })} */}
      {
        selectedPopUp && (
          <InfoWindow
          position={{
            lat: +selectedPopUp.lat,
            lng: +selectedPopUp.lon
          }}
          onCloseClick={()=>{
            setSelectedPopUp(null);
          }}
          >
           <Window
              merchant={selectedPopUp}
              selectMerchant={selectMerchant}
              />
          </InfoWindow>
        )
      }
    </GoogleMap>
    </Div>
  );
};

export default OpenPopupMap;