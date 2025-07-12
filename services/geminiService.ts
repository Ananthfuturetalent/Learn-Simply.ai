
import { GoogleGenAI } from "@google/genai";
import { Roadmap, DetailedConcept, WordDefinition, DailyQuote, Quiz } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const roadmapSchema = {
  type: 'ARRAY',
  items: {
    type: 'OBJECT',
    properties: {
      title: {
        type: 'STRING',
        description: 'The title of the sub-topic or concept.',
      },
    },
    required: ['title'],
  },
};

const detailedConceptSchema = {
  type: 'OBJECT',
  properties: {
    explanation: {
        type: 'STRING',
        description: "A concise, easy-to-understand conceptual explanation of the sub-topic. Use markdown for formatting."
    },
    synopsis: {
        type: 'STRING',
        description: "A concise synopsis of the sub-topic, structured for easy memorization. Use markdown like bullet points, bold keywords, and clear hierarchical formatting. This should be a summary of the most critical points a learner needs to remember."
    },
    youtubeVideos: {
      type: 'ARRAY',
      description: 'An array of 3 specific objects, each with a "title" and a "videoId" for a high-quality educational YouTube video on this topic. Do not include the full URL.',
      items: {
          type: 'OBJECT',
          properties: {
              title: { type: 'STRING', description: 'The title of the YouTube video.' },
              videoId: { type: 'STRING', description: 'The unique ID of the YouTube video (e.g., dQw4w9WgXcQ).' }
          },
          required: ['title', 'videoId']
      },
    },
    resourceSearchQueries: {
      type: 'ARRAY',
      description: 'An array of 3 specific, effective search queries for Google to find high-quality articles or documentation.',
      items: { type: 'STRING' },
    },
  },
  required: ['explanation', 'synopsis', 'youtubeVideos', 'resourceSearchQueries'],
};

const definitionSchema = {
  type: 'OBJECT',
  properties: {
    word: { type: 'STRING' },
    pronunciation: { type: 'STRING', description: "The phonetic pronunciation, e.g., /ˌmɪsəˈleɪniəs/" },
    meaning: { type: 'STRING', description: "A clear and concise definition of the word." },
    examples: { 
      type: 'ARRAY',
      description: "An array of exactly two sentences using the word in context.",
      items: { type: 'STRING' },
    }
  },
  required: ['word', 'pronunciation', 'meaning', 'examples']
};

const quoteSchema = {
  type: 'OBJECT',
  properties: {
    quote: { type: 'STRING', description: "The text of the motivational quote about learning or personal growth." },
    author: { type: 'STRING', description: "The author of the quote. If unknown, state 'Anonymous'." },
  },
  required: ['quote', 'author'],
};

const quizSchema = {
    type: 'ARRAY',
    items: {
        type: 'OBJECT',
        properties: {
            questionText: { type: 'STRING', description: 'The text of the quiz question.' },
            options: { 
                type: 'ARRAY',
                description: 'An array of 4 possible answers (strings).',
                items: { type: 'STRING' }
            },
            correctAnswer: { type: 'STRING', description: 'The exact string of the correct answer, which must be present in the options array.' },
        },
        required: ['questionText', 'options', 'correctAnswer'],
    },
};

