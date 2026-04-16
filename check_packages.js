
const ReactMarkdown = require('react-markdown');
const remarkGfm = require('remark-gfm');
const { motion, AnimatePresence } = require('framer-motion');
const { Prism: SyntaxHighlighter } = require('react-syntax-highlighter');

console.log('ReactMarkdown:', ReactMarkdown);
console.log('remarkGfm:', remarkGfm);
console.log('motion:', typeof motion);
console.log('AnimatePresence:', typeof AnimatePresence);
console.log('SyntaxHighlighter:', typeof SyntaxHighlighter);
