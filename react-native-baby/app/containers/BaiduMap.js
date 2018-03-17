import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'

import { NavigationActions, createAction } from '../utils'

import { MapView, MapTypes, Geolocation } from 'react-native-baidu-map';

import {
  Button,
  StyleSheet,
  View,
} from 'react-native';

import Dimensions from 'Dimensions';

@connect()
export default class BaiduMapDemo extends Component {

  constructor() {
    super();

    this.state = {
      mayType: MapTypes.NORMAL,
      zoom: 15,
      center: {
        longitude: 113.981718,
        latitude: 22.542449
      },
      trafficEnabled: false,
      baiduHeatMapEnabled: false,
      markers: [{
        longitude: 113.981718,
        latitude: 22.542449,
        title: "Window of the world"
      },{
        longitude: 113.995516,
        latitude: 22.537642,
        title: ""
      }]
    };
  }

  locateCurrentPos = () => {
    Geolocation.getCurrentPosition()
      .then(data => {
        this.setState({
          zoom: 15,
          center: {
            latitude: data.latitude,
            longitude: data.longitude,
            rand: Math.random()
          }
        });
      })
      .catch(e =>{
        console.warn(e, 'error');
      })
  }

  gotoLocation = (x,y,label) => {
    this.setState({
      zoom:15,
      marker: {
        latitude: x,
        longitude: y,
        title: label
      },
      center: {
        latitude: x,
        longitude: y,
        
      }
    });
      
  }

  componentDidMount() {
    const {navigation} = this.props
    const position = navigation.state.params.position
    this.gotoLocation(position.posX, position.posY,position.label)
  }

  render() {
    const {navigation} = this.props
    const showBtn = navigation.state.params.showBtn
    console.log(showBtn)
    return (
      <View style={styles.container} >
        <MapView 
          trafficEnabled={this.state.trafficEnabled}
          baiduHeatMapEnabled={this.state.baiduHeatMapEnabled}
          zoom={this.state.zoom}
          mapType={this.state.mapType}
          center={this.state.center}
          marker={this.state.marker}
          markers={this.state.markers}
          style={styles.map}
          onMarkerClick={(e) => {
            //console.warn(JSON.stringify(e));
          }}
          onMapClick={(e) => {
          }}
          onMapPoiClick={(value) => {
            const x = value.latitude
            const y = value.longitude
            const label= value.name
            this.setState({
              marker: {
                latitude: x,
                longitude: y,
                title: label
              },
              /*center: {
                latitude: x,
                longitude: y,
                
              }*/
            });
          }}
        >
        </MapView>

        <View style={styles.row}>
          <Button title="+" style={styles.btn} onPress={() => {
            this.setState({
              zoom: this.state.zoom + 1
            });
          }} />
          <Button title="-" onPress={() => {
            if(this.state.zoom > 0) {
              this.setState({
                zoom: this.state.zoom - 1
              });
            }
            
          }} />
        </View>
        {showBtn && 
          <Button title="确定" onPress={() => {
            const {marker} = this.state

            if(marker){
              this.props.dispatch(createAction('requirement/updateState')({
                position:{
                  posX:marker.latitude,
                  posY:marker.longitude,
                  label:marker.title,
                }
              }))
              
              this.props.dispatch(NavigationActions.back())
            }
          }} />
        }
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    position : 'absolute',
    bottom: 40,
    right:10,
  },
  btn: {
    height: 20,
    color:'white',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  map: {
    flex:1,
    width:'100%'
  }
});