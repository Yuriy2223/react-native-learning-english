// services/api.ts
import { API_ENDPOINTS } from "../constants";
import {
  GrammarRule,
  LoginFormData,
  Phrase,
  RegisterFormData,
  Topic,
  User,
  UserProgress,
  Word,
} from "../types";
import { authUtils } from "../utils";

class ApiService {
  private baseUrl = API_ENDPOINTS.BASE_URL;
  private authToken: string | null = null;

  // ========== MOCK DATA (тимчасово) ==========

  // Vocabulary mock data
  private mockVocabularyTopics: Topic[] = [
    {
      id: "v1",
      title: "Повсякденна лексика",
      description: "Основні слова для щоденного спілкування",
      imageUrl: null,
      totalItems: 5,
      completedItems: 0,
      type: "vocabulary",
      difficulty: "beginner",
    },
    {
      id: "v2",
      title: "Професії та робота",
      description: "Назви професій та слова пов'язані з роботою",
      imageUrl: null,
      totalItems: 5,
      completedItems: 0,
      type: "vocabulary",
      difficulty: "intermediate",
    },
    {
      id: "v3",
      title: "Їжа та напої",
      description: "Назви продуктів харчування та напоїв",
      imageUrl: null,
      totalItems: 5,
      completedItems: 0,
      type: "vocabulary",
      difficulty: "beginner",
    },
    {
      id: "v4",
      title: "Подорожі",
      description: "Слова для подорожей та туризму",
      imageUrl: null,
      totalItems: 5,
      completedItems: 0,
      type: "vocabulary",
      difficulty: "intermediate",
    },
  ];

  private mockWords: { [topicId: string]: Word[] } = {
    v1: [
      {
        id: "w1",
        word: "hello",
        translation: "привіт",
        transcription: "/həˈloʊ/",
        audioUrl: undefined,
        topicId: "v1",
        isKnown: false,
      },
      {
        id: "w2",
        word: "goodbye",
        translation: "до побачення",
        transcription: "/ɡʊdˈbaɪ/",
        audioUrl: undefined,
        topicId: "v1",
        isKnown: false,
      },
      {
        id: "w3",
        word: "please",
        translation: "будь ласка",
        transcription: "/pliːz/",
        audioUrl: undefined,
        topicId: "v1",
        isKnown: false,
      },
      {
        id: "w4",
        word: "thank you",
        translation: "дякую",
        transcription: "/θæŋk juː/",
        audioUrl: undefined,
        topicId: "v1",
        isKnown: false,
      },
      {
        id: "w5",
        word: "sorry",
        translation: "вибачте",
        transcription: "/ˈsɒri/",
        audioUrl: undefined,
        topicId: "v1",
        isKnown: false,
      },
    ],
    v2: [
      {
        id: "w6",
        word: "teacher",
        translation: "вчитель",
        transcription: "/ˈtiːtʃər/",
        audioUrl: undefined,
        topicId: "v2",
        isKnown: false,
      },
      {
        id: "w7",
        word: "doctor",
        translation: "лікар",
        transcription: "/ˈdɒktər/",
        audioUrl: undefined,
        topicId: "v2",
        isKnown: false,
      },
      {
        id: "w8",
        word: "engineer",
        translation: "інженер",
        transcription: "/ˌendʒɪˈnɪər/",
        audioUrl: undefined,
        topicId: "v2",
        isKnown: false,
      },
      {
        id: "w9",
        word: "lawyer",
        translation: "юрист",
        transcription: "/ˈlɔːjər/",
        audioUrl: undefined,
        topicId: "v2",
        isKnown: false,
      },
      {
        id: "w10",
        word: "manager",
        translation: "менеджер",
        transcription: "/ˈmænɪdʒər/",
        audioUrl: undefined,
        topicId: "v2",
        isKnown: false,
      },
    ],
    v3: [
      {
        id: "w11",
        word: "bread",
        translation: "хліб",
        transcription: "/bred/",
        audioUrl: undefined,
        topicId: "v3",
        isKnown: false,
      },
      {
        id: "w12",
        word: "water",
        translation: "вода",
        transcription: "/ˈwɔːtər/",
        audioUrl: undefined,
        topicId: "v3",
        isKnown: false,
      },
      {
        id: "w13",
        word: "coffee",
        translation: "кава",
        transcription: "/ˈkɒfi/",
        audioUrl: undefined,
        topicId: "v3",
        isKnown: false,
      },
      {
        id: "w14",
        word: "apple",
        translation: "яблуко",
        transcription: "/ˈæpl/",
        audioUrl: undefined,
        topicId: "v3",
        isKnown: false,
      },
      {
        id: "w15",
        word: "cheese",
        translation: "сир",
        transcription: "/tʃiːz/",
        audioUrl: undefined,
        topicId: "v3",
        isKnown: false,
      },
    ],
    v4: [
      {
        id: "w16",
        word: "airport",
        translation: "аеропорт",
        transcription: "/ˈeəpɔːrt/",
        audioUrl: undefined,
        topicId: "v4",
        isKnown: false,
      },
      {
        id: "w17",
        word: "hotel",
        translation: "готель",
        transcription: "/həʊˈtel/",
        audioUrl: undefined,
        topicId: "v4",
        isKnown: false,
      },
      {
        id: "w18",
        word: "ticket",
        translation: "квиток",
        transcription: "/ˈtɪkɪt/",
        audioUrl: undefined,
        topicId: "v4",
        isKnown: false,
      },
      {
        id: "w19",
        word: "passport",
        translation: "паспорт",
        transcription: "/ˈpɑːspɔːrt/",
        audioUrl: undefined,
        topicId: "v4",
        isKnown: false,
      },
      {
        id: "w20",
        word: "luggage",
        translation: "багаж",
        transcription: "/ˈlʌɡɪdʒ/",
        audioUrl: undefined,
        topicId: "v4",
        isKnown: false,
      },
    ],
  };

