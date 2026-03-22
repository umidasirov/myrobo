import React, { useRef, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

const BASE_URL = "https://api.myrobo.uz";

const LANGUAGES = [
  { value: "javascript", label: "JavaScript", apiLang: null },
  { value: "python", label: "Python", apiLang: "py" },
  { value: "c", label: "C", apiLang: "c" },
  { value: "cpp", label: "C++", apiLang: "cpp" },
  { value: "java", label: "Java", apiLang: null },
  { value: "arduino", label: "Arduino", apiLang: null },
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
    { label: "console.log", code: 'console.log("Hello World");' },
    { label: "arrow function", code: "const fn = (param) => {\n  \n};" },
    { label: "for loop", code: "for (let i = 0; i < arr.length; i++) {\n  \n}" },
    { label: "fetch", code: 'fetch("https://api.example.com")\n  .then(res => res.json())\n  .then(data => console.log(data));' },
    { label: "try/catch", code: "try {\n  \n} catch (error) {\n  console.error(error);\n}" },
    { label: "forEach", code: "arr.forEach((item) => {\n  console.log(item);\n});" },
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
  javascript: ["const","let","var","function","return","if","else","for","while","class","import","export","default","new","this","typeof","instanceof","async","await","try","catch","finally","throw","switch","case","break","continue","null","undefined","true","false","console","document","window","Promise","Array","Object","String","Number","Boolean","Math","JSON"],
  python: ["def","class","import","from","return","if","elif","else","for","while","try","except","finally","raise","with","as","pass","break","continue","lambda","yield","global","nonlocal","True","False","None","and","or","not","in","is","print","len","range","list","dict","tuple","set","str","int","float","open","input","type","isinstance"],
  c: ["int","float","double","char","void","return","if","else","for","while","do","switch","case","break","continue","struct","typedef","enum","union","const","static","extern","sizeof","include","define","printf","scanf","malloc","free","NULL","stdin","stdout","stderr"],
  cpp: ["int","float","double","char","void","bool","return","if","else","for","while","do","switch","case","break","continue","class","struct","public","private","protected","new","delete","this","namespace","using","template","typename","virtual","override","const","static","cout","cin","endl","string","vector","map","set","pair","auto","nullptr"],
  java: ["public","private","protected","class","interface","extends","implements","new","return","if","else","for","while","do","switch","case","break","continue","try","catch","finally","throw","throws","static","final","abstract","void","int","double","float","char","boolean","String","System","null","true","false","this","super","import","package","ArrayList","HashMap","List","Map","Override"],
  arduino: [],
};
const CodeEditor = ({ topicId, isCode = true }) => {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const disposablesRef = useRef([]);

  const [selectedLang, setSelectedLang] = useState("python");
  const [selectedTheme, setSelectedTheme] = useState("vs-dark");
  const [showSnippets, setShowSnippets] = useState(false);
  const [load, setLoad] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const theme = THEMES.find((t) => t.value === selectedTheme);
  const langConfig = LANGUAGES.find((l) => l.value === selectedLang);

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
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${
          accepted
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
    <div className="w-full border border-gray-200 rounded-lg overflow-hidden font-mono">
      <div className={`flex flex-wrap items-center gap-3 px-3 py-2 border-b ${theme.toolbar}`}>
        <div className="flex items-center gap-2">
          <label className={`text-sm ${theme.label}`}>Til:</label>
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className={`border rounded px-2 py-0.5 text-sm cursor-pointer outline-none ${theme.select}`}
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className={`text-sm ${theme.label}`}>Tema:</label>
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            className={`border rounded px-2 py-0.5 text-sm cursor-pointer outline-none ${theme.select}`}
          >
            {THEMES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label1}
              </option>
            ))}
          </select>
        </div>

        <div className="ml-auto">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            title={!langConfig?.apiLang ? `${langConfig?.label} topshirish uchun qo'llab-quvvatlanmaydi` : ""}
            className={`flex items-center gap-1.5 px-4 py-1 rounded text-sm font-medium transition-colors ${theme.run} ${
              !canSubmit ? "opacity-50 cursor-not-allowed" : ""
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
        </div>
      </div>

      {selectedLang !== "arduino" ? (
        <>
          <Editor
            height="400px"
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
        <div style={{ width: "100%", height: "500px" }}>
          <iframe
            src="https://wokwi.com/projects/new/arduino-uno"
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
