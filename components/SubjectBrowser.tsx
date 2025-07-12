
import React, { useState } from 'react';

// Data structure
interface Topic {
  name: string;
  emoji: string;
}

interface SubCategory {
  name: string;
  emoji: string;
  topics: Topic[];
}

interface Category {
  name: string;
  emoji: string;
  subcategories: SubCategory[];
}

const subjectCategories: Category[] = [
    {
        name: 'Science & Math',
        emoji: '🔬',
        subcategories: [
          { name: 'Physics', emoji: '⚛️', topics: [ { name: 'Classical Mechanics', emoji: '⚙️' }, { name: 'Quantum Mechanics', emoji: '🔬' }, { name: 'Thermodynamics', emoji: '🔥' } ] },
          { name: 'Chemistry', emoji: '🧪', topics: [ { name: 'Organic Chemistry', emoji: '⚗️' }, { name: 'Inorganic Chemistry', emoji: '💎' }, { name: 'Biochemistry', emoji: '🧬' } ] },
          { name: 'Biology', emoji: '🧬', topics: [ { name: 'Cell Biology', emoji: '🦠' }, { name: 'Genetics', emoji: '🧬' }, { name: 'Ecology', emoji: '🌳' } ] },
          { name: 'Mathematics', emoji: '🧮', topics: [ { name: 'Algebra', emoji: '➕' }, { name: 'Calculus', emoji: '∫' }, { name: 'Geometry', emoji: '📐' } ] },
          { name: 'Astronomy', emoji: '🔭', topics: [ { name: 'Stellar Astronomy', emoji: '⭐' }, { name: 'Galactic Astronomy', emoji: '🌌' }, { name: 'Cosmology', emoji: '🌠' } ] },
          { name: 'Geology', emoji: '🌍', topics: [ { name: 'Mineralogy', emoji: '💎' }, { name: 'Paleontology', emoji: '🦖' }, { name: 'Volcanology', emoji: '🌋' } ] },
        ],
    },
    {
        name: 'Technology',
        emoji: '💻',
        subcategories: [
            { name: 'Computer Science', emoji: '🖥️', topics: [ { name: 'Data Structures', emoji: '📚' }, { name: 'Algorithms', emoji: '🧑‍💻' }, { name: 'Operating Systems', emoji: '⚙️' } ] },
            { name: 'Artificial Intelligence', emoji: '🤖', topics: [ { name: 'Machine Learning', emoji: '🧠' }, { name: 'Natural Language Processing', emoji: '🗣️' }, { name: 'Computer Vision', emoji: '👁️' } ] },
            { name: 'Web Development', emoji: '🌐', topics: [ { name: 'Frontend Development', emoji: '🎨' }, { name: 'Backend Development', emoji: '⚙️' }, { name: 'DevOps', emoji: '🚀' } ] },
            { name: 'Data Science', emoji: '📊', topics: [ { name: 'Data Analysis', emoji: '📈' }, { name: 'Data Visualization', emoji: '🖼️' }, { name: 'Predictive Modeling', emoji: '🔮' } ] },
            { name: 'Cybersecurity', emoji: '🛡️', topics: [ { name: 'Network Security', emoji: '🔒' }, { name: 'Cryptography', emoji: '🔑' }, { name: 'Ethical Hacking', emoji: '🕵️' } ] },
            { name: 'Blockchain', emoji: '⛓️', topics: [ { name: 'Cryptocurrencies', emoji: '🪙' }, { name: 'Smart Contracts', emoji: '📝' }, { name: 'Decentralized Finance (DeFi)', emoji: '🏦' } ] },
        ]
    },
    {
        name: 'Humanities',
        emoji: '🏛️',
        subcategories: [
            { name: 'History', emoji: '📜', topics: [ { name: 'Ancient History', emoji: '🏺' }, { name: 'Medieval History', emoji: '🏰' }, { name: 'Modern History', emoji: '🌍' } ] },
            { name: 'Philosophy', emoji: '🤔', topics: [ { name: 'Metaphysics', emoji: '🌌' }, { name: 'Epistemology', emoji: '🧐' }, { name: 'Ethics', emoji: '⚖️' } ] },
            { name: 'Literature', emoji: '📚', topics: [ { name: 'Classic Literature', emoji: '📖' }, { name: 'Contemporary Fiction', emoji: '✒️' }, { name: 'Poetry', emoji: '✍️' } ] },
            { name: 'Art History', emoji: '🖼️', topics: [ { name: 'Renaissance Art', emoji: '🎨' }, { name: 'Impressionism', emoji: '🖌️' }, { name: 'Modern Art', emoji: '✨' } ] },
            { name: 'Mythology', emoji: '🦄', topics: [ { name: 'Greek Mythology', emoji: '🏛️' }, { name: 'Norse Mythology', emoji: '⚡' }, { name: 'Egyptian Mythology', emoji: '⚱️' } ] },
            { name: 'Linguistics', emoji: '🗣️', topics: [ { name: 'Phonetics', emoji: '👂' }, { name: 'Syntax', emoji: '🌳' }, { name: 'Sociolinguistics', emoji: '🤝' } ] },
        ]
    },
    {
        name: 'Arts & Hobbies',
        emoji: '🎨',
        subcategories: [
            { name: 'Music Theory', emoji: '🎵', topics: [ { name: 'Harmony', emoji: '🎶' }, { name: 'Counterpoint', emoji: '🎼' }, { name: 'Musical Form', emoji: '🎹' } ] },
            { name: 'Creative Writing', emoji: '✍️', topics: [ { name: 'Fiction Writing', emoji: '📖' }, { name: 'Screenwriting', emoji: '🎬' }, { name: 'Poetry Writing', emoji: '✒️' } ] },
            { name: 'Photography', emoji: '📷', topics: [ { name: 'Portrait Photography', emoji: '👤' }, { name: 'Landscape Photography', emoji: '🏞️' }, { name: 'Street Photography', emoji: '🏙️' } ] },
            { name: 'Cooking', emoji: '🍳', topics: [ { name: 'Baking', emoji: '🥖' }, { name: 'Culinary Techniques', emoji: '🔪' }, { name: 'World Cuisines', emoji: '🍜' } ] },
            { name: 'Gardening', emoji: '🌱', topics: [ { name: 'Vegetable Gardening', emoji: '🥕' }, { name: 'Flower Gardening', emoji: '🌸' }, { name: 'Hydroponics', emoji: '💧' } ] },
            { name: 'Filmmaking', emoji: '🎬', topics: [ { name: 'Screenwriting', emoji: '✍️' }, { name: 'Cinematography', emoji: '🎥' }, { name: 'Film Editing', emoji: '🎞️' } ] },
        ]
    },
    {
        name: 'Business & Finance',
        emoji: '💼',
        subcategories: [
            { name: 'Economics', emoji: '📈', topics: [ { name: 'Microeconomics', emoji: '🧑‍💼' }, { name: 'Macroeconomics', emoji: '🌍' }, { name: 'Behavioral Economics', emoji: '🧠' } ] },
            { name: 'Marketing', emoji: '📢', topics: [ { name: 'Digital Marketing', emoji: '💻' }, { name: 'Content Marketing', emoji: '📝' }, { name: 'SEO', emoji: '🔍' } ] },
            { name: 'Personal Finance', emoji: '💰', topics: [ { name: 'Budgeting', emoji: '🧾' }, { name: 'Investing', emoji: '💹' }, { name: 'Retirement Planning', emoji: '🏝️' } ] },
            { name: 'Entrepreneurship', emoji: '💡', topics: [ { name: 'Business Planning', emoji: '📋' }, { name: 'Startup Funding', emoji: '💸' }, { name: 'Product Management', emoji: '📦' } ] },
            { name: 'Stock Market', emoji: '💹', topics: [ { name: 'Value Investing', emoji: '💎' }, { name: 'Growth Investing', emoji: '🚀' }, { name: 'Technical Analysis', emoji: '📊' } ] },
            { name: 'Real Estate', emoji: '🏠', topics: [ { name: 'Real Estate Investing', emoji: '🏘️' }, { name: 'Property Management', emoji: '🔑' }, { name: 'Real Estate Law', emoji: '⚖️' } ] },
        ]
    },
    {
        name: 'Health & Wellness',
        emoji: '🧘',
        subcategories: [
            { name: 'Nutrition', emoji: '🍎', topics: [ { name: 'Macronutrients', emoji: '💪' }, { name: 'Micronutrients', emoji: '💊' }, { name: 'Sports Nutrition', emoji: '🏃' } ] },
            { name: 'Fitness', emoji: '🏋️', topics: [ { name: 'Strength Training', emoji: '💪' }, { name: 'Cardiovascular Exercise', emoji: '❤️' }, { name: 'Yoga', emoji: '🧘‍♀️' } ] },
            { name: 'Psychology', emoji: '🧠', topics: [ { name: 'Cognitive Psychology', emoji: '🤔' }, { name: 'Social Psychology', emoji: '👥' }, { name: 'Clinical Psychology', emoji: '🛋️' } ] },
            { name: 'Neuroscience', emoji: '🔬', topics: [ { name: 'Cognitive Neuroscience', emoji: '🧠' }, { name: 'Behavioral Neuroscience', emoji: '🐀' }, { name: 'Molecular Neuroscience', emoji: '🧬' } ] },
            { name: 'Anatomy', emoji: '🦴', topics: [ { name: 'Skeletal System', emoji: '💀' }, { name: 'Muscular System', emoji: '💪' }, { name: 'Nervous System', emoji: '🧠' } ] },
            { name: 'Mindfulness', emoji: '🧘‍♀️', topics: [ { name: 'Meditation', emoji: '🕉️' }, { name: 'Stress Reduction', emoji: '😌' }, { name: 'Mindful Living', emoji: '💖' } ] },
        ]
    }
];