  // Phrases mock data
  private mockPhrasesTopics: Topic[] = [
    {
      id: "1",
      title: "Вітання та знайомство",
      description: "Основні фрази для знайомства та привітання",
      imageUrl: null,
      totalItems: 5,
      completedItems: 0,
      type: "phrases",
      difficulty: "beginner",
    },
    {
      id: "2",
      title: "У ресторані",
      description: "Замовлення їжі та спілкування з офіціантом",
      imageUrl: null,
      totalItems: 5,
      completedItems: 0,
      type: "phrases",
      difficulty: "intermediate",
    },
    {
      id: "3",
      title: "Подорожі",
      description: "Корисні фрази для подорожей та готелів",
      imageUrl: null,
      totalItems: 5,
      completedItems: 0,
      type: "phrases",
      difficulty: "intermediate",
    },
    {
      id: "4",
      title: "Покупки",
      description: "Фрази для шопінгу та обміну товарів",
      imageUrl: null,
      totalItems: 5,
      completedItems: 0,
      type: "phrases",
      difficulty: "beginner",
    },
  ];

  private mockPhrases: { [topicId: string]: Phrase[] } = {
    "1": [
      {
        id: "1",
        phrase: "How are you?",
        translation: "Як справи?",
        audioUrl: null,
        topicId: "1",
        isKnown: false,
      },
      {
        id: "2",
        phrase: "Nice to meet you",
        translation: "Приємно познайомитися",
        audioUrl: null,
        topicId: "1",
        isKnown: false,
      },
      {
        id: "3",
        phrase: "What's your name?",
        translation: "Як вас звати?",
        audioUrl: null,
        topicId: "1",
        isKnown: false,
      },
      {
        id: "4",
        phrase: "Where are you from?",
        translation: "Звідки ви?",
        audioUrl: null,
        topicId: "1",
        isKnown: false,
      },
      {
        id: "5",
        phrase: "Have a nice day!",
        translation: "Гарного дня!",
        audioUrl: null,
        topicId: "1",
        isKnown: false,
      },
    ],
    "2": [
      {
        id: "6",
        phrase: "Can I see the menu, please?",
        translation: "Можна подивитися меню, будь ласка?",
        audioUrl: null,
        topicId: "2",
        isKnown: false,
      },
      {
        id: "7",
        phrase: "I'd like to order",
        translation: "Я хотів би замовити",
        audioUrl: null,
        topicId: "2",
        isKnown: false,
      },
      {
        id: "8",
        phrase: "Could I have the bill, please?",
        translation: "Можна рахунок, будь ласка?",
        audioUrl: null,
        topicId: "2",
        isKnown: false,
      },
      {
        id: "9",
        phrase: "Do you have any vegetarian dishes?",
        translation: "У вас є вегетаріанські страви?",
        audioUrl: null,
        topicId: "2",
        isKnown: false,
      },
      {
        id: "10",
        phrase: "This looks delicious!",
        translation: "Це виглядає смачно!",
        audioUrl: null,
        topicId: "2",
        isKnown: false,
      },
    ],
    "3": [
      {
        id: "11",
        phrase: "Where is the train station?",
        translation: "Де знаходиться вокзал?",
        audioUrl: null,
        topicId: "3",
        isKnown: false,
      },
      {
        id: "12",
        phrase: "I'd like to book a room",
        translation: "Я хотів би забронювати номер",
        audioUrl: null,
        topicId: "3",
        isKnown: false,
      },
      {
        id: "13",
        phrase: "How much is a ticket?",
        translation: "Скільки коштує квиток?",
        audioUrl: null,
        topicId: "3",
        isKnown: false,
      },
      {
        id: "14",
        phrase: "Can you help me with directions?",
        translation: "Ви можете підказати дорогу?",
        audioUrl: null,
        topicId: "3",
        isKnown: false,
      },
      {
        id: "15",
        phrase: "What time does it leave?",
        translation: "О котрій годині відправлення?",
        audioUrl: null,
        topicId: "3",
        isKnown: false,
      },
    ],
    "4": [
      {
        id: "16",
        phrase: "How much does this cost?",
        translation: "Скільки це коштує?",
        audioUrl: null,
        topicId: "4",
        isKnown: false,
      },
      {
        id: "17",
        phrase: "Can I try this on?",
        translation: "Можна це приміряти?",
        audioUrl: null,
        topicId: "4",
        isKnown: false,
      },
      {
        id: "18",
        phrase: "Do you have this in a different size?",
        translation: "У вас є це іншого розміру?",
        audioUrl: null,
        topicId: "4",
        isKnown: false,
      },
      {
        id: "19",
        phrase: "I'd like to return this",
        translation: "Я хотів би повернути це",
        audioUrl: null,
        topicId: "4",
        isKnown: false,
      },
      {
        id: "20",
        phrase: "Do you accept credit cards?",
        translation: "Ви приймаєте кредитні картки?",
        audioUrl: null,
        topicId: "4",
        isKnown: false,
      },
    ],
  };
  // ========== END MOCK DATA ==========

