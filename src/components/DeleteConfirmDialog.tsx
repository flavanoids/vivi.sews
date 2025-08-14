import { AlertTriangle } from 'lucide-react';
import { type FabricEntry, type Project, type Pattern } from '../store/fabricStore';

interface DeleteConfirmDialogProps {
  fabric: FabricEntry | null;
  project: Project | null;
  pattern: Pattern | null;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmDialog({ fabric, project, pattern, isOpen, onConfirm, onCancel }: DeleteConfirmDialogProps) {
  if (!isOpen || (!fabric && !project && !pattern)) return null;

  const isProject = !!project;
  const isPattern = !!pattern;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Delete {isProject ? 'Project' : isPattern ? 'Pattern' : 'Fabric'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">This action cannot be undone</p>
          </div>
        </div>

        <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          {isProject && project ? (
            <>
              <h4 className="font-medium text-gray-900 dark:text-white">{project.name}</h4>
              {project.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400">{project.description}</p>
              )}
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {project.materials.length} materials • {project.status}
              </p>
            </>
          ) : isPattern && pattern ? (
            <>
              <h4 className="font-medium text-gray-900 dark:text-white">{pattern.name}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">by {pattern.designer}</p>
              {pattern.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400">{pattern.description}</p>
              )}
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {pattern.category} • {pattern.difficulty}
              </p>
            </>
          ) : fabric ? (
            <>
              <h4 className="font-medium text-gray-900 dark:text-white">{fabric.name}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{fabric.type} • {fabric.color}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{fabric.yardsLeft} yards remaining</p>
            </>
          ) : null}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Delete {isProject ? 'Project' : isPattern ? 'Pattern' : 'Fabric'}
          </button>
        </div>
      </div>
    </div>
  );
}