export const generateRoadmap = async (topic: string): Promise<Roadmap> => {
  const prompt = `
    You are an expert educator. Create a learning roadmap for the topic "${topic}".
    Break the topic down into 5-7 key concepts or sub-topics that a beginner should learn in order.
    Provide only the titles of these concepts.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: roadmapSchema,
        temperature: 0.5,
      },
    });

    const jsonText = response.text.trim();
    const roadmap = JSON.parse(jsonText);
    
    if (!Array.isArray(roadmap)) {
        throw new Error("API did not return an array for the roadmap.");
    }

    return roadmap as Roadmap;

  } catch (error) {
    console.error("Error generating roadmap:", error);
    throw new Error("Failed to communicate with the AI model for the roadmap.");
  }
};

export const generateDetailedConcept = async (subTopic: string, mainTopic: string): Promise<DetailedConcept> => {
    const prompt = `
    You are an expert educator. For the sub-topic "${subTopic}" within the larger topic of "${mainTopic}", please provide detailed learning resources.

    You must generate:
    1.  "explanation": A clear, conceptual explanation of the sub-topic suitable for a beginner.
    2.  A "synopsis": A concise summary of the key points for the sub-topic, structured for easy memorization. Use markdown formatting like bullet points and bold text to highlight critical information. This should serve as a quick reference to help a learner remember the topic's structure and main ideas.
    3.  "youtubeVideos": A list of exactly 3 objects, each with a "title" and a "videoId" for a high-quality educational video on YouTube for this sub-topic. Ensure the video IDs are correct and relevant.
    4.  "resourceSearchQueries": A list of exactly 3 specific search queries that would find high-quality articles, blogs, or documentation on Google.

    Format the entire response as a single, well-formed JSON object.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: detailedConceptSchema,
                temperature: 0.6,
            }
        });

        let jsonText = response.text.trim();
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.substring(7, jsonText.length - 3).trim();
        }

        return JSON.parse(jsonText) as DetailedConcept;

    } catch (error) {
        console.error(`Error generating details for ${subTopic}:`, error);
        throw new Error("Failed to generate detailed concept from the AI model.");
    }
};

export const getWordDefinition = async (word: string): Promise<WordDefinition> => {
    const prompt = `Provide a dictionary entry for the word "${word}". I need its phonetic pronunciation, a clear meaning, and two example sentences.`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: definitionSchema,
            }
        });
        let jsonText = response.text.trim();
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.substring(7, jsonText.length - 3).trim();
        }
        return JSON.parse(jsonText) as WordDefinition;
    } catch (error) {
        console.error(`Error getting definition for ${word}:`, error);
        throw new Error("Failed to get word definition.");
    }
};

export const getMotivationalQuote = async (): Promise<DailyQuote> => {
    const prompt = `Provide an inspiring and motivational quote about learning, knowledge, or personal growth.`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: quoteSchema,
                temperature: 0.9,
            }
        });
        let jsonText = response.text.trim();
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.substring(7, jsonText.length - 3).trim();
        }
        return JSON.parse(jsonText) as DailyQuote;
    } catch (error) {
        console.error(`Error getting motivational quote:`, error);
        throw new Error("Failed to get motivational quote.");
    }
};

export const generateArticleForQuery = async (query: string): Promise<string> => {
    const prompt = `
      You are an expert writer and educator. 
      Write a comprehensive and easy-to-understand article about "${query}".
      The article should be well-structured with headings, paragraphs, and lists where appropriate. 
      Use markdown for all formatting. Do not use HTML.
      Ensure the content is accurate, informative, and engaging for a learner.
      Start with a top-level heading for the article title.
    `;
  
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          temperature: 0.7,
        },
      });
  
      let text = response.text.trim();
      if (text.startsWith('```markdown')) {
          text = text.substring(10, text.length - 3).trim();
      } else if (text.startsWith('```')) {
          text = text.substring(3, text.length - 3).trim();
      }
      return text;
  
    } catch (error) {
      console.error(`Error generating article for query "${query}":`, error);
      throw new Error("Failed to communicate with the AI model for the article.");
    }
};

export const generateQuiz = async (conceptTitle: string, mainTopic: string): Promise<Quiz> => {
    const prompt = `
        You are a quiz master. Create a short quiz with 3-4 multiple-choice questions to test understanding of the concept "${conceptTitle}" within the main topic of "${mainTopic}".
        For each question, provide 4 options and clearly indicate the correct answer.
        Ensure the questions are relevant, clear, and test the key points of the concept.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: quizSchema,
                temperature: 0.7,
            },
        });

        let jsonText = response.text.trim();
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.substring(7, jsonText.length - 3).trim();
        }
        
        const quiz = JSON.parse(jsonText);
        if (!Array.isArray(quiz)) {
            throw new Error("API did not return an array for the quiz.");
        }
        return quiz as Quiz;

    } catch (error) {
        console.error(`Error generating quiz for ${conceptTitle}:`, error);
        throw new Error("Failed to generate quiz from the AI model.");
    }
};