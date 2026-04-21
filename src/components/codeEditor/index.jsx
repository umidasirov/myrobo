import React, { useRef, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import {
  Maximize2, Minimize2,
  Braces,
  Terminal,
  Cpu,
  Coffee,
  Hash,
  CircuitBoard
} from "lucide-react";
import logo from "../../../public/logo.svg";
const BASE_URL = "https://myrobo.uz/api";

const LANGUAGES = [
  { value: "javascript", label: "JavaScript", apiLang: null, icon: <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 48 48"><path fill="#ffd600" d="M6,42V6h36v36H6z"></path><path fill="#000001" d="M29.538 32.947c.692 1.124 1.444 2.201 3.037 2.201 1.338 0 2.04-.665 2.04-1.585 0-1.101-.726-1.492-2.198-2.133l-.807-.344c-2.329-.988-3.878-2.226-3.878-4.841 0-2.41 1.845-4.244 4.728-4.244 2.053 0 3.528.711 4.592 2.573l-2.514 1.607c-.553-.988-1.151-1.377-2.078-1.377-.946 0-1.545.597-1.545 1.377 0 .964.6 1.354 1.985 1.951l.807.344C36.452 29.645 38 30.839 38 33.523 38 36.415 35.716 38 32.65 38c-2.999 0-4.702-1.505-5.65-3.368L29.538 32.947zM17.952 33.029c.506.906 1.275 1.603 2.381 1.603 1.058 0 1.667-.418 1.667-2.043V22h3.333v11.101c0 3.367-1.953 4.899-4.805 4.899-2.577 0-4.437-1.746-5.195-3.368L17.952 33.029z"></path></svg> },
  { value: "python", label: "Python", apiLang: "py", icon: <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 48 48"><path fill="#0277bd" d="M24.047,5c-1.555,0.005-2.633,0.142-3.936,0.367c-3.848,0.67-4.549,2.077-4.549,4.67V14h9v2H15.22	h-4.35c-2.636,0-4.943,1.242-5.674,4.219c-0.826,3.417-0.863,5.557,0,9.125C5.851,32.005,7.294,34,9.931,34h3.632v-5.104	c0-2.966,2.686-5.896,5.764-5.896h7.236c2.523,0,5-1.862,5-4.377v-8.586c0-2.439-1.759-4.263-4.218-4.672	C27.406,5.359,25.589,4.994,24.047,5z M19.063,9c0.821,0,1.5,0.677,1.5,1.502c0,0.833-0.679,1.498-1.5,1.498	c-0.837,0-1.5-0.664-1.5-1.498C17.563,9.68,18.226,9,19.063,9z"></path><path fill="#ffc107" d="M23.078,43c1.555-0.005,2.633-0.142,3.936-0.367c3.848-0.67,4.549-2.077,4.549-4.67V34h-9v-2h9.343	h4.35c2.636,0,4.943-1.242,5.674-4.219c0.826-3.417,0.863-5.557,0-9.125C41.274,15.995,39.831,14,37.194,14h-3.632v5.104	c0,2.966-2.686,5.896-5.764,5.896h-7.236c-2.523,0-5,1.862-5,4.377v8.586c0,2.439,1.759,4.263,4.218,4.672	C19.719,42.641,21.536,43.006,23.078,43z M28.063,39c-0.821,0-1.5-0.677-1.5-1.502c0-0.833,0.679-1.498,1.5-1.498	c0.837,0,1.5,0.664,1.5,1.498C29.563,38.32,28.899,39,28.063,39z"></path></svg> },
  { value: "c", label: "C", apiLang: "c", icon: <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 48 48"><path fill="#283593" fill-rule="evenodd" d="M22.903,3.286c0.679-0.381,1.515-0.381,2.193,0 c3.355,1.883,13.451,7.551,16.807,9.434C42.582,13.1,43,13.804,43,14.566c0,3.766,0,15.101,0,18.867 c0,0.762-0.418,1.466-1.097,1.847c-3.355,1.883-13.451,7.551-16.807,9.434c-0.679,0.381-1.515,0.381-2.193,0 c-3.355-1.883-13.451-7.551-16.807-9.434C5.418,34.899,5,34.196,5,33.434c0-3.766,0-15.101,0-18.867 c0-0.762,0.418-1.466,1.097-1.847C9.451,10.837,19.549,5.169,22.903,3.286z" clip-rule="evenodd"></path><path fill="#5c6bc0" fill-rule="evenodd" d="M5.304,34.404C5.038,34.048,5,33.71,5,33.255 c0-3.744,0-15.014,0-18.759c0-0.758,0.417-1.458,1.094-1.836c3.343-1.872,13.405-7.507,16.748-9.38 c0.677-0.379,1.594-0.371,2.271,0.008c3.343,1.872,13.371,7.459,16.714,9.331c0.27,0.152,0.476,0.335,0.66,0.576L5.304,34.404z" clip-rule="evenodd"></path><path fill="#fff" fill-rule="evenodd" d="M24,10c7.727,0,14,6.273,14,14s-6.273,14-14,14 s-14-6.273-14-14S16.273,10,24,10z M24,17c3.863,0,7,3.136,7,7c0,3.863-3.137,7-7,7s-7-3.137-7-7C17,20.136,20.136,17,24,17z" clip-rule="evenodd"></path><path fill="#3949ab" fill-rule="evenodd" d="M42.485,13.205c0.516,0.483,0.506,1.211,0.506,1.784 c0,3.795-0.032,14.589,0.009,18.384c0.004,0.396-0.127,0.813-0.323,1.127L23.593,24L42.485,13.205z" clip-rule="evenodd"></path></svg> },
  {
    value: "cpp", label: "C++", apiLang: "cpp", icon: <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 48 48">
      <path fill="#00549d" fill-rule="evenodd" d="M22.903,3.286c0.679-0.381,1.515-0.381,2.193,0 c3.355,1.883,13.451,7.551,16.807,9.434C42.582,13.1,43,13.804,43,14.566c0,3.766,0,15.101,0,18.867 c0,0.762-0.418,1.466-1.097,1.847c-3.355,1.883-13.451,7.551-16.807,9.434c-0.679,0.381-1.515,0.381-2.193,0 c-3.355-1.883-13.451-7.551-16.807-9.434C5.418,34.899,5,34.196,5,33.434c0-3.766,0-15.101,0-18.867 c0-0.762,0.418-1.466,1.097-1.847C9.451,10.837,19.549,5.169,22.903,3.286z" clip-rule="evenodd"></path><path fill="#0086d4" fill-rule="evenodd" d="M5.304,34.404C5.038,34.048,5,33.71,5,33.255 c0-3.744,0-15.014,0-18.759c0-0.758,0.417-1.458,1.094-1.836c3.343-1.872,13.405-7.507,16.748-9.38 c0.677-0.379,1.594-0.371,2.271,0.008c3.343,1.872,13.371,7.459,16.714,9.331c0.27,0.152,0.476,0.335,0.66,0.576L5.304,34.404z" clip-rule="evenodd"></path><path fill="#fff" fill-rule="evenodd" d="M24,10c7.727,0,14,6.273,14,14s-6.273,14-14,14 s-14-6.273-14-14S16.273,10,24,10z M24,17c3.863,0,7,3.136,7,7c0,3.863-3.137,7-7,7s-7-3.137-7-7C17,20.136,20.136,17,24,17z" clip-rule="evenodd"></path><path fill="#0075c0" fill-rule="evenodd" d="M42.485,13.205c0.516,0.483,0.506,1.211,0.506,1.784 c0,3.795-0.032,14.589,0.009,18.384c0.004,0.396-0.127,0.813-0.323,1.127L23.593,24L42.485,13.205z" clip-rule="evenodd"></path><path fill="#fff" fill-rule="evenodd" d="M31 21H33V27H31zM38 21H40V27H38z" clip-rule="evenodd"></path><path fill="#fff" fill-rule="evenodd" d="M29 23H35V25H29zM36 23H42V25H36z" clip-rule="evenodd"></path>
    </svg>
  },
  {
    value: "java", label: "Java", apiLang: null, icon: <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
      <path fill="#F44336" d="M23.65,24.898c-0.998-1.609-1.722-2.943-2.725-5.455C19.229,15.2,31.24,11.366,26.37,3.999c2.111,5.089-7.577,8.235-8.477,12.473C17.07,20.37,23.645,24.898,23.65,24.898z"></path><path fill="#F44336" d="M23.878,17.27c-0.192,2.516,2.229,3.857,2.299,5.695c0.056,1.496-1.447,2.743-1.447,2.743s2.728-0.536,3.579-2.818c0.945-2.534-1.834-4.269-1.548-6.298c0.267-1.938,6.031-5.543,6.031-5.543S24.311,11.611,23.878,17.27z"></path><g><path fill="#1565C0" d="M32.084 25.055c1.754-.394 3.233.723 3.233 2.01 0 2.901-4.021 5.643-4.021 5.643s6.225-.742 6.225-5.505C37.521 24.053 34.464 23.266 32.084 25.055zM29.129 27.395c0 0 1.941-1.383 2.458-1.902-4.763 1.011-15.638 1.147-15.638.269 0-.809 3.507-1.638 3.507-1.638s-7.773-.112-7.773 2.181C11.683 28.695 21.858 28.866 29.129 27.395z"></path><path fill="#1565C0" d="M27.935,29.571c-4.509,1.499-12.814,1.02-10.354-0.993c-1.198,0-2.974,0.963-2.974,1.889c0,1.857,8.982,3.291,15.63,0.572L27.935,29.571z"></path><path fill="#1565C0" d="M18.686,32.739c-1.636,0-2.695,1.054-2.695,1.822c0,2.391,9.76,2.632,13.627,0.205l-2.458-1.632C24.271,34.404,17.014,34.579,18.686,32.739z"></path><path fill="#1565C0" d="M36.281,36.632c0-0.936-1.055-1.377-1.433-1.588c2.228,5.373-22.317,4.956-22.317,1.784c0-0.721,1.807-1.427,3.477-1.093l-1.42-0.839C11.26,34.374,9,35.837,9,37.017C9,42.52,36.281,42.255,36.281,36.632z"></path><path fill="#1565C0" d="M39,38.604c-4.146,4.095-14.659,5.587-25.231,3.057C24.341,46.164,38.95,43.628,39,38.604z"></path></g>
    </svg>
  },
  { value: "arduino", label: "Robototexnika", apiLang: null, icon: logo },
];

const THEMES = [
  {
    value: "vs-dark",
    label1: "🌙 Dark",
    toolbar: "bg-[#1E1E1E] border-[#3c3c3c]",
    select: "bg-[#2c313a] text-gray-300 border-[#3c3c3c]",
    label: "text-gray-400",
    btn: "bg-[#2c313a] text-blue-400 border-[#3c3c3c] hover:bg-[#3a3f4b]",
    run: "bg-green-700 hover:bg-green-600 text-white",
    snippet: "bg-[#21252b] border-[#3c3c3c]",
    snippetItem: "text-gray-400 hover:bg-[#3a3f4b]",
    output: "bg-[#1E1E1E] border-gray-700 text-white",
    outputPre: "bg-gray-800",
  },
  {
    value: "light",
    label1: "☀️ Light",
    toolbar: "bg-[#f3f3f3] border-[#d4d4d4]",
    select: "bg-white text-gray-700 border-[#d4d4d4]",
    label: "text-gray-600",
    btn: "bg-white text-blue-600 border-[#d4d4d4] hover:bg-gray-100",
    run: "bg-green-600 hover:bg-green-500 text-white",
    snippet: "bg-white border-[#d4d4d4]",
    snippetItem: "text-gray-700 hover:bg-gray-100",
    output: "bg-gray-100 border-gray-300 text-gray-800",
    outputPre: "bg-gray-200",
  },
  {
    value: "hc-black",
    label1: "⚫ High Contrast",
    toolbar: "bg-black border-yellow-400",
    select: "bg-black text-yellow-300 border-yellow-400",
    label: "text-yellow-300",
    btn: "bg-black text-yellow-300 border-yellow-400 hover:bg-yellow-900",
    run: "bg-yellow-400 hover:bg-yellow-300 text-black font-bold",
    snippet: "bg-black border-yellow-400",
    snippetItem: "text-yellow-300 hover:bg-yellow-900",
    output: "bg-black border-yellow-400 text-yellow-300",
    outputPre: "bg-gray-900",
  },
];

const SNIPPETS = {
  javascript: [
    { label: "arrow function", code: "const fn = (param) => {\n  \n};" },
    { label: "for loop", code: "for (let i = 0; i < arr.length; i++) {\n  \n}" },
    { label: "fetch", code: 'fetch("https://api.example.com")\n  .then(res => res.json())\n  .then(data => data);' },
    { label: "try/catch", code: "try {\n  \n} catch (error) {\n  \n}" },
    { label: "forEach", code: "arr.forEach((item) => {\n  \n});" },
    { label: "map", code: "const result = arr.map((item) => item);" },
  ],
  python: [
    { label: "print", code: 'print("Hello World")' },
    { label: "def function", code: "def my_function(param):\n    pass" },
    { label: "for loop", code: "for i in range(10):\n    print(i)" },
    { label: "list comprehension", code: "result = [x for x in range(10) if x % 2 == 0]" },
    { label: "try/except", code: "try:\n    pass\nexcept Exception as e:\n    print(e)" },
    { label: "class", code: "class MyClass:\n    def __init__(self):\n        pass" },
    { label: "import", code: "import os\nimport sys" },
  ],
  c: [
    { label: "main", code: '#include <stdio.h>\n\nint main() {\n    printf("Hello World\\n");\n    return 0;\n}' },
    { label: "printf", code: 'printf("%d\\n", value);' },
    { label: "for", code: "for (int i = 0; i < 10; i++) {\n    \n}" },
    { label: "scanf", code: 'scanf("%d", &value);' },
    { label: "array", code: "int arr[10] = {0};" },
    { label: "struct", code: "struct MyStruct {\n    int x;\n    int y;\n};" },
    { label: "pointer", code: "int *ptr = &value;" },
  ],
  cpp: [
    { label: "main", code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello World" << endl;\n    return 0;\n}' },
    { label: "cout", code: "cout << value << endl;" },
    { label: "for", code: "for (int i = 0; i < 10; i++) {\n    \n}" },
    { label: "vector", code: "vector<int> v = {1, 2, 3};" },
    { label: "class", code: "class MyClass {\npublic:\n    MyClass() {}\n    ~MyClass() {}\n};" },
    { label: "map", code: 'map<string, int> m;\nm["key"] = 1;' },
    { label: "lambda", code: "auto fn = [](int x) { return x * 2; };" },
  ],
  java: [
    { label: "main class", code: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World");\n    }\n}' },
    { label: "System.out.println", code: "System.out.println(value);" },
    { label: "for loop", code: "for (int i = 0; i < 10; i++) {\n    \n}" },
    { label: "ArrayList", code: "ArrayList<String> list = new ArrayList<>();" },
    { label: "HashMap", code: 'HashMap<String, Integer> map = new HashMap<>();\nmap.put("key", 1);' },
    { label: "try/catch", code: "try {\n    \n} catch (Exception e) {\n    e.printStackTrace();\n}" },
    { label: "interface", code: "public interface MyInterface {\n    void myMethod();\n}" },
  ],
  arduino: [],
};

const KEYWORDS = {
  javascript: ["const", "let", "var", "function", "return", "if", "else", "for", "while", "class", "import", "export", "default", "new", "this", "typeof", "instanceof", "async", "await", "try", "catch", "finally", "throw", "switch", "case", "break", "continue", "null", "undefined", "true", "false", "console", "document", "window", "Promise", "Array", "Object", "String", "Number", "Boolean", "Math", "JSON"],
  python: ["def", "class", "import", "from", "return", "if", "elif", "else", "for", "while", "try", "except", "finally", "raise", "with", "as", "pass", "break", "continue", "lambda", "yield", "global", "nonlocal", "True", "False", "None", "and", "or", "not", "in", "is", "print", "len", "range", "list", "dict", "tuple", "set", "str", "int", "float", "open", "input", "type", "isinstance"],
  c: ["int", "float", "double", "char", "void", "return", "if", "else", "for", "while", "do", "switch", "case", "break", "continue", "struct", "typedef", "enum", "union", "const", "static", "extern", "sizeof", "include", "define", "printf", "scanf", "malloc", "free", "NULL", "stdin", "stdout", "stderr"],
  cpp: ["int", "float", "double", "char", "void", "bool", "return", "if", "else", "for", "while", "do", "switch", "case", "break", "continue", "class", "struct", "public", "private", "protected", "new", "delete", "this", "namespace", "using", "template", "typename", "virtual", "override", "const", "static", "cout", "cin", "endl", "string", "vector", "map", "set", "pair", "auto", "nullptr"],
  java: ["public", "private", "protected", "class", "interface", "extends", "implements", "new", "return", "if", "else", "for", "while", "do", "switch", "case", "break", "continue", "try", "catch", "finally", "throw", "throws", "static", "final", "abstract", "void", "int", "double", "float", "char", "boolean", "String", "System", "null", "true", "false", "this", "super", "import", "package", "ArrayList", "HashMap", "List", "Map", "Override"],
  arduino: [],
};

const CodeEditor = ({ topicId, isCode = true }) => {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const disposablesRef = useRef([]);
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("python");
  const [selectedTheme, setSelectedTheme] = useState("vs-dark");
  const [showSnippets, setShowSnippets] = useState(false);
  const [load, setLoad] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const theme = THEMES.find((t) => t.value === selectedTheme);
  const langConfig = LANGUAGES.find((l) => l.value === selectedLang);
 const selectedIcon = langConfig?.icon;

  // Fullscreen toggle funksiyasi
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  // Fullscreen change event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const registerAutocomplete = (monaco, lang) => {
    disposablesRef.current.forEach((d) => d.dispose());
    disposablesRef.current = [];

    const monacoLang = lang === "c" ? "cpp" : lang;
    const keywords = KEYWORDS[lang] ?? [];
    const snippets = SNIPPETS[lang] ?? [];

    const disposable = monaco.languages.registerCompletionItemProvider(monacoLang, {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };
        const keywordSuggestions = keywords.map((kw) => ({
          label: kw,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: kw,
          range,
        }));
        const snippetSuggestions = snippets.map((s) => ({
          label: s.label,
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: s.code,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: s.code,
          range,
        }));
        return { suggestions: [...keywordSuggestions, ...snippetSuggestions] };
      },
    });

    disposablesRef.current.push(disposable);
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    registerAutocomplete(monaco, selectedLang);
  };

  useEffect(() => {
    if (monacoRef.current) registerAutocomplete(monacoRef.current, selectedLang);
  }, [selectedLang]);

  const insertSnippet = (code) => {
    const editor = editorRef.current;
    if (!editor) return;
    const position = editor.getPosition();
    editor.executeEdits("snippet", [
      {
        range: {
          startLineNumber: position.lineNumber,
          startColumn: position.column,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        },
        text: code,
      },
    ]);
    editor.focus();
    setShowSnippets(false);
  };

  const handleSubmit = async () => {
    const sourceCode = editorRef.current?.getValue() ?? "";

    if (!sourceCode.trim()) {
      setError("Kod bo'sh. Iltimos, kod yozing.");
      return;
    }

    const apiLang = langConfig?.apiLang;
    if (!apiLang) {
      setError(`"${langConfig?.label}" tili hozircha topshirish uchun qo'llab-quvvatlanmaydi.`);
      return;
    }

    if (!isCode) {
      setError("Bu mavzu code emas.");
      return;
    }

    setLoad(true);
    setResponse(null);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${BASE_URL}/courses/topics/${topicId}/submit/`,
        {
          language: apiLang,
          source_code: sourceCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setResponse(res.data);
    } catch (err) {
      const detail = err?.response?.data?.detail ?? err?.message ?? "Xatolik yuz berdi.";
      setError(detail);
    } finally {
      setLoad(false);
    }
  };

  const StatusBadge = ({ status }) => {
    const accepted = status === "accepted";
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${accepted
          ? "bg-green-500/20 text-green-400 border border-green-500/40"
          : "bg-red-500/20 text-red-400 border border-red-500/40"
          }`}
      >
        {status}
      </span>
    );
  };

  const canSubmit = isCode && !!langConfig?.apiLang && !load;

  return (
    <div
      ref={containerRef}
      className={`w-full border border-gray-200 rounded-lg overflow-hidden font-mono ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}
    >
      <div className={`flex flex-wrap items-center gap-3 px-3 py-2 border-b ${theme.toolbar}`}>
        <div className="flex items-center gap-2">
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className={`border rounded px-2 py-0.5 text-sm cursor-pointer outline-none ${theme.select}`}
          >
            {LANGUAGES.map((l) => {
              const Icon = l.icon;
              return (
                <option key={l.value} value={l.value} className="flex items-center gap-2">
                  {l.label}
                </option>
              );
            })}
          </select>
          {/* Selected language icon display */}
          {selectedIcon && (
            <div className={`flex items-center justify-center w-6 h-6 rounded ${theme.select}`}>
              {typeof selectedIcon === "string" ? (
                <img src={selectedIcon} alt={langConfig.label} className="w-4 h-4 object-contain" />
              ) : (
                selectedIcon
              )}
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Fullscreen button */}
          <button
            onClick={toggleFullscreen}
            className={`flex items-center justify-center p-1.5 rounded transition-colors ${theme.btn}`}
            title={isFullscreen ? "Fullscreen dan chiqish" : "Fullscreen ga o'tish"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
          {selectedLang !== "arduino" &&
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              title={!langConfig?.apiLang ? `${langConfig?.label} topshirish uchun qo'llab-quvvatlanmaydi` : ""}
              className={`flex items-center gap-1.5 px-4 py-1 rounded text-sm font-medium transition-colors ${theme.run} ${!canSubmit ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              {load ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Yuborilmoqda...
                </>
              ) : (
                "▶ Topshirish"
              )}
            </button>
          }
        </div>
      </div>

      {selectedLang !== "arduino" ? (
        <>
          <div className={isFullscreen ? 'h-[calc(100vh-120px)]' : ''}>
            <Editor
              height={isFullscreen ? "100%" : "400px"}
              language={selectedLang === "c" ? "cpp" : selectedLang}
              theme={selectedTheme}
              onMount={handleEditorDidMount}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                wordWrap: "on",
                automaticLayout: true,
                quickSuggestions: true,
                suggestOnTriggerCharacters: true,
                tabSize: 2,
                scrollBeyondLastLine: false,
              }}
            />
          </div>

          {error && (
            <div className={`p-4 border-t ${theme.output}`}>
              <p className="text-red-400 font-semibold">⚠ Xatolik: {error}</p>
            </div>
          )}

          {response && (
            <div className={`p-4 font-mono border-t ${theme.output}`}>
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-sm font-semibold ${theme.label}`}>Natija:</span>
                <StatusBadge status={response.status} />
              </div>

              {response.error_message && (
                <div className="mb-3">
                  <strong className="text-sm text-red-400">Xato xabari:</strong>
                  <pre className={`mt-1 p-2 rounded text-sm overflow-x-auto text-red-300 ${theme.outputPre}`}>
                    {response.error_message}
                  </pre>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div style={{ width: "100%", height: isFullscreen ? "calc(100vh - 80px)" : "500px" }}>
          <iframe
            src="https://simulyator.adxamov.uz/"
            width="100%"
            height="100%"
            style={{ border: "none" }}
            allowFullScreen
            title="Arduino Simulator"
          />
        </div>
      )}
    </div>
  );
};

export default CodeEditor;