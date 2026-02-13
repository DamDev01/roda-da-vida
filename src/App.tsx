import { WheelOfLife } from './components/WheelOfLife';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-8">
      <div className="w-full max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-slate-800 mb-2">Roda da Vida Personalizada</h1>
          <p className="text-slate-600">Avalie cada área de 0 a 10</p>
        </div>
        <WheelOfLife />
      </div>
    </div>
  );
}
