'use client'
import React from "react";
import AceEditor from "react-ace";

// Import languages and themes as needed
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
interface AceCodeEditorProps {
  initialCode: string;
  mode?: string;
  handleChange: (code: string) => void;
  onSave?: ()=> void
}
const AceCodeEditor: React.FC<AceCodeEditorProps> = ({
  initialCode,
  mode,
  handleChange,
}) => {
  function handleCodeChange(code:string){
    console.log(code);
    handleChange(code as string)
  }
  return (
    <>
      <AceEditor
        mode={mode || "json"}
        theme="monokai"
        name="ace-editor"
        height="100vh"
        width="100%"
        value={initialCode}
        onChange={handleCodeChange}
	      className="bg-neutral-900 max-h-[440px]"

        onLoad={(editor) => {
          editor.renderer.setShowGutter(false); // Hide line numbers
        }}
        fontSize={16}
        editorProps={{ $blockScrolling: true,$blockSelectEnabled :false  }}
      />
    </>
  );
};

export default AceCodeEditor;