interface SubjectBrowserProps {
  onSelectTopic: (topic: string) => void;
}

const SubjectBrowser: React.FC<SubjectBrowserProps> = ({ onSelectTopic }) => {
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [expandedSubCategory, setExpandedSubCategory] = useState<string | null>(null);

    const handleCategoryClick = (categoryName: string) => {
        const newCategory = expandedCategory === categoryName ? null : categoryName;
        setExpandedCategory(newCategory);
        if (newCategory !== expandedCategory) {
            setExpandedSubCategory(null);
        }
    };

    const handleSubCategoryClick = (subCategoryKey: string) => {
        setExpandedSubCategory(expandedSubCategory === subCategoryKey ? null : subCategoryKey);
    };

    return (
        <div className="w-full max-w-xl mx-auto mt-12 animate-fade-in">
            <h2 className="text-lg font-medium text-center text-slate-400 mb-4">Or browse topics by category</h2>
            <div className="border border-slate-700 rounded-xl bg-slate-800/50 overflow-hidden">
                {subjectCategories.map((category, index) => (
                    <div key={category.name} className={`border-slate-700 ${index < subjectCategories.length - 1 ? 'border-b' : ''}`}>
                        <button onClick={() => handleCategoryClick(category.name)} className="w-full p-4 flex justify-between items-center hover:bg-slate-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500">
                            <div className="flex items-center">
                                <span className="text-2xl mr-4">{category.emoji}</span>
                                <span className="font-semibold text-lg text-slate-100">{category.name}</span>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-slate-400 transition-transform duration-300 ${expandedCategory === category.name ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        {expandedCategory === category.name && (
                            <div className="bg-slate-800/70 animate-fade-in py-2">
                                <ul className="px-4 space-y-1">
                                    {category.subcategories.map(sub => {
                                        const subCategoryKey = `${category.name}-${sub.name}`;
                                        const isSubCategoryExpanded = expandedSubCategory === subCategoryKey;
                                        return (
                                            <li key={subCategoryKey}>
                                                <button onClick={() => handleSubCategoryClick(subCategoryKey)} className="w-full text-left flex items-center justify-between p-2 rounded-md hover:bg-slate-700 transition-colors focus:outline-none focus:ring-1 focus:ring-sky-500">
                                                    <div className="flex items-center">
                                                        <span className="mr-3">{sub.emoji}</span>
                                                        <span className="text-slate-300 font-medium">{sub.name}</span>
                                                    </div>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${isSubCategoryExpanded ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                                </button>
                                                {isSubCategoryExpanded && (
                                                    <div className="pl-4 py-1 animate-fade-in">
                                                        <ul className="space-y-1 mt-1 border-l-2 border-slate-600">
                                                            {sub.topics.map(topic => (
                                                                <li key={topic.name}>
                                                                    <button onClick={() => onSelectTopic(topic.name)} className="w-full text-left flex items-center p-2 pl-3 rounded-r-md hover:bg-slate-600/50 transition-colors focus:outline-none focus:ring-1 focus:ring-sky-500">
                                                                        <span className="mr-3">{topic.emoji}</span>
                                                                        <span className="text-slate-400 text-sm">{topic.name}</span>
                                                                    </button>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SubjectBrowser;
