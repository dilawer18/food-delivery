import React, { useEffect, useState } from 'react';
import { View, Dimensions } from 'react-native';
import Video from 'react-native-video';
import FlashMessage from 'react-native-flash-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import Routes from "./src/Navigation/Routes";
import actions from './src/redux/actions';
import { saveUserData } from './src/redux/reducers/auth';
import store from './src/redux/store';
import fontFamily from './src/styles/fontFamily';
import { moderateScale, textScale, width } from './src/styles/responsiveSize';
import { getFirstTime, getUserData } from './src/utils/utils';
import SplashScreen from 'react-native-splash-screen';
import imagePath from './src/constants/imagePath';
import colors from './src/styles/colors';

const App = () => {
  const [isVideoFinished, setIsVideoFinished] = useState(false);

  const onVideoDurationEnded = () => {
    setIsVideoFinished(true);
  };

  const init = async () => {
    try {
      const userData = await getUserData();
      const isFirstTime = await getFirstTime();
      if (userData && !!userData.token) {
        dispatch(saveUserData(userData));
      }
      if (isFirstTime) {
        actions.isFirstTime(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  
  useEffect(()=>{
    init();
    // setTimeout(() => {
    //   SplashScreen.hide();
    // }, 100);
  },[])
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        {!isVideoFinished ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center",backgroundColor:colors.white }}>
            <Video
              source={imagePath.driveree}
              style={{ width:width, height: width }}
              resizeMode='cover'
              onEnd={onVideoDurationEnded}
            />
          </View>
        ) : (
          <>
            <Routes />
            <FlashMessage
              titleStyle={{
                marginRight: moderateScale(5),
                fontFamily: fontFamily.medium,
                fontSize: textScale(16),
              }}
              position="top"
            />
          </>
        )}
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
