export type ViewMode = 'grid' | 'list' | 'timeline'
export type SortBy = 'updatedAt' | 'endDate' | 'name'
export type SortOrder = 'asc' | 'desc'

export interface FilterState {
  status: string
  priority: string
  sortBy: SortBy
  sortOrder: SortOrder
}

export interface ProjectFiltersProps {
  status: string
  priority: string
  sortBy: SortBy
  onStatusChange: (value: string) => void
  onPriorityChange: (value: string) => void
  onSortChange: (value: SortBy) => void
}