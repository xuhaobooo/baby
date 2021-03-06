import React from 'react'
import { StyleSheet, Text, View,ListView,ImageBackground,Image } from 'react-native'
import { List } from 'antd-mobile'
import { map } from 'lodash'

// 进行渲染数据
renderContent = list => {
  const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
  const dataSource = ds.cloneWithRows(list)

  return (
    <ListView
      initialListSize={6}
      dataSource={dataSource}
      renderRow={this.renderItem}
      style={{ flex: 1 }}
      onEndReachedThreshold={10}
      enableEmptySections
    />
  )
}
// 渲染每一项的数据
renderItem = (data,sectionID, rowID) => (
  <View style={{ height:35,flexDirection:'row',paddingLeft:10 }}>
    {rowID === '0' ? <Image source={require('../images/top.png')} style={{height:35,width:18}}/> : 
    rowID === '4' ? <Image source={require('../images/bom.png')} style={{height:35,width:18}}/>:
    <Image source={require('../images/mid.png')} style={{height:35,width:18}}/>}
      <View style={{flex:1,paddingTop:10,flexDirection:'row',marginLeft:5}}>
        <View style={{flex:1}}>
          <Text style={{ color: 'black', fontSize: 14 }}>{data.stepContent}</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text style={{ color: '#777', fontSize: 12, paddingRight: 20 }}>
            {data.doneTime}
          </Text>
        </View>
      </View>
  </View>
)

renderCenterContent = data => (
  <View style={{ marginLeft: 15, marginTop: 5, flex:1,flexDirection: 'row' }}>
      
  </View>
)

export const Timeline = ({ list }) => {
  return this.renderContent(list)
}
  


export default Timeline
