import React, { memo } from 'react';
import { Model } from '../types';
import { MODEL_PROVIDERS } from '../constants';

interface ModelSwitcherProps {
  currentModel: Model;
  onModelChange: (model: Model) => void;
  accentColor: string;
}

const ModelSwitcher: React.FC<ModelSwitcherProps> = ({ currentModel, onModelChange, accentColor }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onModelChange(e.target.value as Model);
  };
  
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  }

  const accentStyle = { '--agent-accent-color': accentColor } as React.CSSProperties;

  return (
    <div className="relative" onMouseDown={stopPropagation} style={accentStyle}>
      <select
        value={currentModel}
        onChange={handleChange}
        className="bg-gray-800/50 border border-[var(--agent-accent-color)]/30 text-gray-300 text-xs rounded-md py-1 pl-2 pr-7 appearance-none focus:outline-none focus:ring-1 focus:ring-[var(--agent-accent-color)] cursor-pointer"
      >
        {MODEL_PROVIDERS.map(provider => (
            <optgroup key={provider.name} label={provider.name} className="bg-gray-800 font-bold">
                {provider.models.map(model => (
                    <option 
                        key={model.id} 
                        value={model.id} 
                        disabled={model.disabled}
                        className="bg-gray-900 font-normal disabled:text-gray-500"
                    >
                        {model.name}
                    </option>
                ))}
            </optgroup>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--agent-accent-color)]/80">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  );
};

export default memo(ModelSwitcher);