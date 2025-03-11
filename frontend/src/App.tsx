import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ConversionResponse {
  html: string;
}

function App() {
  const [markdown, setMarkdown] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setMarkdown(text);
    setError("");

    if (!text.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      await axios.post<ConversionResponse>("http://localhost:8000/convert", { markdown: text });
      // Server response is handled by ReactMarkdown directly
    } catch (error) {
      setError("Failed to convert markdown. Please try again.");
      console.error("Error converting Markdown:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto p-4 md:p-6">
        <header className="mb-6 md:mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 animate-fade-in">
            Markdown Editor
          </h1>
          <p className="text-gray-600">Transform your markdown into beautiful HTML</p>
        </header>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg transform transition-all duration-300 ease-in-out animate-shake">
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 md:gap-6 min-h-[80vh] animate-slide-up">
          <div className="w-full md:w-1/3 bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-700">Editor</h2>
            </div>
            <textarea
              className="w-full h-[300px] md:h-[calc(100%-4rem)] p-4 text-gray-800 text-base md:text-lg font-mono 
                        border-0 resize-none focus:ring-0 focus:outline-none"
              placeholder="Type Markdown here..."
              value={markdown}
              onChange={handleChange}
            />
          </div>

          <div className="w-full md:w-2/3 bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-700">Preview</h2>
            </div>
            <div className="p-4 md:p-6 prose prose-sm md:prose-lg max-w-none h-[300px] md:h-[calc(100%-4rem)] overflow-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 md:h-10 md:w-10 border-4 border-blue-500 border-t-transparent"></div>
                </div>
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {markdown}
                </ReactMarkdown>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
