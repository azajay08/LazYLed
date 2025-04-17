# LazYLed

## What?
LazyLed is a project I have been working on which involves ESP32 controlled LED strips, controlled manually on device or via a React Native app. 

## Why?
Having done the Full Stack Open course at University of Helsinki, I got to do web dev with JavaScript and React. I thought I would try my hand at React Native, initially with JavaScript, then later converting it to TypeScript.
I wanted to do a project that was actually useful and not just a showcase. I love using home automations so I have tried various smart devices and their software, so.... I decided to make my own.

This way I can customise and tailor it anyway I like. I could use all my experience from using other smart devices and software to implement, combine, improve certain aspects that I like from each, or just create something new. This is an ongoing project, but I do actually use this every day to control my office lights.

## ESP32
I am using an ESP32 microcontroller to control the RGB strip (SK6812), using FastLED on the Arduino IDE. I designed my own custom PCB to mount the ESP32, to deal with the power and data pins to avoid the typical prototype mess. There are a few simple buttons on the PCB that will control the power, brightness, colour and effects. Those manual buttons will only take me so far, I wanted to be able to set more colours and custom effects with various parameters, hence the App.

## LazYLed App
This project is the first time using React Native and is still an ongoing process. I started it using JavaScript as it was familiar to me with React and web dev. I really wanted to learn TypeScript for the type safety and it being more modern, so I started it again converting it to TypeScript.

I plan to always keep it updated with new features and a better UI experience. Up to now on the app, I can add devices, control colours, effects (presets and custom), power, brightness, sync devices, check device status and more.

Right now it interacts with backend via HTTP requests but I am planning on using Web Sockets for better and more responsive live updates

### Adding Devices
https://github.com/user-attachments/assets/9f729780-b2b8-4631-99f4-a877b5573769

### Syncing Devices
https://github.com/user-attachments/assets/4622c52a-5c3e-4508-a5ef-61bbe807aec9

### Setting Custom Effects
https://github.com/user-attachments/assets/66533fbb-16c3-47a9-8dcd-73ee11b76616







## Future Features
* Favourites
  * Colours
  * Swatches
  * Effects (Custom and presets)
  * Scenes
* More Effects
* Profile
* Settings
  * Device settings
  * App settings
* Web Sockets
