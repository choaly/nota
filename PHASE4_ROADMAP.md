# Phase 4: Mobile App with React Native & Expo

## High-Level Overview

We're building a **mobile app version** of Nota using React Native and Expo. The app will connect to the same backend (already deployed on Render), so users can access their notes from both web and mobile.

### What stays the same:
- Backend API (Render) — no changes needed
- MongoDB Atlas database — shared between web and mobile
- All API endpoints and authentication flow

### What's new:
- React Native components instead of HTML/CSS
- Expo framework for simplified development and testing
- React Navigation for screen transitions
- AsyncStorage instead of localStorage
- Native mobile UI patterns (stack navigation, pull-to-refresh, etc.)

---

## The Full Map

### **Part 1: Project Setup & Navigation** (Steps 1-3)
**What we're building**: Expo project with screen navigation

- **Step 1**: Initialize Expo project and install dependencies
- **Step 2**: Set up React Navigation (stack navigator)
- **Step 3**: Create basic screen shells (Login, Signup, Dashboard, NoteView, ProfileSettings, Quiz)

**Key concepts**: Expo CLI, React Navigation, stack vs tab navigation, screen components vs web page components

---

### **Part 2: Authentication Screens** (Steps 4-6)
**What we're building**: Login and Signup screens with token management

- **Step 4**: Build Login screen (TextInput, Pressable, styling)
- **Step 5**: Build Signup screen
- **Step 6**: Auth context with AsyncStorage (port from web version)

**Key concepts**: AsyncStorage vs localStorage, SecureStore for tokens, React Native form inputs, keyboard handling

---

### **Part 3: Core App Screens** (Steps 7-10)
**What we're building**: Dashboard, note editor, and sidebar

- **Step 7**: Build Dashboard screen (FlatList of notes)
- **Step 8**: Build NoteView screen (create/edit notes)
- **Step 9**: Build navigation header with profile dropdown
- **Step 10**: Build Profile Settings screen

**Key concepts**: FlatList vs map(), SafeAreaView, native text input, platform-specific styling

---

### **Part 4: Quiz & Polish** (Steps 11-13)
**What we're building**: Quiz feature and final polish

- **Step 11**: Build Quiz modal/screen
- **Step 12**: Pull-to-refresh, loading states, error handling
- **Step 13**: App icon, splash screen, and build for testing

**Key concepts**: Modal component, ActivityIndicator, app.json config, EAS Build

---

## Web → React Native Translation Guide

| Web (React) | Mobile (React Native) |
|---|---|
| `<div>` | `<View>` |
| `<p>`, `<span>` | `<Text>` |
| `<button>` | `<Pressable>` or `<TouchableOpacity>` |
| `<input>` | `<TextInput>` |
| `<img>` | `<Image>` |
| `<ul>` + `.map()` | `<FlatList>` |
| CSS files / modules | `StyleSheet.create({})` |
| `localStorage` | `AsyncStorage` |
| `window.location.reload()` | Navigation reset |
| `onClick` | `onPress` |
| `className={styles.x}` | `style={styles.x}` |
| `font-size: 16px` | `fontSize: 16` (no units) |
| `background-color` | `backgroundColor` (camelCase) |

---

## Project Structure

```
/nota-mobile/
  App.js                    # Entry point
  app.json                  # Expo config (app name, icon, splash)
  /src/
    /screens/
      LoginScreen.js
      SignupScreen.js
      DashboardScreen.js
      NoteViewScreen.js
      ProfileSettingsScreen.js
      QuizScreen.js
    /context/
      AuthContext.js         # Same pattern as web, uses AsyncStorage
    /services/
      auth.js                # API calls (reused from web, minor tweaks)
      notes.js
      quiz.js
    /components/
      NoteCard.js            # Reusable note preview card
      QuizModal.js           # Quiz overlay
    /navigation/
      AppNavigator.js        # Stack navigator setup
  package.json
```

---

## Technologies & Why

- **Expo**: Simplifies React Native — no Xcode/Android Studio needed to start; test on your phone with Expo Go app
- **React Navigation**: Industry-standard navigation library for React Native (like react-router for mobile)
- **AsyncStorage**: Key-value storage that persists across app restarts (mobile equivalent of localStorage)
- **React Native StyleSheet**: Performance-optimized styling system that uses JavaScript objects instead of CSS

---

## Learning Objectives

By the end of Phase 4, you should be able to:
1. Explain the differences between React (web) and React Native (mobile)
2. Build mobile UIs with View, Text, TextInput, FlatList, and Pressable
3. Use React Navigation for screen-based routing
4. Handle mobile-specific concerns (keyboard avoidance, safe areas, platform differences)
5. Build and test a mobile app using Expo

---

## Detailed Step-by-Step Progress

*(Will be filled in as we complete each step)*

---
