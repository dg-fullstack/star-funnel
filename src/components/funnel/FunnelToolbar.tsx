import { memo, useRef } from 'react';
import { Download, Upload, Trash2, AlertTriangle, FileJson } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';

interface FunnelToolbarProps {
  onExport: () => string;
  onImport: (json: string) => boolean;
  onClear: () => void;
  validationIssues: string[];
}

const FunnelToolbar = memo(({ onExport, onImport, onClear, validationIssues }: FunnelToolbarProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const json = onExport();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `funnel-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Funnel exported',
      description: 'Your funnel has been downloaded as JSON.',
    });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const success = onImport(content);
      
      if (success) {
        toast({
          title: 'Funnel imported',
          description: 'Your funnel has been loaded successfully.',
        });
      } else {
        toast({
          title: 'Import failed',
          description: 'Invalid funnel JSON file.',
          variant: 'destructive',
        });
      }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  };

  const hasIssues = validationIssues.length > 0;

  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <FileJson className="h-5 w-5 text-primary" />
          <h1 className="font-semibold text-foreground">Funnel Builder</h1>
        </div>
        
        {hasIssues && (
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-destructive hover:text-destructive gap-1.5"
                aria-label={`${validationIssues.length} validation issues`}
              >
                <AlertTriangle className="h-4 w-4" />
                <span className="text-xs">{validationIssues.length} issue(s)</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-2">
                <h3 className="font-medium text-sm">Validation Issues</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {validationIssues.map((issue, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <AlertTriangle className="h-3.5 w-3.5 text-destructive mt-0.5 shrink-0" />
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Import funnel file"
        />
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleImportClick}
          className="gap-1.5"
        >
          <Upload className="h-4 w-4" />
          Import
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleExport}
          className="gap-1.5"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1.5 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear funnel?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove all nodes and connections. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onClear} className="bg-destructive hover:bg-destructive/90">
                Clear All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </header>
  );
});

FunnelToolbar.displayName = 'FunnelToolbar';

export default FunnelToolbar;
