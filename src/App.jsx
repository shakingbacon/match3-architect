import React, { useState, useEffect } from 'react';

const Match3Generator = () => {
  const [params, setParams] = useState({
    minX: 10, maxX: 12,
    minY: 8, maxY: 9,
    deadCellChance: 10,
    symH: true, // Horizontal Symmetry
    symV: false, // Vertical Symmetry
    preset: 'ITS' 
  });
  
  const [grid, setGrid] = useState([]);
  const [stats, setStats] = useState({ x: 0, y: 0 });

  useEffect(() => {
    generateLevel();
  }, []);

  const handlePresetChange = (type) => {
    if (params.preset === type) {
      setParams({ ...params, preset: null });
    } else {
      if (type === 'ITS') {
        setParams({ ...params, preset: 'ITS', minX: 10, maxX: 12, minY: 8, maxY: 9 });
      } else if (type === 'SVT') {
        setParams({ ...params, preset: 'SVT', minX: 8, maxX: 9, minY: 10, maxY: 11 });
      }
    }
  };

  const generateLevel = () => {
    const width = Math.floor(Math.random() * (params.maxX - params.minX + 1)) + parseInt(params.minX);
    const height = Math.floor(Math.random() * (params.maxY - params.minY + 1)) + parseInt(params.minY);
    
    let newGrid = Array(height).fill().map(() => Array(width).fill(1));

    // Determine the range of the "Primary" area we need to randomize
    // If symmetrical, we only randomize the left half (H) and/or top half (V)
    const rangeX = params.symH ? Math.ceil(width / 2) : width;
    const rangeY = params.symV ? Math.ceil(height / 2) : height;

    for (let y = 0; y < rangeY; y++) {
      for (let x = 0; x < rangeX; x++) {
        const isDead = Math.random() * 100 < params.deadCellChance;
        
        if (isDead) {
          // Place original dead cell
          newGrid[y][x] = 0;

          // Mirror Horizontally
          if (params.symH) {
            newGrid[y][width - 1 - x] = 0;
          }
          // Mirror Vertically
          if (params.symV) {
            newGrid[height - 1 - y][x] = 0;
          }
          // Mirror both (Diagonal/Quadrant)
          if (params.symH && params.symV) {
            newGrid[height - 1 - y][width - 1 - x] = 0;
          }
        }
      }
    }
    setGrid(newGrid);
    setStats({ x: width, y: height });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-slate-900 text-white rounded-xl shadow-2xl mt-10 border border-slate-800">
      <h2 className="text-2xl font-bold mb-4 border-b border-slate-700 pb-2 text-blue-400">Match-3 Architect</h2>
      
      {/* Presets */}
      <div className="flex gap-6 mb-6 bg-slate-800 p-4 rounded-lg border border-slate-700">
        <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider self-center">Presets:</span>
        <label className="flex items-center gap-2 cursor-pointer hover:text-blue-300">
          <input type="checkbox" checked={params.preset === 'ITS'} onChange={() => handlePresetChange('ITS')} className="w-4 h-4 accent-blue-500" />
          <span className="font-bold">ITS</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer hover:text-blue-300">
          <input type="checkbox" checked={params.preset === 'SVT'} onChange={() => handlePresetChange('SVT')} className="w-4 h-4 accent-blue-500" />
          <span className="font-bold">SVT</span>
        </label>
      </div>

      {/* Dimensions */}
      <div className="grid grid-cols-2 gap-4 mb-6 opacity-80">
        <div>
          <label className="block text-xs text-slate-400 mb-1">X Range (Width)</label>
          <div className="flex gap-2">
            <input type="number" value={params.minX} onChange={e => setParams({...params, minX: e.target.value, preset: null})} className="w-full bg-slate-800 p-2 rounded border border-slate-700" />
            <input type="number" value={params.maxX} onChange={e => setParams({...params, maxX: e.target.value, preset: null})} className="w-full bg-slate-800 p-2 rounded border border-slate-700" />
          </div>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Y Range (Height)</label>
          <div className="flex gap-2">
            <input type="number" value={params.minY} onChange={e => setParams({...params, minY: e.target.value, preset: null})} className="w-full bg-slate-800 p-2 rounded border border-slate-700" />
            <input type="number" value={params.maxY} onChange={e => setParams({...params, maxY: e.target.value, preset: null})} className="w-full bg-slate-800 p-2 rounded border border-slate-700" />
          </div>
        </div>
      </div>

      {/* Density Slider */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium">Dead Cell Density</label>
          <span className="bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded text-sm font-bold">{params.deadCellChance}%</span>
        </div>
        <input type="range" min="0" max="50" value={params.deadCellChance} onChange={e => setParams({...params, deadCellChance: e.target.value})} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
      </div>

      {/* Symmetry Toggles */}
      <div className="flex flex-wrap gap-6 mb-6 p-4 bg-slate-800/40 rounded-lg border border-slate-700/50">
        <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider self-center w-full mb-1">Symmetry Axes:</span>
        <label className="flex items-center cursor-pointer text-sm font-medium">
          <input type="checkbox" checked={params.symH} onChange={e => setParams({...params, symH: e.target.checked})} className="mr-2 w-4 h-4 accent-blue-500" />
          Horizontal (X-Mirror)
        </label>
        <label className="flex items-center cursor-pointer text-sm font-medium">
          <input type="checkbox" checked={params.symV} onChange={e => setParams({...params, symV: e.target.checked})} className="mr-2 w-4 h-4 accent-blue-500" />
          Vertical (Y-Mirror)
        </label>
        <button onClick={generateLevel} className="ml-auto bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-lg font-bold shadow-lg transition-all active:scale-95 uppercase">Generate</button>
      </div>

      {/* Grid Preview */}
      {grid.length > 0 && (
        <div className="bg-slate-950 p-8 rounded-lg flex flex-col items-center border border-slate-800 shadow-inner min-h-[400px] justify-center">
          <div className="mb-6 text-slate-500 text-xs tracking-widest uppercase font-bold">Previewing {stats.x} x {stats.y} Board</div>
          <div 
            className="grid gap-1" 
            style={{ 
              gridTemplateColumns: `repeat(${stats.x}, minmax(0, 1fr))`,
              width: `${Math.min(stats.x * 34, 500)}px` 
            }}
          >
            {grid.map((row, y) => row.map((cell, x) => (
              <div 
                key={`${x}-${y}`} 
                className={`aspect-square rounded-md transition-all duration-300 ${cell === 1 ? 'bg-gradient-to-br from-blue-400 to-blue-600 ring-1 ring-blue-300/30' : 'bg-slate-800/20'}`}
              />
            )))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Match3Generator;