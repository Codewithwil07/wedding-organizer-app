import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 
import tw from 'twrnc';

export default function TabsLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: tw.color('blue-600'), 
        tabBarInactiveTintColor: tw.color('gray-400'),
        tabBarStyle: tw`bg-white border-t border-gray-200`,
      }}
    >
      <Tabs.Screen
        name="index" // file 'index.tsx'
        options={{
          title: 'Home', 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu" // file 'menu.tsx'
        options={{
          title: 'Menu', 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="menu-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profil" // file 'profil.tsx'
        options={{
          title: 'Profil', 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}