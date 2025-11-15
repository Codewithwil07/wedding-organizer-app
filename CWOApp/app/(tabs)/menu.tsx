import React from "react";
import { View, Text, SafeAreaView, Pressable, ScrollView } from "react-native";
import tw from "twrnc";
import { Link } from "expo-router";
import { useCartStore } from "../../store/cart.store";
import { Ionicons } from "@expo/vector-icons";

// Komponen Tombol Reusable
const MenuButton = ({
  href,
  icon,
  title,
}: {
  href: string;
  icon: any;
  title: string;
}) => (
  <Link href={href} asChild>
    <Pressable
      style={tw`bg-white p-5 rounded-lg shadow-sm mb-4 flex-row items-center`}
    >
      <Ionicons name={icon} size={24} style={tw`mr-4 text-blue-600`} />
      <Text style={tw`text-lg font-semibold text-black flex-1`}>{title}</Text>
      <Ionicons
        name="chevron-forward-outline"
        size={24}
        style={tw`text-gray-400`}
      />
    </Pressable>
  </Link>
);

export default function MenuScreen() {
  const total = useCartStore((state) => state.totalHarga());

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <ScrollView style={tw`p-4`}>
        <Text style={tw`text-3xl font-bold text-black mt-4 mb-6 px-2`}>
          Menu Paket
        </Text>

        {/* TOMBOL CHECKOUT */}
        {total > 0 && (
          <Link href="/checkout" asChild>
            <Pressable
              style={tw`bg-blue-600 p-5 rounded-lg shadow-lg mb-6 flex-row items-center`}
            >
              <Ionicons name="cart" size={24} style={tw`mr-4 text-white`} />
              <View style={tw`flex-1`}>
                <Text style={tw`text-lg font-semibold text-white`}>
                  Lihat Keranjang
                </Text>
                <Text style={tw`text-base font-bold text-white`}>
                  Rp {total.toLocaleString("id-ID")}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward-outline"
                size={24}
                style={tw`text-white`}
              />
            </Pressable>
          </Link>
        )}

        {/* MENU BUTTONS */}
        <MenuButton
          title="Dokumentasi Wedding"
          icon="camera-outline"
          href="/paket-list/dokumentasi"
        />
        <MenuButton
          title="Busana & MUA"
          icon="woman-outline"
          href="/paket-list/busana"
        />
        <MenuButton
          title="Dekorasi"
          icon="diamond-outline"
          href="/paket-list/dekorasi"
        />
        <MenuButton
          title="Akad & Resepsi"
          icon="receipt-outline"
          href="/paket-list/akadresepsi"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
