import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

interface SectionBoxProps {
  children?: React.ReactNode;
  title?: string | number;
  titleColor?: string;
  navigateTo?: () => void;
  paddingBuffer?: number;
  scrollOn?: boolean;
}

const SectionBox: React.FC<SectionBoxProps> = ({
  children,
  title,
  titleColor = 'cyan',
  navigateTo,
  paddingBuffer = 0,
  scrollOn = false,
}) => {
  return (
    <>  
    {scrollOn ? (
      <View style={styles.sectionContentContainer}>
        <View style={{ paddingTop: paddingBuffer, paddingHorizontal: paddingBuffer }}>

          {title && 
          (
            navigateTo ? (
              <TouchableOpacity style={{ width: '100%' }} onPress={navigateTo}>
                <Text style={[styles.sectionTitle, { color: titleColor }]}>{title}</Text>
              </TouchableOpacity>
            ) : (
              <Text style={[styles.sectionTitle, { color: titleColor }]}>{title}</Text>
            )
          )}
        </View>
        <ScrollView style={{ padding: paddingBuffer, maxHeight: '100%' }}>
          {children}
        </ScrollView>
      </View>
    ) : (
      <View
        style={[
          styles.sectionContentContainer,
          { padding: paddingBuffer }
        ]}
      >
        {title && 
        (
          navigateTo ? (
            <TouchableOpacity style={{ width: '100%' }} onPress={navigateTo}>
              <Text style={[styles.sectionTitle, { color: titleColor }]}>{title}</Text>
            </TouchableOpacity>
          ) : (
            <Text style={[styles.sectionTitle, { color: titleColor }]}>{title}</Text>
          )
        )}
        {children}
      </View>
    )}
    </>

  );
};

const styles = StyleSheet.create({
  sectionContentContainer: {
    marginBottom: 20,
    backgroundColor: 'rgb(22, 24, 29)',
    borderRadius: 20,
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 10, height: 10 },
    elevation: 10,
    borderColor: 'black',
    borderWidth: 1,
    // padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  titleContainer: {
    marginBottom: 20,
    padding: 15,
  },
});

export default SectionBox;