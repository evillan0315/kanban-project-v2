// In your page component (e.g., pages/my-page.tsx)
import CodeDisplay from '@/components/CodeDisplay';

import { useEffect, useState } from "react";

export default function MyPage() {
    const [typescriptCode, setTypescriptCode] = useState('');
  
    useEffect(() => {
       fetch('https://raw.githubusercontent.com/evillan0315/node-google-sheet/refs/heads/master/README.md') // Fetch your code from the API route
        .then(res => res.text())
        .then(code => setTypescriptCode(code));
    }, []);
  
    return (
      <div className='rounded-full'>
         <CodeDisplay code={typescriptCode} />
      </div>
    )
  
  }