
import React from 'react';
import { Button } from '@/components/ui/button';
import { Server, GalleryHorizontal, GalleryVertical, GalleryVerticalEnd, RotateCcw } from 'lucide-react';
import { MobileViewMode } from '@/types/gallery';
import { useIsMobile } from '@/hooks/use-breakpoint';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '@/hooks/use-language';

interface PageHeaderProps {
  onRefresh: () => void;
  isDeletionPending: boolean;
  isSidebarOpen: boolean;
  onCloseSidebars: () => void;
  mobileViewMode: MobileViewMode;
  setMobileViewMode: React.Dispatch<React.SetStateAction<MobileViewMode>>;
  selectedIdsLeft: string[];
  selectedIdsRight: string[];
  onDelete: () => void;
  onToggleServerPanel: () => void;
  isServerPanelOpen: boolean;
  onResetColumns: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  onToggleServerPanel,
  isServerPanelOpen,
  mobileViewMode,
  setMobileViewMode,
  onResetColumns,
}) => {
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  
  return (
    <header className="relative z-20 flex items-center justify-between gap-2 p-2 md:p-4 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="flex items-center gap-3">
        <div>
          <img 
            src="/lovable-uploads/ddf36f1d-ca4f-4437-8e57-df7c6f916ccc.png" 
            alt="Logo" 
            className="h-8 md:h-10"
          />
        </div>
        
        {/* Desktop view mode switcher */}
        {!isMobile && (
          <div className="ml-4 flex gap-2 bg-background/90 shadow-sm border border-border/30 rounded-full p-1">
            <Button
              variant={mobileViewMode === 'left' ? "default" : "ghost"}
              size="icon"
              onClick={() => setMobileViewMode('left')}
              className="h-8 w-8 rounded-full"
              title="Source Gallery Only"
            >
              <GalleryVertical className="h-4 w-4" />
            </Button>
            
            <Button
              variant={mobileViewMode === 'both' ? "default" : "ghost"}
              size="icon"
              onClick={() => setMobileViewMode('both')}
              className="h-8 w-8 rounded-full"
              title="Split View"
            >
              <GalleryHorizontal className="h-4 w-4" />
            </Button>
            
            <Button
              variant={mobileViewMode === 'right' ? "default" : "ghost"}
              size="icon"
              onClick={() => setMobileViewMode('right')}
              className="h-8 w-8 rounded-full"
              title="Destination Gallery Only"
            >
              <GalleryVerticalEnd className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onResetColumns}
                variant="outline"
                size={isMobile ? "icon" : "default"}
                className="relative"
              >
                <RotateCcw className={isMobile ? "h-4 w-4" : "h-4 w-4 mr-2"} />
                {!isMobile && t('reset_columns')}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('reset_columns')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <ThemeToggle />
        <LanguageToggle />
        
        <Button
          onClick={onToggleServerPanel}
          variant={isServerPanelOpen ? "default" : "outline"}
          size={isMobile ? "icon" : "default"}
          className="relative"
        >
          {isMobile ? (
            <Server className="h-4 w-4" />
          ) : (
            <>
              <Server className="h-4 w-4 mr-2" />
              <span>Serveur</span>
            </>
          )}
        </Button>
      </div>
    </header>
  );
};

export default PageHeader;
