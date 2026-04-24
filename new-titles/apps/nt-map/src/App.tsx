import { AcquisitionsFileSchema } from '@nt/data/schema';
import acquisitionsData from '@nt/data/acquisitions.json';
import { Map } from './Map.tsx';

const { records } = AcquisitionsFileSchema.parse(acquisitionsData);

export function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>New Titles</h1>
        <p>Recent acquisitions mapped by geographic subject.</p>
      </header>
      <Map records={records} />
    </div>
  );
}
