import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { List } from 'antd-mobile'
import { map } from 'lodash'

import Touchable from './Touchable'

const Item = List.Item
const Brief = Item.Brief

renderItems = (list, clickHandle) =>
  map(list, item => (
    <Item
      key={item.userCode}
      onClick={() => clickHandle(item)}
      arrow="horizontal"
    >
      {item.userName}
      <Brief>
        信任值:{item.creditValue} 距离:{item.distance}
      </Brief>
      <Brief>地点:{item.addrName}</Brief>
    </Item>
  ))

export const CompanySelector = ({ style, list, clickHandle }) => (
  <List style={style}>{renderItems(list, clickHandle)}</List>
)

export default CompanySelector
