export type SpeechEngineOptions = {
  voiceEnabled: boolean;
};

export type SpeechEngine = {
  speak: (text: string) => void;
  cancel: () => void;
  setVoiceEnabled: (enabled: boolean) => void;
  isVoiceEnabled: () => boolean;
  getLastSpoken: () => string | null;
};

export function createSpeechEngine(
  initialOptions?: Partial<SpeechEngineOptions>
): SpeechEngine {
  const supported =
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window;

  let voiceEnabled = initialOptions?.voiceEnabled ?? true;
  let currentUtterance: SpeechSynthesisUtterance | null = null;
  let lastSpoken: string | null = null;

  function cancel(): void {
    if (!supported) return;
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }

  function speak(text: string): void {
    if (!supported || !voiceEnabled) return;
    if (!text.trim()) return;
    if (lastSpoken === text.trim()) return;

    cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
      currentUtterance = null;
    };
    utterance.onerror = () => {
      currentUtterance = null;
    };

    currentUtterance = utterance;
    lastSpoken = text.trim();
    window.speechSynthesis.speak(utterance);
  }

  function setVoiceEnabled(enabled: boolean): void {
    voiceEnabled = enabled;
    if (!enabled) {
      cancel();
    }
  }

  function isVoiceEnabled(): boolean {
    return voiceEnabled;
  }

  function getLastSpoken(): string | null {
    return lastSpoken;
  }

  return {
    speak,
    cancel,
    setVoiceEnabled,
    isVoiceEnabled,
    getLastSpoken,
  };
}

