import { User, LearningTopic, VocabularyWord } from '../types';

const USERS_KEY = 'learnsimply_users';
const HISTORY_KEY_PREFIX = 'learnsimply_history_';
const VOCAB_KEY_PREFIX = 'learnsimply_vocab_';
const SESSION_KEY = 'learnsimply_session';

// --- User Management ---

const getUsers = (): Record<string, string> => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : {};
};

const saveUsers = (users: Record<string, string>) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const signup = (email: string, password_not_used: string): User => {
  const users = getUsers();
  const lowerCaseEmail = email.toLowerCase();
  if (users[lowerCaseEmail]) {
    throw new Error('User already exists.');
  }
  users[lowerCaseEmail] = lowerCaseEmail; 
  saveUsers(users);
  
  const newUser: User = { email: lowerCaseEmail, isAdmin: lowerCaseEmail === 'admin@learnsimply.ai' };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
  return newUser;
};

export const login = (email: string, password_not_used: string): User => {
  const users = getUsers();
  const lowerCaseEmail = email.toLowerCase();
  if (!users[lowerCaseEmail]) {
    throw new Error('User not found.');
  }
  
  const user: User = { email: lowerCaseEmail, isAdmin: lowerCaseEmail === 'admin@learnsimply.ai' };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
};

export const logout = () => sessionStorage.removeItem(SESSION_KEY);

export const getCurrentUser = (): User | null => {
  const userJson = sessionStorage.getItem(SESSION_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

export const getAllUsers = (): User[] => {
    const users = getUsers();
    return Object.keys(users).map(email => ({ email, isAdmin: email === 'admin@learnsimply.ai' }));
}

// --- Learning History Management ---

export const getLearningHistory = (email: string): LearningTopic[] => {
  const historyJson = localStorage.getItem(`${HISTORY_KEY_PREFIX}${email}`);
  return historyJson ? JSON.parse(historyJson) : [];
};

const saveLearningHistory = (email: string, history: LearningTopic[]) => {
    localStorage.setItem(`${HISTORY_KEY_PREFIX}${email}`, JSON.stringify(history));
}

export const startOrUpdateTopicHistory = (email: string, topic: string) => {
  let history = getLearningHistory(email);
  const existingTopicIndex = history.findIndex(item => item.topic === topic);
  
  let topicData: LearningTopic;
  if (existingTopicIndex > -1) {
    topicData = history.splice(existingTopicIndex, 1)[0];
  } else {
    topicData = { topic, date: new Date().toISOString(), concepts: {} };
  }
  
  topicData.date = new Date().toISOString(); // Update date on revisit
  history.unshift(topicData);
  saveLearningHistory(email, history);
};

export const addConceptToHistory = (email: string, topic: string, conceptTitle: string) => {
    let history = getLearningHistory(email);
    const topicData = history.find(item => item.topic === topic);
    if(topicData && !topicData.concepts[conceptTitle]){
        topicData.concepts[conceptTitle] = { title: conceptTitle };
        saveLearningHistory(email, history);
    }
}

export const updateNotesForConcept = (email: string, topic: string, conceptTitle: string, notes: string) => {
    let history = getLearningHistory(email);
    const topicData = history.find(item => item.topic === topic);
    if(topicData && topicData.concepts[conceptTitle]){
        topicData.concepts[conceptTitle].notes = notes;
        saveLearningHistory(email, history);
    }
}

// --- Vocabulary Management ---

export const getVocabulary = (email: string): VocabularyWord[] => {
  const vocabJson = localStorage.getItem(`${VOCAB_KEY_PREFIX}${email}`);
  return vocabJson ? JSON.parse(vocabJson) : [];
};

export const addVocabularyWord = (email: string, word: VocabularyWord) => {
  const vocabulary = getVocabulary(email);
  const newVocabulary = [word, ...vocabulary.filter(v => v.word.toLowerCase() !== word.word.toLowerCase())];
  localStorage.setItem(`${VOCAB_KEY_PREFIX}${email}`, JSON.stringify(newVocabulary));
};