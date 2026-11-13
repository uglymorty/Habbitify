import { NativeTabs } from 'expo-router/native-tabs';
import React from 'react';

export default function TabLayout() {
  return (
    <NativeTabs tintColor="#F4D5D5">
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon 
          sf={{default: 'house', selected: 'house.fill'}}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="statistics">
        <NativeTabs.Trigger.Label>Statistics</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon 
          sf={{default: 'chart.bar', selected: 'chart.bar.fill'}}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{default: 'gearshape', selected: 'gearshape.fill'}}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
