import React from 'react'
import { StyleSheet, Text, View,ListView,ImageBackground } from 'react-native'
import { List } from 'antd-mobile'
import { map } from 'lodash'

// 进行渲染数据
renderContent = list => {
  const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
  const dataSource = ds.cloneWithRows(list)

  return (
    <ListView
      initialListSize={1}
      dataSource={dataSource}
      renderRow={this.renderItem}
      style={{ flex: 1 }}
      onEndReachedThreshold={10}
      enableEmptySections
    />
  )
}
// 渲染每一项的数据
renderItem = data => (
  <View style={{ flex: 1 }}>
    <ImageBackground
      source={require('../images/ic_order_status_item_bg.png')}
      style={{ height: 35, marginLeft: 10, width: '100%' }}
    >
      {this.renderCenterContent(data)}
    </ImageBackground>
    <View style={{ height: 1 }} />
  </View>
)

renderCenterContent = data => (
  <View style={{ marginLeft: 15, marginTop: 5, flex:1 }}>
    <View style={{ flex: 1,flexDirection: 'row' }}>
      <Text style={{ color: 'black', fontSize: 14 }}>{data.stepContent}</Text>
      <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 10 }}>
        <Text style={{ color: '#777', fontSize: 12, paddingRight: 10 }}>
          {data.doneTime}
        </Text>
      </View>
    </View>
  </View>
)

export const Timeline = ({ list }) => {
  return this.renderContent(list)
}
  


export default Timeline