  // Метод для оновлення токена
  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  // Метод для очищення токена
  clearAuthToken() {
    this.authToken = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.authToken || (await authUtils.getAuthToken());

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error occurred");
    }
  }

  // Auth methods
  async login(data: LoginFormData): Promise<{ user: User; token: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const mockUser: User = {
      id: "1",
      email: data.email,
      name: "Test User",
      avatar: null,
      totalStudyHours: 0,
      createdAt: new Date().toISOString(),
    };

    const mockToken = "mock-jwt-token-" + Date.now();
    this.setAuthToken(mockToken);

    return { user: mockUser, token: mockToken };
  }

  async register(
    data: RegisterFormData
  ): Promise<{ user: User; token: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const mockUser: User = {
      id: "1",
      email: data.email,
      name: data.name,
      avatar: null,
      totalStudyHours: 0,
      createdAt: new Date().toISOString(),
    };

    const mockToken = "mock-jwt-token-" + Date.now();
    this.setAuthToken(mockToken);

    return { user: mockUser, token: mockToken };
  }

  async forgotPassword(email: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Password reset email sent to:", email);
  }

  // User methods
  async getUserProgress(): Promise<UserProgress> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      totalWords: 500,
      knownWords: 234,
      totalPhrases: 200,
      knownPhrases: 89,
      completedTopics: 12,
      totalPoints: 1450,
      streak: 7,
    };
  }

  async updateUserProgress(
    progressData: Partial<UserProgress>
  ): Promise<UserProgress> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const currentProgress = await this.getUserProgress();
    return { ...currentProgress, ...progressData };
  }

  // Vocabulary methods
  async getVocabularyTopics(): Promise<Topic[]> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return [...this.mockVocabularyTopics];
  }

  async getTopicWords(topicId: string): Promise<Word[]> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const words = this.mockWords[topicId];
    if (!words) {
      return [];
    }
    return [...words];
  }

  async updateWordStatus(wordId: string, isKnown: boolean): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Оновлюємо стан слова
    Object.values(this.mockWords).forEach((words) => {
      const word = words.find((w) => w.id === wordId);
      if (word) {
        word.isKnown = isKnown;
      }
    });

    // Оновлюємо прогрес теми
    Object.entries(this.mockWords).forEach(([topicId, words]) => {
      const topic = this.mockVocabularyTopics.find((t) => t.id === topicId);
      if (topic) {
        topic.completedItems = words.filter((w) => w.isKnown).length;
      }
    });

    console.log(`Word ${wordId} marked as ${isKnown ? "known" : "unknown"}`);
  }

  // Phrases methods
  async getPhrasesTopics(): Promise<Topic[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [...this.mockPhrasesTopics];
  }

  async getTopicPhrases(topicId: string): Promise<Phrase[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const phrases = this.mockPhrases[topicId];
    if (!phrases) {
      return [];
    }
    return [...phrases];
  }

  async updatePhraseStatus(phraseId: string, isKnown: boolean): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Оновлюємо стан фрази
    Object.values(this.mockPhrases).forEach((phrases) => {
      const phrase = phrases.find((p) => p.id === phraseId);
      if (phrase) {
        phrase.isKnown = isKnown;
      }
    });

    // Оновлюємо прогрес теми
    Object.entries(this.mockPhrases).forEach(([topicId, phrases]) => {
      const topic = this.mockPhrasesTopics.find((t) => t.id === topicId);
      if (topic) {
        topic.completedItems = phrases.filter((p) => p.isKnown).length;
      }
    });

    console.log(
      `Phrase ${phraseId} marked as ${isKnown ? "known" : "unknown"}`
    );
  }

  // Grammar methods
  async getGrammarTopics(): Promise<Topic[]> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return [
      {
        id: "1",
        title: "Present Simple",
        description: "Теперішній простий час для звичайних дій",
        imageUrl: null,
        totalItems: 15,
        completedItems: 12,
        type: "grammar",
        difficulty: "beginner",
      },
    ];
  }

  async getTopicRules(topicId: string): Promise<GrammarRule[]> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockRules: GrammarRule[] = [
      {
        id: "1",
        title: "Present Simple - Positive",
        description: "I/You/We/They + verb | He/She/It + verb + s",
        examples: ["I work every day", "She works in an office"],
        topicId,
      },
    ];

    return mockRules;
  }

  async markGrammarTopicCompleted(topicId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log(`Grammar topic ${topicId} marked as completed`);
  }
}

export const apiService = new ApiService();
