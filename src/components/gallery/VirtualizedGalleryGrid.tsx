
import React, { memo, useMemo } from 'react';
import { FixedSizeGrid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { DetailedMediaInfo } from '@/api/imageApi';
import { useGalleryGrid } from '@/hooks/use-gallery-grid';
import { useGalleryMediaTracking } from '@/hooks/use-gallery-media-tracking';
import GalleryGridCell from './GalleryGridCell';
import DateSelector from './DateSelector';
import { useMediaDates } from '@/hooks/use-media-dates';
import { MediaListResponse } from '@/types/gallery';
import { 
  calculateRowCount, 
  calculateGridParameters,
  getScrollbarWidth
} from '@/utils/grid-utils';

interface VirtualizedGalleryGridProps {
  mediaResponse: MediaListResponse;
  selectedIds: string[];
  onSelectId: (id: string, extendSelection: boolean) => void;
  columnsCount: number;
  viewMode?: 'single' | 'split';
  showDates?: boolean;
  updateMediaInfo?: (id: string, info: DetailedMediaInfo) => void;
  position: 'source' | 'destination';
  gap?: number; // Ajout du paramètre gap
}

/**
 * A virtualized grid component that efficiently renders large collections of media items
 * With improved dimension calculations to prevent gaps
 */
const VirtualizedGalleryGrid = memo(({
  mediaResponse,
  selectedIds,
  onSelectId,
  columnsCount = 5,
  viewMode = 'single',
  showDates = false,
  updateMediaInfo,
  position = 'source',
  gap = 8 // Valeur par défaut
}: VirtualizedGalleryGridProps) => {
  const mediaIds = mediaResponse?.mediaIds || [];
  
  // Use custom hook for grid management
  const {
    gridRef,
    gridKey,
    scrollPositionRef
  } = useGalleryGrid();
  
  // Use hook for date navigation
  const { dateIndex, scrollToYearMonth } = useMediaDates(mediaResponse);
  
  // Use hook for tracking media changes to optimize rendering
  useGalleryMediaTracking(mediaResponse, gridRef);
  
  // Calculate the number of rows based on media and columns
  const rowCount = calculateRowCount(mediaIds.length, columnsCount);
  
  // Get the scrollbar width
  const scrollbarWidth = useMemo(() => getScrollbarWidth(), []);
  
  // Handle year-month selection
  const handleSelectYearMonth = (year: number, month: number) => {
    scrollToYearMonth(year, month, gridRef);
  };
  
  // Memoize the item data to prevent unnecessary renders
  const itemData = useMemo(() => ({
    mediaIds,
    selectedIds,
    onSelectId,
    showDates,
    updateMediaInfo,
    position,
    columnsCount,
    gap,
    // Simplified cell style calculator - now uniform for all columns
    calculateCellStyle: (originalStyle: React.CSSProperties) => {
      return {
        ...originalStyle,
        width: `${parseFloat(originalStyle.width as string) - gap}px`,
        height: `${parseFloat(originalStyle.height as string) - gap}px`,
        paddingRight: gap,
        paddingBottom: gap,
      };
    }
  }), [mediaIds, selectedIds, onSelectId, showDates, updateMediaInfo, position, columnsCount, gap]);
  
  return (
    <div className="w-full h-full p-2 gallery-container relative">
      <AutoSizer key={`gallery-grid-${gridKey}`}>
        {({ height, width }) => {
          // Use the enhanced calculation function for all grid parameters
          const { 
            itemWidth, 
            itemHeight, 
            leftoverSpace 
          } = calculateGridParameters(width, columnsCount, gap, showDates);
          
          // Calculate the actual column width including gap distribution
          const columnWidth = itemWidth + gap;
          
          // Apply padding to ensure no overlap with scrollbar
          const adjustedWidth = width - scrollbarWidth + 1;
          
          return (
            <FixedSizeGrid
              ref={gridRef}
              columnCount={columnsCount}
              columnWidth={columnWidth}
              height={height}
              rowCount={rowCount}
              rowHeight={itemHeight + gap}
              width={width}
              itemData={itemData}
              overscanRowCount={5}
              overscanColumnCount={2}
              itemKey={({ columnIndex, rowIndex }) => {
                const index = rowIndex * columnsCount + columnIndex;
                return index < mediaIds.length ? mediaIds[index] : `empty-${rowIndex}-${columnIndex}`;
              }}
              onScroll={({ scrollTop }) => {
                scrollPositionRef.current = scrollTop;
              }}
              initialScrollTop={scrollPositionRef.current}
              className="scrollbar-vertical"
              style={{ 
                overflowX: 'hidden',
                scrollbarGutter: 'stable' as any // Reserve space for the scrollbar
              }}
            >
              {GalleryGridCell}
            </FixedSizeGrid>
          );
        }}
      </AutoSizer>
      
      {dateIndex.years.length > 0 && (
        <DateSelector
          years={dateIndex.years}
          monthsByYear={dateIndex.monthsByYear}
          onSelectYearMonth={handleSelectYearMonth}
          position={position}
        />
      )}
    </div>
  );
});

// Set component display name for debugging
VirtualizedGalleryGrid.displayName = 'VirtualizedGalleryGrid';

export default VirtualizedGalleryGrid;
