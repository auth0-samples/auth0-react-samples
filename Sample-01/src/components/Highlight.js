import React, { useEffect, useRef } from 'react';

import hljs from 'highlight.js';
import 'highlight.js/styles/monokai-sublime.css';

const Highlight = (props) => {
  const { text, language = 'json' } = props;

  const codeNode = useRef(null);
  useEffect(() => {
    hljs.highlightElement(codeNode.current);
  }, [text]);

  return (
    <pre className="rounded">
      <code ref={codeNode} className={language}>
        {text}
      </code>
    </pre>
  );
};

export default Highlight;