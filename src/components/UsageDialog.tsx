import { useState } from 'react';
import { X, Scissors } from 'lucide-react';
import { useFabricStore, type FabricEntry } from '../store/fabricStore';

interface UsageDialogProps {
  fabric: FabricEntry;
  isOpen: boolean;
  onClose: () => void;
}

export default function UsageDialog({ fabric, isOpen, onClose }: UsageDialogProps) {
  const recordUsage = useFabricStore(state => state.recordUsage);
  const [yardsUsed, setYardsUsed] = useState<number>(0);
  const [projectName, setProjectName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (yardsUsed > 0 && projectName.trim()) {
      recordUsage(fabric.id, yardsUsed, projectName.trim(), notes.trim() || undefined);
      setYardsUsed(0);
      setProjectName('');
      setNotes('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Scissors className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Record Fabric Usage</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900">{fabric.name}</h4>
          <p className="text-sm text-gray-600">{fabric.type} • {fabric.color}</p>
          <p className="text-sm text-gray-600">Available: {fabric.total_yards} yards</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="yardsUsed" className="block text-sm font-medium text-gray-700 mb-2">
              Yards Used *
            </label>
            <input
              type="number"
              id="yardsUsed"
              step="0.25"
              min="0.25"
              max={fabric.total_yards}
              value={yardsUsed || ''}
              onChange={(e) => setYardsUsed(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="0.00"
              required
            />
            {yardsUsed > fabric.total_yards && (
              <p className="text-sm text-red-600 mt-1">
                Cannot use more yards than available ({fabric.total_yards} yards)
              </p>
            )}
          </div>

          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
              Project Name *
            </label>
            <input
              type="text"
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., Summer Dress, Pillow Covers"
              required
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Notes (optional)
            </label>
            <textarea
              id="notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Any additional notes..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={!yardsUsed || !projectName.trim() || yardsUsed > fabric.total_yards}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Record Usage
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 hover:border-gray-400 text-gray-700 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}