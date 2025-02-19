// pages/components/CodeDisplay.tsx (or any component you use)
import { useEffect, useRef } from 'react';
import Prism from 'prismjs'; // Import Prism.js
import 'prismjs/themes/prism-tomorrow.css'; // Import a theme (choose one you like)
import 'prismjs/components/prism-typescript'; // Import the TypeScript language support
import 'prismjs/components/prism-markdown'; 
interface CodeDisplayProps {
  code: string;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ code }) => {
  const codeRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    Prism.highlightAll(); // Highlight the code after the component renders
  }, [code]); // Re-highlight if the code changes

  return (
    <pre data-line="" data-src="plugins/toolbar/prism-toolbar.js" className="language-markdown line-numbers" ref={codeRef}> {/* Important: language-typescript class */}
      <code className="language-typescript line-numbers rounded-lg bg-black"> {/* Important: language-typescript class */}
        {code}
      </code>
    </pre>
  );
};

export default CodeDisplay;


