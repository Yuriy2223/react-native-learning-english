// services/audio.ts

import { Audio } from "expo-av";
import { Platform } from "react-native";

class AudioService {
  private currentAudio: HTMLAudioElement | null = null;
  private currentSound: Audio.Sound | null = null;

  async playText(text: string, language: "en" | "uk" = "en"): Promise<void> {
    if (Platform.OS === "web") {
      return this.playTextWeb(text, language);
    }

    const ttsUrl = this.generateTTSUrl(text, language);
    return this.play(ttsUrl);
  }

  async playAudioFile(audioUrl: string): Promise<void> {
    return this.play(audioUrl);
  }

  private async play(url: string): Promise<void> {
    await this.stop();

    if (Platform.OS === "web") {
      this.currentAudio = new window.Audio(url);
      await this.currentAudio.play();
    } else {
      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true }
      );
      this.currentSound = sound;
    }
  }

  private async playTextWeb(text: string, language: "en" | "uk") {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "uk" ? "uk-UA" : "en-US";
      window.speechSynthesis.speak(utterance);
    } else {
      console.error("Цей браузер не підтримує Web Speech API");
    }
  }

  async stop(): Promise<void> {
    try {
      if (Platform.OS === "web") {
        if (this.currentAudio) {
          this.currentAudio.pause();
          this.currentAudio.currentTime = 0;
          this.currentAudio = null;
        }
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
      } else {
        if (this.currentSound) {
          await this.currentSound.stopAsync();
          await this.currentSound.unloadAsync();
          this.currentSound = null;
        }
      }
    } catch (error) {
      console.error("Error stopping audio:", error);
    }
  }

  private generateTTSUrl(text: string, language: string): string {
    const encodedText = encodeURIComponent(text);
    const lang = language === "uk" ? "uk-UA" : "en-US";
    return `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodedText}`;
  }
}

export const audioService = new AudioService();
