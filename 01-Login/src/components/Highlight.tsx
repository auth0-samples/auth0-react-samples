import React, { useState, useEffect, useRef } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/monokai-sublime.css";

type HighlightProps = {
  language?: string;
};

const Highlight: React.FC<HighlightProps> = ({ language, children }) => {
  const [loaded, setLoaded] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    highlight();
    setLoaded(true);
  }, [loaded]);

  const highlight = () => {
    codeRef && codeRef.current && hljs.highlightBlock(codeRef.current);
  };

  if (!loaded) {
    return null;
  }

  return (
    <pre className="rounded">
      <code ref={codeRef} className={language}>
        {children}
      </code>
    </pre>
  );
};

Highlight.defaultProps = {
  language: "json",
};

export default Highlight;
