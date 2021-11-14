import React, { useRef, useState } from 'react';
import { AppRegistry, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';

const PendingView = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: 'lightgreen',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Text>Waiting</Text>
  </View>
);

const App = () => {
  const [videoCounter,updateVideoCounter] = useState(0)
  const [isRecording,setIsRecording] = useState(false)
  const [flash,setFlash] = useState("on")
  const [unsingBackCamera,updateCameraInUsing] = useState(true)
  const camera = useRef(null)
  
  const takePicture = async () => {
    const options = { quality: 0.5, base64: true };
    const data = await camera.current.takePictureAsync(options);
    console.log(data.uri);
  }

  return (
    <View style={styles.container}>
      <View>
        <View style={{
          color:"black",
          display:"flex",
          flexDirection:"row",
          justifyContent:"space-around",
          alignItems:"center"
        }}>
          <TouchableOpacity 
            style={{
              backgroundColor:"#fefefe",
              width:"40%",
              borderRadius:9999,
              margin:10,
              padding:10
            }}
            onPress={()=>{
              updateCameraInUsing(!unsingBackCamera)
            }}
          >
            <Text style={{
              fontWeight:"bold",
              textAlign:"center",
            }}>{unsingBackCamera? "Front":"Back"}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={()=>{
              if (flash === 'on'){
                setFlash('off')
              }
              if (flash === 'off'){
                setFlash('torch')
              }
              if (flash === 'torch'){
                setFlash('auto')
              }
              if (flash === 'auto'){
                setFlash('on')
              }
              
            }}
            style={{
              backgroundColor:"#fefefe",
              width:"40%",
              alignItems:"center",
              justifyContent:"center",
              borderRadius:9999,
              margin:10,
              padding:10,
              fontSize:20
            }}
          >
            <Text style={{ fontWeight:"bold"}}>Flash {flash}</Text>
          </TouchableOpacity>

        </View>

      </View>
      <RNCamera
        style={styles.preview}
        ref={camera}
        type={RNCamera.Constants.Type[unsingBackCamera? "front":"back"]}
        flashMode={RNCamera.Constants.FlashMode[flash]}
        onRecordingEnd={()=> {
          setIsRecording(false)
          updateVideoCounter(0)
        }}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        androidRecordAudioPermissionOptions={{
          title: 'Permission to use audio recording',
          message: 'We need your permission to use your audio',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        useNativeZoom={true}
        onRecordingStart={() => {
          console.log("start")
          setIsRecording(true)
          setInterval(()=>{
            updateVideoCounter(videoCounter +1 )
          },1000)
        }}
      >
      </RNCamera>
      { isRecording&&<Text style={{
          color:"white",
          fontSize:30,
          textAlign:"center"        
        }}>{videoCounter}s</Text>}
      <View style={{display:"flex",flexDirection:"row", padding:10, margin:10}}>
        <TouchableOpacity 
          onPress={takePicture} 
          style={{color:"white", width:"20%" ,borderRadius:999, backgroundColor:"white"}}
          >
          <Text style={{fontWeight:"bold",textAlign:"center"}}>Photo</Text>
        </TouchableOpacity>        
        <TouchableOpacity 
          onPress={takePicture} 
          style={{color:"white", width:"20%",borderRadius:999, backgroundColor:"white"}}
          >
          <Text style={{fontWeight:"bold",textAlign:"center"}}>Video</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.toolBar}>
        <TouchableOpacity 
          onPress={async () =>{
            if (isRecording){
              camera.current.stopRecording()
            } else {
              const data = await camera.current.recordAsync({
                quality: RNCamera.Constants.VideoQuality['1080p']
              });
              console.log(data.uri);
            }
          }} 
          style={{...styles.capture, backgroundColor: isRecording? "#ff1111":"gray" }}
        >
        </TouchableOpacity>

      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: 'black',
    borderRadius: 9999,
    borderColor:"#fff",
    width:100,
    height:100,
    borderWidth:10,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  toolbar:{ 
    top:0,
    flexDirection: 'row', 
    justifyContent: 'center', 
    backgroundColor: '#000'
  }
});

export default App;
