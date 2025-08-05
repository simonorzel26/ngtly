import { normalizeWhiteSpaces } from 'normalize-text';
import { remove as removeDiacritics } from 'diacritics';
import natural from 'natural';
import { removeStopwords, eng} from 'stopword';
import { musicTags } from './musicTags';
import { eventTags } from './eventTags';

// Define stopwords (add more as needed)
const customStopwords = ['it', 'the', 'us', 'for', 'a', 'of', 'and', 'an'];

// Normalize text function
const normalize = (text: string): string => {
  // Convert to lowercase
  text = text.toLowerCase();
  text = text.replace(/&/g, 'and');
  // Remove special characters
  text = text.replace(/[^a-z0-9\s]/g, '');
  // Remove diacritics
  text = removeDiacritics(text);
  // Normalize spaces
  text = normalizeWhiteSpaces(text);
  return text;
};

// Stem text function
const stem = (text: string): string[] => {
  const tokenizer = new natural.WordTokenizer();
  const stemmer = natural.PorterStemmer;
  const tokens = tokenizer.tokenize(text);
  const stemmedTokens = tokens.map(token => stemmer.stem(token));
  return stemmedTokens;
};

// Remove stopwords function using stopword package
const removeStopwordsFunc = (text: string[]): string[] => {
  const words = removeStopwords(text, [...eng, ...customStopwords]);
  return words;
};

// Preprocess text function
export const preprocess = (text: string): string[] => {
  const normalizedText = normalize(text);
  const stemmedText = stem(normalizedText);
  const cleanedText = removeStopwordsFunc(stemmedText);
  return cleanedText;
};

// Preprocess all music tags
const preprocessedMusicTags = musicTags.map(tag => ({
  tag: tag.tag,
  preprocessedSpellings: tag.spellings.flatMap(spelling => preprocess(spelling)) // Use flatMap to flatten the array of arrays
}));

const preprocessedEventTags = eventTags.map(tag => ({
  tag: tag.tag,
  preprocessedSpellings: tag.spellings.flatMap(spelling => preprocess(spelling)) // Use flatMap to flatten the array of arrays
}));

// Function to match input against preprocessed tags
export const matchMusicTags = (preprocessedInput: string[]) => {
  const matchedTags = preprocessedMusicTags.filter(tag => {
    return tag.preprocessedSpellings.some(spelling => preprocessedInput.includes(spelling));
  }).map(tag => tag.tag);
  return matchedTags;
};

export const matchEventTags = (preprocessedInput: string[]) => {
  const matchedTags = preprocessedEventTags.filter(tag => {
    return tag.preprocessedSpellings.some(spelling => preprocessedInput.includes(spelling));
  }).map(tag => tag.tag);
  return matchedTags;
};